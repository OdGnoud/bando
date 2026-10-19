import { supabaseAdmin } from '@/lib/supabase/admin';

export async function uniqueProductSlug(base: string, excludeId?: string): Promise<string> {
  if (!base) base = 'san-pham';
  let candidate = base;
  for (let i = 1; i <= 50; i++) {
    let query = supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    const { data } = await query;
    if (!data) return candidate;
    if (excludeId && data.id === excludeId) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function uniqueCategorySlug(base: string): Promise<string> {
  if (!base) base = 'danh-muc';
  let candidate = base;
  for (let i = 1; i <= 50; i++) {
    const { data } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}