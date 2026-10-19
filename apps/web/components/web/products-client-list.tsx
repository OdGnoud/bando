'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/web/product-card';
import type { Category, ProductWithRelations } from '@/lib/types';
import Link from 'next/link';

interface Props {
  initialProducts: any[];
  categories: Category[];
}

export function ProductsClientList({ initialProducts, categories }: Props) {
  const searchParams = useSearchParams();
  const urlCat = searchParams.get('cat');
  const [selectedCat, setSelectedCat] = useState<string | null>(urlCat);

  // Sync with URL if needed
  const activeSlug = selectedCat ?? urlCat;

  const filteredProducts = useMemo(() => {
    if (!activeSlug) return initialProducts;
    return initialProducts.filter(
      (p) => p.category?.slug === activeSlug || p.category_id === activeSlug
    );
  }, [initialProducts, activeSlug]);

  const activeCategory = categories.find((c) => c.slug === activeSlug);

  return (
    <>
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
        <button
          type="button"
          onClick={() => setSelectedCat(null)}
          className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition-all uppercase ${
            !activeSlug
              ? 'bg-[#4A3728] text-[#FAF7F2] shadow-sm'
              : 'border border-[#DDD3C4] bg-[#FAF7F2] text-[#706A61] hover:border-[#B07D62] hover:text-[#4A3728]'
          }`}
        >
          Tất cả ({categories.length})
        </button>
        {categories.map((c) => {
          const isSelected = activeSlug === c.slug;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCat(c.slug)}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition-all uppercase ${
                isSelected
                  ? 'bg-[#4A3728] text-[#FAF7F2] shadow-sm'
                  : 'border border-[#DDD3C4] bg-[#FAF7F2] text-[#706A61] hover:border-[#B07D62] hover:text-[#4A3728]'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] p-16 text-center">
          <p className="font-serif text-lg text-[#2B2927]">
            Chưa có tác phẩm gốm nào trong danh mục này.
          </p>
          <p className="mt-2 text-xs text-[#706A61]">
            Vui lòng chọn danh mục khác hoặc quay lại xem toàn bộ sản phẩm.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#32251B]"
          >
            Xem tất cả gốm sứ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      )}
    </>
  );
}
