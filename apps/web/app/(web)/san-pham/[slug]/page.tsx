import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, ShieldCheck, Box, Sparkles, CheckCircle2 } from 'lucide-react';
import { getProducts, getProductBySlug } from '@/lib/queries';
import { formatPrice } from '@/lib/types';
import { CONTACT_LINKS, buildZaloLink } from '@/lib/contact';
import { ProductCard } from '@/components/web/product-card';
import { ProductGallery } from '@/components/web/product-gallery';
import { DEMO_CERAMICS } from '@/lib/demo-products';

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    if (products && products.length > 0) {
      return products.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // fallback
  }
  return DEMO_CERAMICS.map((p) => ({ slug: p.slug }));
}

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dbProduct = await getProductBySlug(params.slug);
  const product = dbProduct || DEMO_CERAMICS.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Không tìm thấy — Kinari' };
  const image = product.product_images?.[0]?.url;
  return {
    title: `${product.name} — Kinari`,
    description: product.short_description || undefined,
    openGraph: {
      title: `${product.name} — ${formatPrice(product.price)}`,
      description: product.short_description || undefined,
      type: 'website',
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const dbProduct = await getProductBySlug(params.slug);
  const product = dbProduct || DEMO_CERAMICS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const dbRelated = await getProducts({ limit: 6 });
  const allProds = dbRelated.length > 0 ? dbRelated : DEMO_CERAMICS;
  const finalRelated = allProds.filter((p) => p.id !== product.id).slice(0, 4);

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const zaloLink = buildZaloLink(product.name, product.slug);

  const cond = product.condition_label || 'Mới 100%';
  const isUsed =
    cond.toLowerCase().includes('cũ') ||
    cond.toLowerCase().includes('secondhand') ||
    cond.toLowerCase().includes('sưu tầm') ||
    cond.toLowerCase().includes('cổ') ||
    cond.includes('95%') ||
    cond.includes('98%') ||
    cond.includes('90%') ||
    product.category?.slug === 'do-cu';

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/san-pham"
        className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-[#706A61] hover:text-[#9C6644] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Về bộ sưu tập
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        {/* Images */}
        <div className="lg:col-span-7">
          <ProductGallery images={images} name={product.name} />
        </div>

        {/* Info */}
        <div className="space-y-6 lg:col-span-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.status === 'available' ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#606C38]/10 border border-[#606C38]/30 px-2.5 py-0.5 text-xs font-semibold text-[#606C38]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#606C38]" />
                  CÒN HÀNG
                </span>
              ) : (
                <span className="rounded-full bg-zinc-200 border border-zinc-300 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
                  ĐÃ HẾT
                </span>
              )}

              {isUsed ? (
                <span className="rounded-full bg-[#B07D62]/15 border border-[#B07D62]/30 px-2.5 py-0.5 text-xs font-bold text-[#8C5E45]">
                  {cond}
                </span>
              ) : (
                <span className="rounded-full bg-[#588157]/10 border border-[#588157]/30 px-2.5 py-0.5 text-xs font-bold text-[#588157]">
                  {cond}
                </span>
              )}

              <span className="rounded bg-[#2B2927] px-2 py-0.5 text-[10px] font-medium uppercase text-[#FAF7F2]">
                手造り (Thủ Công)
              </span>
            </div>

            <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-semibold leading-snug text-[#262422]">
              {product.name}
            </h1>

            {product.category && (
              <Link
                href={`/san-pham?cat=${product.category.slug}`}
                className="mt-1.5 inline-block text-xs font-medium uppercase tracking-wider text-[#9C6644] hover:underline"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          <div className="rounded-xl border border-[#E8E1D7] bg-[#F4EFEB] p-5">
            <div className="font-serif text-3xl font-semibold text-[#4A3728]">
              {formatPrice(product.price)}
            </div>
            <div className="mt-2 text-xs text-[#706A61] space-y-1">
              <div>
                Xuất xứ: <span className="font-medium text-[#262422]">Lò gốm nghệ nhân Nhật Bản</span>
              </div>
              <div>
                Tình trạng: <span className="font-medium text-[#262422]">{cond}</span>
              </div>
            </div>
          </div>

          {product.short_description && (
            <p className="text-sm leading-relaxed text-[#706A61]">{product.short_description}</p>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href={`${CONTACT_LINKS.messenger}?text=${encodeURIComponent(
                `Xin chào Kinari, mình muốn đặt mua sản phẩm: ${product.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4A3728] px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] shadow-sm transition-all hover:bg-[#32251B]"
            >
              <MessageCircle className="h-4 w-4" />
              Tư vấn đặt hàng qua Messenger
            </a>
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#DDD3C4] bg-[#FAF7F2] px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-[#4A3728] transition-colors hover:bg-[#EFE8DC]"
            >
              Nhắn tin qua Zalo
            </a>
            <p className="text-center text-[11px] text-[#A4998E]">
              Kinari hỗ trợ quay video góc cạnh chi tiết trước khi đóng gói gửi bạn.
            </p>
          </div>

          {/* Detail blocks */}
          <div className="space-y-4 pt-2">
            {product.full_description && (
              <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9C6644]">
                  <Sparkles className="h-4 w-4" />
                  Mô tả chất men & nghệ thuật
                </div>
                <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed text-[#706A61]">
                  {product.full_description}
                </p>
              </div>
            )}

            {product.accessories && (
              <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9C6644]">
                  <Box className="h-4 w-4" />
                  Quy cách đóng gói & Phụ kiện
                </div>
                <p className="whitespace-pre-line text-xs sm:text-sm text-[#706A61]">
                  {product.accessories}
                </p>
              </div>
            )}

            <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9C6644]">
                <ShieldCheck className="h-4 w-4" />
                Bảo hiểm vận chuyển 100%
              </div>
              <p className="text-xs text-[#706A61] leading-relaxed">
                Đóng gói 4 lớp xốp bóng khí chuyên dụng. Đổi mới hoặc hoàn tiền ngay lập tức nếu nứt vỡ do vận chuyển.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {finalRelated.length > 0 && (
        <section className="mt-20 border-t border-[#E8E1D7] pt-12">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
              GỢI Ý THÊM
            </span>
            <h2 className="mt-1 font-serif text-2xl font-normal text-[#262422]">
              Tác Phẩm Cùng Bộ Sưu Tập
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {finalRelated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
