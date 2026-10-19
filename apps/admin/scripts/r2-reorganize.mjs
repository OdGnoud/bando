#!/usr/bin/env node
// Migrate R2 objects from flat products/<uuid>.webp -> products/<productId>/<imageId>.<ext>
// Usage: node scripts/r2-reorganize.mjs  (reads apps/admin/.env)
import { readFileSync } from 'fs';
import { createHash, createHmac } from 'crypto';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envRaw = readFileSync(join(root, '.env'), 'utf8');
const env = {};
for (const line of envRaw.split('\n')) {
  const m = line.replace(/\r$/, '').match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const endpoint = env.CLOUDFLARE_R2_ENDPOINT;
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = env.R2_BUCKET;
const r2PublicBaseUrl = env.R2_PUBLIC_BASE_URL;
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

for (const [k, v] of Object.entries({ endpoint, accessKeyId, secretAccessKey, bucket, r2PublicBaseUrl, supabaseUrl, serviceKey })) {
  if (!v) throw new Error(`Missing env ${k}`);
}

const R2_REGION = 'auto';
const UNSIGNED_PAYLOAD_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const hashHex = (v) => createHash('sha256').update(v).digest('hex');
const hmac = (k, v) => createHmac('sha256', k).update(v).digest();
const hmacHex = (k, v) => createHmac('sha256', k).update(v).digest('hex');
const enc = (v) => encodeURIComponent(v).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

async function signedFetch(method, key, body) {
  const canonicalUri = `/${enc(bucket)}/${key.split('/').map(enc).join('/')}`;
  const url = `${endpoint}${canonicalUri}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = body ? hashHex(body) : UNSIGNED_PAYLOAD_HASH;
  const headers = { host: new URL(endpoint).host, 'x-amz-content-sha256': payloadHash, 'x-amz-date': amzDate };
  const keys = Object.keys(headers).sort();
  const canonicalHeaders = keys.map((k) => `${k}:${headers[k].trim()}\n`).join('');
  const signedHeaders = keys.join(';');
  const canonicalRequest = [method, canonicalUri, '', canonicalHeaders, signedHeaders, payloadHash].join('\n');
  const credentialScope = `${dateStamp}/${R2_REGION}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, hashHex(canonicalRequest)].join('\n');
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const regionKey = hmac(dateKey, R2_REGION);
  const serviceKey = hmac(regionKey, 's3');
  const signingKey = hmac(serviceKey, 'aws4_request');
  const signature = hmacHex(signingKey, stringToSign);
  return fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body: body ?? undefined,
  });
}

async function supabaseQuery(path) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

async function supabaseUpdate(id, patch) {
  const res = await fetch(`${supabaseUrl}/rest/v1/product_images?id=eq.${id}`, {
    method: 'PATCH',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Update ${res.status}: ${await res.text()}`);
}

const rows = await supabaseQuery('product_images?select=id,product_id,url&order=id');
console.log(`Total product_images rows: ${rows.length}`);

let migrated = 0;
let skipped = 0;
let failed = 0;

for (const row of rows) {
  const url = row.url;
  if (!url.startsWith(`${r2PublicBaseUrl}/`)) {
    console.log(`SKIP (khong phai R2 cua chung ta): ${url.slice(0, 90)}`);
    skipped++;
    continue;
  }
  const oldKey = url.slice(r2PublicBaseUrl.length + 1);
  if (!oldKey.startsWith('products/') || oldKey.split('/').length !== 2) {
    console.log(`SKIP (khong hop le): ${oldKey}`);
    skipped++;
    continue;
  }
  const ext = oldKey.split('.').pop() || 'webp';
  const newKey = `products/${row.product_id}/${row.id}.${ext}`;
  if (oldKey === newKey) {
    console.log(`SKIP (da dung thu muc): ${oldKey}`);
    skipped++;
    continue;
  }
  try {
    const objRes = await fetch(url);
    if (!objRes.ok) throw new Error(`GET ${objRes.status}`);
    const buf = Buffer.from(await objRes.arrayBuffer());

    const putRes = await signedFetch('PUT', newKey, buf);
    if (!putRes.ok) throw new Error(`PUT ${putRes.status}: ${(await putRes.text()).slice(0, 150)}`);

    const delRes = await signedFetch('DELETE', oldKey);
    if (!delRes.ok && delRes.status !== 404) throw new Error(`DELETE ${delRes.status}`);

    await supabaseUpdate(row.id, { url: `${r2PublicBaseUrl}/${newKey}` });
    console.log(`OK: ${oldKey} -> ${newKey}`);
    migrated++;
  } catch (err) {
    failed++;
    console.error(`FAIL: ${oldKey} -> ${newKey}: ${err.message}`);
  }
}

console.log(`\nDone. migrated=${migrated} skipped=${skipped} failed=${failed}`);
