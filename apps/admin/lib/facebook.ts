import { formatPrice } from '@gdl/shared/lib/types';

const GRAPH_BASE = 'https://graph.facebook.com/v25.0';
const MAX_PHOTOS = 5;

const pageId = process.env.META_PAGE_ID;
const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;

function isConfigured(): boolean {
  return Boolean(pageId && pageAccessToken);
}

export function productUrl(slug: string): string {
  return `https://gocdoluot.roomme.io.vn/san-pham/${slug}`;
}

export function buildProductMessage(
  product: {
    name: string;
    price: number;
    condition_label: string;
    location: string | null;
    status: string;
    short_description: string | null;
  },
  url: string
): string {
  const lines = [
    `📱 ${product.name}`,
    `💰 Giá: ${formatPrice(product.price)}`,
  ];
  const extras: string[] = [];
  if (product.location) extras.push(`📍 ${product.location}`);
  extras.push(`Tình trạng: ${product.condition_label}`);
  if (product.status === 'available') extras.push('Còn hàng — chốt nhanh kẻo lỡ!');
  lines.push(extras.join(' • '));
  lines.push('');
  if (product.short_description) lines.push(product.short_description);
  lines.push('');
  lines.push(url);
  lines.push('#GocDoLuot #DoCongNgheCu #DienThoaiCu');
  return lines.join('\n');
}

interface FbError {
  message?: string;
  type?: string;
  code?: number;
}

function fbErrorDetail(data: unknown): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const e = (data as { error: FbError }).error;
    return `${e.type ?? 'facebook'}${e.code ? ` (${e.code})` : ''}: ${e.message ?? 'unknown'}`;
  }
  return 'facebook_api_error';
}

async function graphRequest(
  method: 'POST' | 'DELETE',
  path: string,
  body: Record<string, string>
): Promise<{ ok: boolean; status: number; data: unknown }> {
  if (!isConfigured()) {
    return { ok: false, status: 0, data: { error: { type: 'config', message: 'META_* chưa được cấu hình' } } };
  }
  const form = new URLSearchParams({ access_token: pageAccessToken!, ...body });
  const res = await fetch(`${GRAPH_BASE}/${path}`, {
    method,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

export async function publishProductToFacebook(
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    condition_label: string;
    location: string | null;
    status: string;
    short_description: string | null;
  },
  imageUrls: string[]
): Promise<{ postId: string }> {
  if (!isConfigured()) {
    throw new Error('Facebook chưa được cấu hình (META_PAGE_ID / META_PAGE_ACCESS_TOKEN)');
  }

  const url = productUrl(product.slug);
  const message = buildProductMessage(product, url);

  const mediaFbids: string[] = [];
  for (const imageUrl of imageUrls.slice(0, MAX_PHOTOS)) {
    const { ok, status, data } = await graphRequest('POST', `${pageId}/photos`, {
      url: imageUrl,
      published: 'false',
    });
    if (!ok || !data || typeof data !== 'object' || !('id' in data)) {
      throw new Error(`Upload ảnh lên Facebook thất bại (${status}): ${fbErrorDetail(data)}`);
    }
    mediaFbids.push(String((data as { id: string }).id));
  }

  const body: Record<string, string> = { message, published: 'true' };
  if (mediaFbids.length > 0) {
    body.attached_media = JSON.stringify(mediaFbids.map((media_fbid) => ({ media_fbid })));
  } else {
    body.link = url;
  }

  const { ok, status, data } = await graphRequest('POST', `${pageId}/feed`, body);
  if (!ok || !data || typeof data !== 'object' || !('id' in data)) {
    throw new Error(`Đăng bài lên Facebook thất bại (${status}): ${fbErrorDetail(data)}`);
  }
  return { postId: String((data as { id: string }).id) };
}

export async function updateFacebookPostMessage(
  postId: string,
  message: string
): Promise<void> {
  const { ok, status, data } = await graphRequest('POST', postId, { message });
  if (!ok) {
    throw new Error(`Cập nhật bài Facebook thất bại (${status}): ${fbErrorDetail(data)}`);
  }
}

export async function deleteFacebookPost(postId: string): Promise<void> {
  const { ok, status, data } = await graphRequest('DELETE', postId, {});
  if (!ok) {
    throw new Error(`Gỡ bài Facebook thất bại (${status}): ${fbErrorDetail(data)}`);
  }
}

export function facebookConfigured(): boolean {
  return isConfigured();
}
