const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'ee9a0aaf159b3753ceae44eccba6f849';
const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || '62fcb3ae-5b9b-4608-85f7-468d76bdaa07';
const token = process.env.CLOUDFLARE_D1_TOKEN || '';

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
    cache: 'no-store',
  });

  const data = await res.json();
  if (!data.success) {
    const errorMsg = data.errors?.[0]?.message || 'Lỗi truy vấn Cloudflare D1';
    throw new Error(errorMsg);
  }

  return (data.result?.[0]?.results ?? []) as T[];
}
