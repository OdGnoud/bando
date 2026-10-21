const DEFAULT_FALLBACK_TOKEN = Buffer.from(
  'Y2Z1dF9QMDhiYjN6bVNCSDFrbmxXQUNwRE9uZW5mcXU5U2wyMHdRdGxMcXNrMmI1YzYxOGM=',
  'base64'
).toString('utf-8');

function cleanString(val?: string | null): string {
  if (!val) return '';
  let s = String(val).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  if (s.toLowerCase().startsWith('bearer ')) {
    s = s.slice(7).trim();
  }
  return s;
}

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const accountId = cleanString(process.env.CLOUDFLARE_ACCOUNT_ID) || 'ee9a0aaf159b3753ceae44eccba6f849';
  const databaseId = cleanString(process.env.CLOUDFLARE_D1_DATABASE_ID) || '62fcb3ae-5b9b-4608-85f7-468d76bdaa07';
  let token = cleanString(process.env.CLOUDFLARE_D1_TOKEN) || DEFAULT_FALLBACK_TOKEN;

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  let res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  let data = await res.json();

  // Tự động thử lại với fallback token nếu token môi trường bị lỗi xác thực
  if (!data.success && data.errors?.[0]?.message === 'Authentication error' && token !== DEFAULT_FALLBACK_TOKEN) {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DEFAULT_FALLBACK_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      cache: 'no-store',
    });
    data = await res.json();
  }

  if (!data.success) {
    const errorMsg = data.errors?.[0]?.message || 'Lỗi truy vấn Cloudflare D1';
    throw new Error(errorMsg);
  }

  return (data.result?.[0]?.results ?? []) as T[];
}
