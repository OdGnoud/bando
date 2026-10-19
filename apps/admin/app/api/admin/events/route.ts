import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const eventSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).nullable().optional(),
  banner_title: z.string().trim().max(200).nullable().optional(),
  banner_body: z.string().trim().max(300).nullable().optional(),
  background: z.string().trim().max(20).default('#18181b'),
  tone: z.enum(['emerald', 'zinc', 'amber']).default('emerald'),
  starts_at: z.string().nullable().optional(),
  ends_at: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

const updateSchema = eventSchema.extend({ id: z.string().uuid() });
const deleteSchema = z.object({ id: z.string().uuid() });

function normalize(body: z.infer<typeof eventSchema>) {
  return {
    name: body.name,
    description: body.description || null,
    banner_title: body.banner_title || null,
    banner_body: body.banner_body || null,
    background: body.background,
    tone: body.tone,
    starts_at: body.starts_at || null,
    ends_at: body.ends_at || null,
    is_active: body.is_active,
    sort_order: body.sort_order,
  };
}

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('promo_events')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof eventSchema>;
  try {
    body = eventSchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('promo_events')
    .insert(normalize(body))
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'create_failed' }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof updateSchema>;
  try {
    body = updateSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { id, ...rest } = body;
  const { error } = await supabaseAdmin
    .from('promo_events')
    .update({ ...normalize(rest), updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof deleteSchema>;
  try {
    body = deleteSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('promo_events').delete().eq('id', body.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}