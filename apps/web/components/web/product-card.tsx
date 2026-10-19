'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Sparkles, Feather, Box, CheckCircle } from 'lucide-react';
import type { ProductWithRelations } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { CONTACT_LINKS } from '@/lib/contact';

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images?.[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] transition-all duration-300 hover:-translate-y-1 hover:border-[#B07D62] hover:shadow-lg">
      {/* Product Image Frame */}
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-[#EFE8DC]"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#A4998E]">
            <Feather className="h-6 w-6 stroke-[1.5] mb-2 text-[#C4B7A6]" />
            <span className="text-xs font-serif italic">Gốm thủ công Komorebi</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute left-3 top-3">
          {product.status === 'available' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2]/95 backdrop-blur-md border border-[#DDD3C4] px-3 py-1 text-[10px] font-semibold tracking-wider text-[#4A3728] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#588157]" />
              CÒN HÀNG
            </span>
          ) : (
            <span className="rounded-full bg-[#D6CEBE]/95 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wider text-[#706A61]">
              ĐÃ HẾT
            </span>
          )}
        </div>

        {/* Provenance Seal Tag */}
        <div className="absolute right-3 top-3">
          <span className="rounded-sm bg-[#BC4749] text-white px-2 py-0.5 text-[9px] font-serif font-bold tracking-widest shadow-xs">
            手造り
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & New Tag */}
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="tracking-widest uppercase font-semibold text-[#8C5E45]">
            {product.category?.name || 'Gốm Sứ Nhật Bản'}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#588157] tracking-wider uppercase">
            MỚI 100%
          </span>
        </div>

        {/* Title */}
        <Link href={`/san-pham/${product.slug}`} className="space-y-1.5 flex-1">
          <h3 className="line-clamp-2 font-serif text-base font-normal leading-snug text-[#262422] transition-colors group-hover:text-[#9C6644]">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-[#706A61]">
              {product.short_description}
            </p>
          )}
        </Link>

        {/* Price & Action */}
        <div className="mt-5 flex items-center justify-between border-t border-[#EFE8DC] pt-3.5">
          <div>
            <div className="font-serif text-lg font-semibold text-[#4A3728]">
              {formatPrice(product.price)}
            </div>
            <div className="text-[10px] text-[#A68A75] tracking-wide">
              Nguyên hộp lò gốm
            </div>
          </div>

          <a
            href={`${CONTACT_LINKS.messenger}?text=${encodeURIComponent(
              `Xin chào Komorebi, mình muốn tư vấn đặt mua mẫu gốm mới: ${product.name}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4A3728] text-[#FAF7F2] transition-all hover:bg-[#32251B] hover:scale-105 shadow-xs"
            title="Nhắn tin đặt hàng"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
