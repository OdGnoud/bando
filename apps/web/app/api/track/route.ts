import { NextResponse } from 'next/server';
import { getAnonClient } from '@/lib/supabase/anon-server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body.path === 'string' ? body.path : null;
  if (!path || path.length > 300) {
    return NextResponse.json({ ok: false });
  }

  const client = getAnonClient();
  if (!client) {
    return NextResponse.json({ ok: false });
  }

  const { error } = await client.from('page_views').insert({
    path: path.slice(0, 300),
    referrer:
      typeof body.referrer === 'string' && body.referrer.length > 0
        ? body.referrer.slice(0, 500)
        : null,
    visitor_id:
      typeof body.visitor_id === 'string' && body.visitor_id.length > 0
        ? body.visitor_id.slice(0, 64)
        : null,
  });

  return NextResponse.json({ ok: !error });
}
