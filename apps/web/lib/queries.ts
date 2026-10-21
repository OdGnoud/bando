import { d1Query } from '@/lib/d1';
import type { Category, ProductWithRelations, PromoEvent } from './types';
import { DEFAULT_CATEGORIES } from './demo-products';

export async function getActivePromoEvents(): Promise<PromoEvent[]> {
  return [];
}

export async function getCategories(): Promise<Category[]> {
  try {
    const list = await d1Query('SELECT * FROM categories ORDER BY display_order ASC, name ASC;');
    if (list && list.length > 0) {
      return list.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sort_order: c.display_order || 0,
        created_at: c.created_at || new Date().toISOString(),
      }));
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function getProducts(opts?: {
  category?: string;
  featured?: boolean;
  newArrival?: boolean;
  limit?: number;
  status?: string;
}): Promise<ProductWithRelations[]> {
  try {
    let sql = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (opts?.category) {
      conditions.push('category_id IN (SELECT id FROM categories WHERE slug = ? OR id = ?)');
      params.push(opts.category, opts.category);
    }
    if (opts?.status) {
      conditions.push('status = ?');
      params.push(opts.status);
    }
    if (opts?.featured) {
      conditions.push('is_featured = 1');
    }
    if (opts?.newArrival) {
      conditions.push('is_new_arrival = 1');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (opts?.limit) {
      sql += ` LIMIT ${opts.limit}`;
    }

    const [products, images, categories] = await Promise.all([
      d1Query(sql, params),
      d1Query('SELECT * FROM product_images ORDER BY sort_order ASC;'),
      d1Query('SELECT * FROM categories;'),
    ]);

    const catMap = new Map(categories.map((c: any) => [c.id, c]));

    return products.map((p: any) => ({
      ...p,
      category: p.category_id ? catMap.get(p.category_id) || null : null,
      product_images: images
        .filter((img: any) => img.product_id === p.id)
        .map((img: any) => ({
          id: img.id,
          product_id: img.product_id,
          url: img.url,
          alt: null,
          sort_order: img.sort_order || 0,
          created_at: new Date().toISOString(),
        })),
    }));
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const products = await d1Query('SELECT * FROM products WHERE slug = ? LIMIT 1;', [slug]);
    if (!products || products.length === 0) return null;
    const p = products[0];

    const [images, categories] = await Promise.all([
      d1Query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC;', [p.id]),
      d1Query('SELECT * FROM categories WHERE id = ? LIMIT 1;', [p.category_id]),
    ]);

    return {
      ...p,
      category: categories[0] || null,
      product_images: images.map((img: any) => ({
        id: img.id,
        product_id: img.product_id,
        url: img.url,
        alt: null,
        sort_order: img.sort_order || 0,
        created_at: new Date().toISOString(),
      })),
    };
  } catch {
    return null;
  }
}