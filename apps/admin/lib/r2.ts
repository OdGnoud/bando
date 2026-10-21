import { createHash, createHmac } from 'crypto';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET;
export const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

export function checkR2Config() {
  if (!accountId || !endpoint || !accessKeyId || !secretAccessKey || !bucket || !r2PublicBaseUrl) {
    throw new Error(
      'Thiếu cấu hình R2: CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_R2_ENDPOINT / CLOUDFLARE_R2_ACCESS_KEY_ID / CLOUDFLARE_R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_BASE_URL'
    );
  }
}

const R2_REGION = 'auto';
const UNSIGNED_PAYLOAD_HASH =
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

function hashHex(value: string | ArrayBuffer | Buffer): string {
  return createHash('sha256')
    .update(typeof value === 'string' ? value : Buffer.from(value))
    .digest('hex');
}

function hmac(key: Buffer | string, value: string): Buffer {
  return createHmac('sha256', key).update(value).digest();
}

function hmacHex(key: Buffer | string, value: string): string {
  return createHmac('sha256', key).update(value).digest('hex');
}

function encodeRfc3986(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

async function signedR2Fetch({
  method,
  path,
  body,
  contentType,
}: {
  method: 'GET' | 'PUT' | 'DELETE';
  path: string;
  body?: Buffer;
  contentType?: string;
}): Promise<Response> {
  checkR2Config();
  const endpointUrl = new URL(endpoint!);
  const canonicalUri = `/${encodeRfc3986(bucket!)}${path ? `/${path.split('/').map(encodeRfc3986).join('/')}` : ''}`;
  const url = `${endpoint}${canonicalUri}`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = body ? hashHex(body) : UNSIGNED_PAYLOAD_HASH;

  const headers: Record<string, string> = {
    host: endpointUrl.host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };
  if (contentType) headers['content-type'] = contentType;

  const signedHeaderKeys = Object.keys(headers).sort();
  const canonicalHeaders = signedHeaderKeys
    .map((key) => `${key}:${headers[key].trim()}\n`)
    .join('');
  const signedHeaders = signedHeaderKeys.join(';');
  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const credentialScope = `${dateStamp}/${R2_REGION}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    hashHex(canonicalRequest),
  ].join('\n');
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

export async function r2UploadObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  const res = await signedR2Fetch({ method: 'PUT', path: key, body, contentType });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`R2 PUT ${res.status}`, text.slice(0, 300));
    throw new Error(`R2 PUT ${res.status}: ${text.slice(0, 200)}`);
  }
}

export async function r2DeleteObject(key: string): Promise<void> {
  const res = await signedR2Fetch({ method: 'DELETE', path: key });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '');
    console.error(`R2 DELETE ${res.status}`, text.slice(0, 300));
    throw new Error(`R2 DELETE ${res.status}: ${text.slice(0, 200)}`);
  }
}

export function keyFromR2Url(url: string): string | null {
  if (!url.startsWith(`${r2PublicBaseUrl}/`)) return null;
  return url.slice((r2PublicBaseUrl as string).length + 1);
}

export function r2PublicUrl(key: string): string {
  return `${r2PublicBaseUrl}/${key}`;
}
