import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { isAppAdmin } from '@/lib/auth';
import { randomToken, sha256Hex } from '@/lib/crypto';
import { hashUserAgent, deviceNameFromUA } from '@/lib/device';
import { isRateLimited, ipFromRequest } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase/admin';

const bodySchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  device_id: z.string().min(1).max(64).optional(),
  device_label: z.string().trim().max(100).optional().nullable(),
  user_agent: z.string().trim().max(500).optional().nullable(),
});

type ParsedBody = z.infer<typeof bodySchema>;

function aalOf(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8')
    );
    return typeof payload.aal === 'string' ? payload.aal : null;
  } catch {
    return null;
  }
}

function sessionCookieName(): string {
  const ref = process.env.NEXT_PUBLIC_SUPABASE_URL!.match(/https:\/\/([^.]+)\./)?.[1];
  return `sb-${ref}-auth-token`;
}

function setAuthCookies(accessToken: string, refreshToken: string) {
  const store = cookies();
  // Session cookie must be JS-readable: the client auth provider
  // (@supabase/ssr createBrowserClient) reads it via document.cookie.
  store.set(
    sessionCookieName(),
    JSON.stringify({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
    }),
    {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    }
  );
}

async function registerSession(
  user: { id: string },
  body: ParsedBody,
  ip: string | null
): Promise<NextResponse> {
  const refreshHash = await sha256Hex(body.refresh_token);
  const deviceId = await hashUserAgent(body.user_agent ?? '');
  const deviceLabel = deviceNameFromUA(body.user_agent ?? '');
  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin
    .from('user_sessions')
    .select('*')
    .eq('user_id', user.id)
    .eq('device_id', deviceId)
    .maybeSingle();

  if (existing && existing.status === 'active') {
    await supabaseAdmin
      .from('user_sessions')
      .update({
        refresh_hash: refreshHash,
        device_label: deviceLabel,
        user_agent: body.user_agent ?? null,
        ip,
        last_seen_at: now,
      })
      .eq('id', existing.id);
    setAuthCookies(body.access_token, body.refresh_token);
    return NextResponse.json({ status: 'ok' });
  }

  if (existing && existing.status === 'revoked') {
    await supabaseAdmin
      .from('user_sessions')
      .update({
        status: 'active',
        approval_token: null,
        refresh_hash: refreshHash,
        device_label: deviceLabel,
        user_agent: body.user_agent ?? existing.user_agent,
        ip,
        approved_at: now,
        last_seen_at: now,
      })
      .eq('id', existing.id);
    setAuthCookies(body.access_token, body.refresh_token);
    return NextResponse.json({ status: 'ok' });
  }

  if (existing && existing.status === 'pending') {
    await supabaseAdmin
      .from('user_sessions')
      .update({
        status: 'active',
        approval_token: null,
        refresh_hash: refreshHash,
        user_agent: body.user_agent ?? existing.user_agent,
        ip,
        approved_at: now,
        last_seen_at: now,
      })
      .eq('id', existing.id);
    setAuthCookies(body.access_token, body.refresh_token);
    return NextResponse.json({ status: 'ok' });
  }

  const { data: created, error: insertError } = await supabaseAdmin
    .from('user_sessions')
    .insert({
      user_id: user.id,
      device_id: deviceId,
      device_label: deviceLabel,
      user_agent: body.user_agent ?? null,
      ip,
      refresh_hash: refreshHash,
      status: 'pending',
      approval_token: randomToken(),
    })
    .select()
    .single();

  if (insertError || !created) {
    return NextResponse.json({ error: 'create_failed' }, { status: 500 });
  }

  // Auto-approve: a single-admin tool must never lock its admin out waiting
  // for approval or hitting a device cap. "Thu hồi" on the device page still
  // force-logs-out that device; the next login re-approves it.
  const { data: approved } = await supabaseAdmin
    .from('user_sessions')
    .update({ status: 'active', approved_at: now, last_seen_at: now })
    .eq('id', created.id)
    .select()
    .single();
  if (approved) {
    setAuthCookies(body.access_token, body.refresh_token);
    return NextResponse.json({ status: 'ok' });
  }

  return NextResponse.json({
    status: 'pending',
    approval_token: created.approval_token,
  });
}

export async function POST(request: NextRequest) {
  const ip = ipFromRequest(request.headers);
  if (isRateLimited(`device:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  let body: ParsedBody;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(body.access_token);
  if (error || !user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const admin = await isAppAdmin(user.id);
  if (!admin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  if (aalOf(body.access_token) !== 'aal2') {
    return NextResponse.json({ status: 'mfa_required' });
  }

  const ipValue = ip === 'unknown' ? null : ip;
  return registerSession(user, body, ipValue);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
  }
  const ip = ipFromRequest(request.headers);
  if (isRateLimited(`device-poll:${ip}:${token}`, 20, 30_000)) {
    return NextResponse.json({ error: 'too_many_requests' }, { status: 429 });
  }

  const { data } = await supabaseAdmin
    .from('user_sessions')
    .select('status')
    .eq('approval_token', token)
    .maybeSingle();

  if (!data) return NextResponse.json({ status: 'gone' });
  return NextResponse.json({ status: data.status });
}