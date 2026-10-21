export type ProductStatus = 'available' | 'sold';

export const CONDITION_OPTIONS = [
  'Mới 100% nguyên hộp',
  'Đồ cũ tuyển chọn (90-95%)',
  'Like New (98-99%)',
  'Cổ / Sưu tầm',
] as const;
export type ConditionOption = (typeof CONDITION_OPTIONS)[number];

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  price: number;
  condition_label: string;
  status: ProductStatus;
  short_description: string | null;
  full_description: string | null;
  defects_notes: string | null;
  accessories: string | null;
  location: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  facebook_post_id?: string | null;
  facebook_posted_at?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  category?: Category | null;
  product_images?: ProductImage[];
}

export interface ProductWithRelations extends Product {
  category: Category | null;
  product_images: ProductImage[];
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Còn Hàng',
  sold: 'Đã Hết',
};

export interface PromoEvent {
  id: string;
  name: string;
  description: string | null;
  banner_title: string | null;
  banner_body: string | null;
  background: string;
  tone: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const STATUS_COLORS: Record<ProductStatus, string> = {
  available: 'bg-[#606C38]/10 text-[#606C38] border-[#606C38]/30',
  sold: 'bg-zinc-200 text-zinc-600 border-zinc-300',
};

export function formatPrice(price: number): string {
  return '¥' + new Intl.NumberFormat('ja-JP').format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
