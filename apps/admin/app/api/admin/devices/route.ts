import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth';
import { MAX_ACTIVE_DEVICES } from '@/lib/device';
import { supabaseAdmin } from '@/lib/supabase/admin';

const actionSchema = z.object({
  action: z.enum(['approve', 'revoke']),
  row_id: z.string().uuid(),
});

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('user_sessions')
    .select(
      'id, device_id, device_label, user_agent, ip, status, last_seen_at, approved_at, created_at'
    )
    .eq('user_id', admin.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'query_failed' }, { status: 500 });
  }

  return NextResponse.json({ devices: data ?? [], max: MAX_ACTIVE_DEVICES });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof actionSchema>;
  try {
    body = actionSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { data: row } = await supabaseAdmin
    .from('user_sessions')
    .select('id, status')
    .eq('id', body.row_id)
    .eq('user_id', admin.user.id)
    .maybeSingle();

  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (body.action === 'revoke') {
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .update({
        status: 'revoked',
        last_seen_at: null,
        refresh_hash: null,
      })
      .eq('id', row.id);
    if (error) {
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('user_sessions')
    .update({
      status: 'active',
      approved_at: now,
      approved_by: admin.user.id,
      last_seen_at: now,
    })
    .eq('id', row.id);

  if (error) {
    if (error.message.includes('device_limit_reached')) {
      return NextResponse.json(
        { error: 'device_limit_reached', max: MAX_ACTIVE_DEVICES },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}