import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductsClientList } from '@/components/web/products-client-list';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm Gốm Mới | Komorebi Ceramic',
  description:
    'Danh mục trọn bộ chén, bát, ly tách trà, bình hoa thủ công mới 100% từ Nhật Bản.',
};

const DEMO_CERAMICS = [
  {
    id: 'demo-1',
    name: 'Tách Trà Men Hỏa Biến Thủ Công Kèm Đĩa Lót Gỗ Tuyết Tùng',
    slug: 'tach-tra-men-hoa-bien-kem-dia-lot-go',
    price: 350000,
    condition_label: 'Mới 100% (Nguyên hộp, triện vàng 手造り)',
    status: 'available' as const,
    short_description: 'Men lam hỏa biến óng ánh, quai cầm công thái học, kèm đế lót gỗ mộc.',
    full_description: 'Sản phẩm mới 100% xuất xưởng từ lò thủ công. Thân gốm dán triện chứng nhận nghệ nhân 手造り.',
    defects_notes: null,
    accessories: 'Hộp giấy mộc Nhật Bản + Đĩa lót gỗ tuyết tùng',
    location: 'Hàng sẵn kho / Giao hàng toàn quốc',
    is_featured: true,
    is_new_arrival: true,
    facebook_post_id: null,
    facebook_posted_at: null,
    sort_order: 1,
    category_id: 'cat-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    category: { id: 'cat-1', name: 'Tách & Chén Trà', slug: 'coc-tach', sort_order: 1, created_at: '' },
    product_images: [
      {
        id: 'img-1',
        product_id: 'demo-1',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        alt: 'Tách trà men hỏa biến mới 100%',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
  {
    id: 'demo-2',
    name: 'Bát Cơm Men Nâu Đen Núm Gợn Sóng Có Nắp Giữ Nhiệt',
    slug: 'bat-com-men-den-nau-co-nap-day',
    price: 290000,
    condition_label: 'Mới 100% (New & Full Box)',
    status: 'available' as const,
    short_description: 'Nắp đậy giữ nóng canh súp và cơm, men láng mịn tráng thủ công.',
    full_description: 'Sản phẩm mới tinh nguyên hộp. Tạo hình nắp vòm độc đáo với núm cầm lượn sóng nghệ thuật.',
    defects_notes: null,
    accessories: 'Kèm nắp gốm đồng bộ + Hộp chính hãng',
    location: 'Hàng sẵn kho / Giao hàng toàn quốc',
    is_featured: true,
    is_new_arrival: true,
    sort_order: 2,
    category_id: 'cat-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    category: { id: 'cat-2', name: 'Bát & Tô', slug: 'bat-to', sort_order: 2, created_at: '' },
    product_images: [
      {
        id: 'img-2',
        product_id: 'demo-2',
        url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80',
        alt: 'Bát gốm có nắp mới 100%',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
  {
    id: 'demo-3',
    name: 'Set Hộp Quà Tặng Đôi Bát Cơm Hoa Anh Đào Pastel Kèm Đũa Tre',
    slug: 'set-cap-bat-com-hoa-anh-dao-meoto',
    price: 520000,
    condition_label: 'Mới 100% (Hộp quà tặng cao cấp)',
    status: 'available' as const,
    short_description: 'Set Meoto Chawan mới 100% gồm 2 bát có nắp, 2 khay sơn mài đen và 2 đôi đũa tre.',
    full_description: 'Bộ quà tặng cao cấp mới tinh nguyên hộp dành cho tân gia, đám cưới.',
    defects_notes: null,
    accessories: 'Fullbox: 2 bát có nắp + 2 đế lót + 2 đôi đũa tre nơ đỏ',
    location: 'Hàng sẵn kho / Giao hàng toàn quốc',
    is_featured: true,
    is_new_arrival: true,
    sort_order: 3,
    category_id: 'cat-3',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    category: { id: 'cat-3', name: 'Set Cặp Đôi & Quà Tặng', slug: 'set-doi', sort_order: 3, created_at: '' },
    product_images: [
      {
        id: 'img-3',
        product_id: 'demo-3',
        url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        alt: 'Set đôi quà tặng mới 100%',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
  {
    id: 'demo-4',
    name: 'Bát Đánh Trà Matcha Chawan Nghệ Nhân Men Thô Wabi-sabi',
    slug: 'bat-matcha-chawan-mieng-nghieng-men-moc',
    price: 390000,
    condition_label: 'Mới 100% (Nghệ nhân đắp tay thủ công)',
    status: 'available' as const,
    short_description: 'Mới xuất lò từ nghệ nhân gốm. Tạo hình miệng vát tự nhiên, bề mặt men sần.',
    full_description: 'Bát trà Matcha chawan mới 100%, đắp tay hoàn toàn theo phong cách Wabi-sabi.',
    defects_notes: null,
    accessories: 'Hộp mộc lót vải chống sốc',
    location: 'Hàng sẵn kho / Giao hàng toàn quốc',
    is_featured: false,
    is_new_arrival: true,
    sort_order: 4,
    category_id: 'cat-2',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 'user-1',
    category: { id: 'cat-2', name: 'Bát & Tô', slug: 'bat-to', sort_order: 2, created_at: '' },
    product_images: [
      {
        id: 'img-4',
        product_id: 'demo-4',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        alt: 'Bát matcha chawan mới 100%',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
];

export default async function ProductsPage() {
  const [dbProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = dbProducts.length > 0 ? dbProducts : DEMO_CERAMICS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Suspense fallback={<div className="py-20 text-center text-[#706A61]">Đang tải bộ sưu tập gốm...</div>}>
        <ProductsClientList initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  );
}

