import { NextResponse, type NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { r2UploadObject, r2PublicUrl } from '@/lib/r2';
import { isRateLimited, ipFromRequest } from '@/lib/rate-limit';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const ip = ipFromRequest(request.headers);
  if (isRateLimited(`img:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  let file: File | null = null;
  let productId: string | null = null;
  try {
    const form = await request.formData();
    const f = form.get('file');
    if (f instanceof File) file = f;
    const pid = form.get('productId');
    if (typeof pid === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pid)) {
      productId = pid;
    }
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ error: 'missing_product_id' }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 });
  }

  const key = `products/${productId}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await r2UploadObject(key, buffer, file.type);
  } catch (err) {
    console.error('R2 upload failed:', err);
    const detail = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ error: 'upload_failed', detail }, { status: 502 });
  }

  return NextResponse.json({ url: r2PublicUrl(key) });
}