import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductCard } from '@/components/web/product-card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

interface ProductsPageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentCatSlug = params?.cat;

  const [dbProducts, categories] = await Promise.all([
    getProducts({ category: currentCatSlug }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === currentCatSlug);

  // Filter fallback demo products if database has no rows
  const fallbackFiltered = currentCatSlug
    ? DEMO_CERAMICS.filter((p) => p.category?.slug === currentCatSlug)
    : DEMO_CERAMICS;

  const products = dbProducts.length > 0 ? dbProducts : fallbackFiltered;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
          {activeCategory ? activeCategory.name.toUpperCase() : 'BỘ SƯU TẬP GỐM MỚI'}
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
          {activeCategory ? `Gốm Sứ: ${activeCategory.name}` : 'Tất Cả Tác Phẩm Gốm Mới'}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#706A61]">
          Toàn bộ chén, bát, đĩa, bình hoa đều là hàng mới 100% xuất xưởng từ các lò gốm Nhật Bản, dán triện chứng nhận thủ công và đầy đủ hộp bảo quản.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Link
          href="/san-pham"
          className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition-all uppercase ${
            !currentCatSlug
              ? 'bg-[#4A3728] text-[#FAF7F2] shadow-sm'
              : 'border border-[#DDD3C4] bg-[#FAF7F2] text-[#706A61] hover:border-[#B07D62] hover:text-[#4A3728]'
          }`}
        >
          Tất cả ({categories.length})
        </Link>
        {categories.map((c) => {
          const isSelected = currentCatSlug === c.slug;
          return (
            <Link
              key={c.id}
              href={`/san-pham?cat=${c.slug}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition-all uppercase ${
                isSelected
                  ? 'bg-[#4A3728] text-[#FAF7F2] shadow-sm'
                  : 'border border-[#DDD3C4] bg-[#FAF7F2] text-[#706A61] hover:border-[#B07D62] hover:text-[#4A3728]'
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] p-16 text-center">
          <p className="font-serif text-lg text-[#2B2927]">
            Chưa có tác phẩm gốm nào trong danh mục này.
          </p>
          <p className="mt-2 text-xs text-[#706A61]">
            Vui lòng chọn danh mục khác hoặc quay lại xem toàn bộ sản phẩm.
          </p>
          <Link
            href="/san-pham"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#32251B]"
          >
            Xem tất cả gốm sứ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      )}
    </div>
  );
}
