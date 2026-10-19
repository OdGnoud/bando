import { getAnonClient } from './supabase/anon-server';
import type { Category, ProductWithRelations, PromoEvent } from './types';

export async function getActivePromoEvents(): Promise<PromoEvent[]> {
  const client = getAnonClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('promo_events')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !data) return [];
    const now = new Date().toISOString();
    return (data as PromoEvent[]).filter((e) => {
      if (e.starts_at && e.starts_at > now) return false;
      if (e.ends_at && e.ends_at < now) return false;
      return true;
    });
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  const client = getAnonClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error || !data) return [];
    return data as Category[];
  } catch {
    return [];
  }
}

export async function getProducts(opts?: {
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
  limit?: number;
  status?: string;
}): Promise<ProductWithRelations[]> {
  const client = getAnonClient();
  if (!client) return [];

  try {
    let query = client
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .order('created_at', { ascending: false });

    if (opts?.category) {
      query = query.eq('category_id', opts.category);
    }
    if (opts?.featured) {
      query = query.eq('is_featured', true);
    }
    if (opts?.newArrival) {
      query = query.eq('is_new_arrival', true);
    }
    if (opts?.status) {
      query = query.eq('status', opts.status);
    }
    if (opts?.limit) {
      query = query.limit(opts.limit);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as ProductWithRelations[];
  } catch {
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithRelations | null> {
  const client = getAnonClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('products')
      .select('*, category:categories(*), product_images(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return data as ProductWithRelations;
  } catch {
    return null;
  }
}