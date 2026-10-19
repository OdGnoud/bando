import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  publishProductToFacebook,
  deleteFacebookPost,
  facebookConfigured,
} from '@/lib/facebook';

const bodySchema = z.object({ productId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!facebookConfigured()) {
    return NextResponse.json({ error: 'facebook_not_configured' }, { status: 500 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select(
      'id, name, slug, price, condition_label, location, status, short_description, facebook_post_id, product_images(id, url, sort_order)'
    )
    .eq('id', body.productId)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? 'not_found' }, { status: 404 });
  }

  if (product.facebook_post_id) {
    return NextResponse.json({ error: 'already_posted' }, { status: 409 });
  }

  try {
    const { postId } = await publishProductToFacebook(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        condition_label: product.condition_label,
        location: product.location,
        status: product.status,
        short_description: product.short_description,
      },
      (product.product_images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((img) => img.url)
    );
    await supabaseAdmin
      .from('products')
      .update({
        facebook_post_id: postId,
        facebook_posted_at: new Date().toISOString(),
      })
      .eq('id', product.id);
    return NextResponse.json({ ok: true, postId });
  } catch (err) {
    console.error('Facebook publish failed:', err);
    return NextResponse.json(
      { error: 'facebook_publish_failed', detail: err instanceof Error ? err.message : 'unknown' },
      { status: 502 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('id, facebook_post_id')
    .eq('id', body.productId)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? 'not_found' }, { status: 404 });
  }

  if (!product.facebook_post_id) {
    return NextResponse.json({ error: 'not_posted' }, { status: 409 });
  }

  try {
    await deleteFacebookPost(product.facebook_post_id);
    await supabaseAdmin
      .from('products')
      .update({ facebook_post_id: null, facebook_posted_at: null })
      .eq('id', product.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Facebook delete failed:', err);
    return NextResponse.json(
      { error: 'facebook_delete_failed', detail: err instanceof Error ? err.message : 'unknown' },
      { status: 502 }
    );
  }
}
