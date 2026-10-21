import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, PackageCheck, Gem, ShieldCheck } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductCard } from '@/components/web/product-card';
import { KilnInteractiveExplorer } from '@/components/web/kiln-interactive-explorer';
import { ScrollReveal } from '@/components/web/scroll-reveal';
import { CONTACT_LINKS } from '@/lib/contact';

const DEMO_NEW_CERAMICS = [
  {
    id: 'demo-1',
    name: 'Tach Tra Men Hoa Bien Thu Cong Kem Dia Lot Go Tuyet Tung',
    slug: 'tach-tra-men-hoa-bien-kem-dia-lot-go',
    price: 2200,
    condition_label: 'Moi 100% (Nguyen hop lo gom, trien vang)',
    status: 'available' as const,
    short_description: 'Che tac moi tu lo gom nghe nhan Gifu. Men lam hoa bien ong anh, quai cam cong thai hoc, kem de lot go moc.',
    full_description: 'San pham moi 100% xuat xuong tu lo thu cong. Than gom dan trien chung nhan nghe nhan.',
    defects_notes: null,
    accessories: 'Hop giay moc Nhat Ban + Dia lot go tuyet tung',
    location: 'Hàng có sẵn tại Nhật Bản',
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
        alt: 'Tach tra men hoa bien',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
  {
    id: 'demo-2',
    name: 'Bat Com Men Nau Den Num Gon Song Co Nap Giu Nhiet',
    slug: 'bat-com-men-den-nau-co-nap-day',
    price: 1800,
    condition_label: 'Moi 100% (New & Full Box)',
    status: 'available' as const,
    short_description: 'Thiet ke nap day giu nong canh sup va com, men lang min trang thu cong.',
    full_description: 'San pham moi tinh nguyen hop. Tao hinh nap vom doc dao voi num cam luon song nghe thuat.',
    defects_notes: null,
    accessories: 'Kem nap gom dong bo + Hop chinh hang',
    location: 'Hàng có sẵn tại Nhật Bản',
    is_featured: true,
    is_new_arrival: true,
    facebook_post_id: null,
    facebook_posted_at: null,
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
        alt: 'Bat gom co nap',
        sort_order: 1,
        created_at: '',
      },
    ],
  },
];

export default async function HomePage() {
  const [dbNewArrivals, dbCategories, allProductsWithImages] = await Promise.all([
    getProducts({ newArrival: true, limit: 4 }),
    getCategories(),
    getProducts({ limit: 50 }),
  ]);

  const displayProducts = dbNewArrivals.length > 0 ? dbNewArrivals : DEMO_NEW_CERAMICS;

  const CATEGORY_META: Record<string, { kanji: string; desc: string; fallbackImg: string }> = {
    'coc-tach': {
      kanji: '茶器',
      desc: 'Ly cà phê, chén trà Yunomi, matcha',
      fallbackImg: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    },
    'bat-to': {
      kanji: '飯碗',
      desc: 'Bát cơm có nắp, tô ramen cao cấp',
      fallbackImg: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
    },
    'dia-khay': {
      kanji: '平皿',
      desc: 'Đĩa chấm, khay sashimi, đĩa hoa quả',
      fallbackImg: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    },
    'binh-hoa': {
      kanji: '花器',
      desc: 'Bình cắm hoa Ikebana, lọ gốm trang trí',
      fallbackImg: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
    },
    'do-trang-tri': {
      kanji: '置物',
      desc: 'Tượng phong thủy, đồ trang trí nghệ thuật',
      fallbackImg: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    },
    'do-cu': {
      kanji: '古物',
      desc: 'Đồ cũ tuyển chọn, gốm cổ vintage Nhật',
      fallbackImg: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    },
  };

  const categoryImageMap = new Map<string, string>();
  for (const prod of allProductsWithImages) {
    if (prod.category?.slug && prod.product_images?.[0]?.url) {
      if (!categoryImageMap.has(prod.category.slug)) {
        categoryImageMap.set(prod.category.slug, prod.product_images[0].url);
      }
    }
  }

  const defaultCategoryList = [
    { id: '1', name: 'Tách & Chén Trà', slug: 'coc-tach' },
    { id: '2', name: 'Bát & Tô Canh', slug: 'bat-to' },
    { id: '3', name: 'Đĩa & Khay Gốm', slug: 'dia-khay' },
    { id: '4', name: 'Bình Hoa Ikebana', slug: 'binh-hoa' },
    { id: '5', name: 'Đồ Trang Trí', slug: 'do-trang-tri' },
  ];

  const allCats = dbCategories.length > 0 ? dbCategories : defaultCategoryList;
  const categoriesToShow = allCats.filter(
    (c) =>
      c.slug !== 'do-cu' &&
      c.id !== 'cat_secondhand' &&
      !c.name.toLowerCase().includes('đồ cũ') &&
      !c.slug.includes('do-cu')
  );

  return (
    <div className="washi-pattern">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#E8E1D7] bg-[#F7F3EC] py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DDBEA9] bg-[#FAF7F2] px-3.5 py-1 text-xs font-medium tracking-wider text-[#9C6644] shadow-sm">
                <Award className="h-3.5 w-3.5 text-[#B07D62]" />
                GỐM SỨ THỦ CÔNG & ĐỒ TRANG TRÍ NHẬT BẢN
              </div>

              <h1 className="font-serif text-4xl font-normal tracking-tight text-[#262422] sm:text-5xl lg:text-6xl leading-[1.15]">
                Gốm sứ & Đồ trang trí, <br />
                <span className="italic font-light text-[#9C6644]">vẻ đẹp mộc mạc từ Nhật Bản.</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#706A61] sm:text-lg">
                Kinari mang đến các tác phẩm gốm sứ thủ công mộc mạc, đồ trang trí phong thủy tinh xảo và các món đồ cũ vintage tuyển chọn từ Nhật Bản. Từng món đồ được tuyển lựa kỹ càng, mang tính thẩm mỹ và an toàn cho đời sống hàng ngày của bạn.
              </p>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
                <Link
                  href="/san-pham"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A3728] px-8 py-3.5 text-xs font-semibold tracking-widest uppercase text-[#FAF7F2] shadow-sm transition-all hover:bg-[#32251B] hover:shadow"
                >
                  Xem Sản Phẩm Mới Về
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={CONTACT_LINKS.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DDD3C4] bg-[#FAF7F2] px-6 py-3.5 text-xs font-semibold tracking-wider text-[#4A3728] transition-all hover:bg-[#EFE8DC]"
                >
                  Nhắn Tin Đặt Hàng
                </a>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-[#E8E1D7] pt-8 text-xs text-[#706A61]">
                <div>
                  <div className="font-serif font-semibold text-[#2B2927] text-sm flex items-center gap-1.5">
                    <PackageCheck className="h-4 w-4 text-[#9C6644]" />
                    Tuyển Chọn
                  </div>
                  <p className="text-[11px] text-[#8C5E45] mt-1">Đồ mới & vintage Nhật</p>
                </div>
                <div>
                  <div className="font-serif font-semibold text-[#2B2927] text-sm flex items-center gap-1.5">
                    <Gem className="h-4 w-4 text-[#9C6644]" />
                    Thủ Công
                  </div>
                  <p className="text-[11px] text-[#8C5E45] mt-1">Triện son nghệ nhân</p>
                </div>
                <div>
                  <div className="font-serif font-semibold text-[#2B2927] text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#9C6644]" />
                    An Toàn
                  </div>
                  <p className="text-[11px] text-[#8C5E45] mt-1">Men khoáng không chì</p>
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                <Image
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85"
                  alt="Gốm sứ & đồ trang trí thủ công Nhật Bản"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="rounded bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] tracking-widest uppercase font-mono">
                    JAPANESE CERAMIC & VINTAGE
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-normal leading-tight">
                    Tinh hoa nghệ thuật gốm Nhật
                  </h3>
                </div>
              </div>

              <div className="animate-float absolute -bottom-5 -left-5 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-[#DDD3C4] bg-[#FAF7F2] text-[#4A3728] shadow-2xl">
                <span className="font-serif text-3xl font-bold">厳選</span>
                <span className="text-[10px] tracking-widest uppercase text-[#9C6644] font-bold mt-0.5">TUYỂN CHỌN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Infinite Marquee Ticker */}
      <div className="overflow-hidden border-b border-[#E8E1D7] bg-[#4A3728] py-3 text-[#FAF7F2]">
        <div className="animate-marquee whitespace-nowrap text-xs font-medium tracking-[0.2em] uppercase">
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> GỐM SỨ THỦ CÔNG NHẬT BẢN
          </span>
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> MEN NUNG TỰ NHIÊN KHÔNG CHÌ
          </span>
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> BÁT ĐĨA & LY TÁCH BÀN TRÀ
          </span>
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> TRIỆN SON NGHỆ NHÂN 手造り
          </span>
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> ĐỒ TRANG TRÍ & PHONG THỦY BÌNH AN
          </span>
          <span className="mx-6 flex items-center gap-2">
            <span className="text-[#D4A373]">✦</span> ĐỒ CŨ TUYỂN CHỌN VINTAGE NHẬT
          </span>
        </div>
      </div>

      {/* Categories Showcase with ScrollReveal */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal direction="up" className="mb-10 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
              DANH MỤC TUYỂN CHỌN
            </span>
            <h2 className="mt-1 font-serif text-3xl font-normal text-[#262422]">
              Gốm Sứ Thủ Công & Đồ Trang Trí Nhật Bản
            </h2>
            <div className="mx-auto mt-2 h-[2px] w-12 bg-[#B07D62]" />
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {categoriesToShow.map((cat, idx) => {
              const meta = CATEGORY_META[cat.slug] || {
                kanji: '陶器',
                desc: 'Gốm sứ thủ công nghệ nhân',
                fallbackImg: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
              };

              const activeImage = categoryImageMap.get(cat.slug) || meta.fallbackImg;

              return (
                <ScrollReveal key={cat.id} direction="up" delayMs={idx * 100}>
                  <Link
                    href={`/san-pham?cat=${cat.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 text-center transition-all duration-300 hover:border-[#B07D62] hover:shadow-md h-full"
                  >
                    <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-[#EFE8DC]">
                      <Image
                        src={activeImage}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white font-serif font-bold">
                        {meta.kanji}
                      </div>
                    </div>
                    <h3 className="mt-3 font-serif text-base font-semibold text-[#2B2927] group-hover:text-[#9C6644]">
                      {cat.name}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-[#706A61]">
                      {meta.desc}
                    </p>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kiln Heritage & Craftsmanship (Editorial Narrative) */}
      <section className="border-t border-[#E8E1D7] bg-[#FAF7F2] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <ScrollReveal direction="right" className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DDD3C4] bg-[#EFE8DC] px-3 py-1 text-xs font-semibold tracking-widest uppercase text-[#8C5E45]">
                THỦ CÔNG · NGHỆ THUẬT GỐM SỨ
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-[#262422]">
                Tinh hoa gốm sứ thủ công & đồ trang trí Nhật Bản.
              </h2>
              <p className="text-sm leading-relaxed text-[#706A61] sm:text-base">
                Không phải sản xuất công nghiệp hàng loạt. Từng sản phẩm tại Kinari đều được tạo tác từ đất sét tự nhiên, tráng men khoáng mộc mạc và nung ở nhiệt độ cao 1,200°C – 1,350°C, mang lại độ bền chắc và an toàn cho đời sống hàng ngày.
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <span className="font-serif text-xl font-bold text-[#9C6644]">01</span>
                  <div>
                    <h4 className="font-serif font-semibold text-[#2B2927]">Gốm Mộc Men Tro & Hỏa Biến</h4>
                    <p className="text-xs text-[#706A61] mt-0.5">Chất men tự nhiên mộc mạc, tạo vân sắc độc bản qua lửa nung.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-serif text-xl font-bold text-[#9C6644]">02</span>
                  <div>
                    <h4 className="font-serif font-semibold text-[#2B2927]">Gốm Sứ Bàn Ăn Bền Đẹp</h4>
                    <p className="text-xs text-[#706A61] mt-0.5">Cốt đất dày dặn, chịu nhiệt tốt, an toàn cho bữa cơm gia đình.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-serif text-xl font-bold text-[#9C6644]">03</span>
                  <div>
                    <h4 className="font-serif font-semibold text-[#2B2927]">Đồ Trang Trí & Bình Hoa</h4>
                    <p className="text-xs text-[#706A61] mt-0.5">Tượng may mắn phong thủy và bình hoa tạo điểm nhấn thanh tao.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="font-serif text-xl font-bold text-[#9C6644]">04</span>
                  <div>
                    <h4 className="font-serif font-semibold text-[#2B2927]">Đồ Cũ Tuyển Chọn (Secondhand)</h4>
                    <p className="text-xs text-[#706A61] mt-0.5">Những món đồ xưa đượm màu thời gian, lành lặn và giàu phong vị hoài cổ.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#DDD3C4] shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
                  alt="Nghệ nhân vuốt gốm thủ công"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-[10px] tracking-widest uppercase text-white/80">Tạo hình thủ công</p>
                  <p className="font-serif text-sm font-semibold">Từng phôi đất đắp tay</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#DDD3C4] shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                    alt="Lò nung truyền thống"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] tracking-widest uppercase text-white/80">Nung nhiệt độ cao</p>
                    <p className="font-serif text-xs font-semibold">Men khoáng tự nhiên</p>
                  </div>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#DDD3C4] shadow-sm">
                  <Image
                    src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"
                    alt="Tuyển chọn & Đóng gói"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] tracking-widest uppercase text-white/80">Tuyển chọn kỹ càng</p>
                    <p className="font-serif text-xs font-semibold">Đóng gói an toàn chống sốc</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Kiln Explorer (Live Thing from Taste-Skill) */}
          <ScrollReveal direction="up" className="mt-16">
            <KilnInteractiveExplorer />
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-[#E8E1D7] bg-[#F7F3EC] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal direction="up" className="flex flex-col items-center justify-between gap-4 md:flex-row mb-12">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
                BỘ SƯU TẬP NỔI BẬT
              </span>
              <h2 className="mt-1 font-serif text-3xl font-normal text-[#262422]">
                Tác Phẩm Gốm & Đồ Trang Trí Tuyển Chọn
              </h2>
            </div>

            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#4A3728] hover:text-[#9C6644] transition-colors"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((p, idx) => (
              <ScrollReveal key={p.id} direction="up" delayMs={idx * 120}>
                <ProductCard product={p as any} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy & Table Ritual (Taste Skill Depth) */}
      <section className="border-t border-[#E8E1D7] bg-[#FAF7F2] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
              TRIẾT LÝ BÀN ĂN NHẬT BẢN
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
              Bốn Giá Trị Cốt Lõi Của Kinari
            </h2>
            <div className="mx-auto mt-3 h-[2px] w-12 bg-[#B07D62]" />
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                kanji: '選',
                title: 'Tuyển Chọn Kỹ Càng',
                desc: 'Tỉ mỉ lựa chọn từ đồ gốm mới thủ công đến đồ cũ vintage đượm màu thời gian, đảm bảo lành lặn và thẩm mỹ.',
              },
              {
                kanji: '無',
                title: 'Không Chì & Cadmium',
                desc: 'Men tự nhiên nung nhiệt cao, dùng an toàn với lò vi sóng và máy rửa bát.',
              },
              {
                kanji: '印',
                title: 'Triện Son Nghệ Nhân',
                desc: 'Mỗi sản phẩm đều có triện khắc đáy 手造り xác thực nguồn gốc lò nung.',
              },
              {
                kanji: '包',
                title: 'Đóng Gói Chống Sốc An Toàn',
                desc: 'Bọc lót chống sốc đa lớp chuyên dụng, gia cố cẩn thận đảm bảo an toàn tuyệt đối khi giao hàng.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} direction="up" delayMs={idx * 150}>
                <div className="rounded-2xl border border-[#E8E1D7] bg-[#F7F3EC] p-6 text-center space-y-3 h-full transition-transform hover:-translate-y-1">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE8DC] font-serif text-xl font-bold text-[#4A3728]">
                    {item.kanji}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2B2927]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[#706A61]">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Quote */}
      <section className="border-t border-[#E8E1D7] py-20 bg-[#F7F3EC]">
        <ScrollReveal direction="up" className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="font-serif text-3xl text-[#8C5E45]">“</span>
          <blockquote className="mx-auto max-w-2xl font-serif text-xl sm:text-2xl leading-relaxed text-[#2B2927]">
            Từng tác phẩm gốm sứ thủ công và đồ cũ vintage tuyển chọn, mang hơi thở tinh hoa cùng vẻ đẹp mộc mạc Nhật Bản đến từng không gian sống và bàn ăn của bạn.
          </blockquote>
          <p className="mt-4 text-xs tracking-widest uppercase text-[#857B72]">
            — Kinari Ceramic | Gốm Sứ & Đồ Trang Trí Nhật Bản —
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
