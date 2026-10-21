'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductCard } from '@/components/web/product-card';
import type { Category, ProductWithRelations } from '@/lib/types';
import { Search, SlidersHorizontal, RotateCcw, Sparkles, Tag, ArrowUpDown } from 'lucide-react';

interface Props {
  initialProducts: ProductWithRelations[];
  categories: Category[];
}

type ConditionFilter = 'all' | 'new' | 'used';
type SortOption = 'newest' | 'priceAsc' | 'priceDesc';

export function ProductsClientList({ initialProducts, categories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCat = searchParams.get('cat');
  const urlCondition = searchParams.get('condition');

  const initialIsUsed = urlCondition === 'used' || urlCat === 'do-cu';
  const [selectedCat, setSelectedCat] = useState<string | null>(
    urlCat === 'do-cu' ? null : urlCat
  );
  const [selectedCondition, setSelectedCondition] = useState<ConditionFilter>(
    initialIsUsed ? 'used' : urlCondition === 'new' ? 'new' : 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if URL changes
  useEffect(() => {
    if (urlCat === 'do-cu') {
      setSelectedCondition('used');
      setSelectedCat(null);
    } else if (urlCat !== undefined) {
      setSelectedCat(urlCat);
    }
    if (urlCondition === 'used') setSelectedCondition('used');
    else if (urlCondition === 'new') setSelectedCondition('new');
  }, [urlCat, urlCondition]);

  // Exclude 'do-cu' and secondhand from product category pills since condition is handled above
  const productCategories = useMemo(() => {
    return categories.filter((c) => {
      const slug = (c.slug || '').toLowerCase();
      const name = (c.name || '').toLowerCase();
      const id = (c.id || '').toLowerCase();
      return (
        slug !== 'do-cu' &&
        slug !== 'do-cu-tuyen-chon' &&
        id !== 'cat_secondhand' &&
        !name.includes('đồ cũ') &&
        !name.includes('cũ') &&
        !name.includes('secondhand') &&
        !name.includes('vintage') &&
        !slug.includes('do-cu')
      );
    });
  }, [categories]);

  const activeCategory = useMemo(() => {
    if (!selectedCat) return null;
    return categories.find((c) => c.slug === selectedCat || c.id === selectedCat);
  }, [categories, selectedCat]);

  // Main filter & sort logic
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // 1. Category Filter
        if (selectedCat) {
          const matchSlug = p.category?.slug === selectedCat || p.category_id === selectedCat;
          if (!matchSlug) return false;
        }

        // 2. Condition Filter
        const cond = (p.condition_label || '').toLowerCase();
        const isUsed =
          cond.includes('cũ') ||
          cond.includes('secondhand') ||
          cond.includes('sưu tầm') ||
          cond.includes('cổ') ||
          cond.includes('95%') ||
          cond.includes('98%') ||
          cond.includes('90%') ||
          p.category?.slug === 'do-cu';

        if (selectedCondition === 'new' && isUsed) return false;
        if (selectedCondition === 'used' && !isUsed) return false;

        // 3. Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = (p.short_description || '').toLowerCase().includes(q);
          const matchFull = (p.full_description || '').toLowerCase().includes(q);
          const matchCat = (p.category?.name || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchFull && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        // Default newest
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [initialProducts, selectedCat, selectedCondition, searchQuery, sortBy]);

  const hasActiveFilters =
    Boolean(selectedCat) ||
    selectedCondition !== 'all' ||
    Boolean(searchQuery.trim()) ||
    sortBy !== 'newest';

  function resetFilters() {
    setSelectedCat(null);
    setSelectedCondition('all');
    setSortBy('newest');
    setSearchQuery('');
  }

  // Count items by condition for badge numbers
  const counts = useMemo(() => {
    let newCount = 0;
    let usedCount = 0;
    initialProducts.forEach((p) => {
      const cond = (p.condition_label || '').toLowerCase();
      const isUsed =
        cond.includes('cũ') ||
        cond.includes('secondhand') ||
        cond.includes('sưu tầm') ||
        cond.includes('cổ') ||
        cond.includes('95%') ||
        cond.includes('98%') ||
        cond.includes('90%') ||
        p.category?.slug === 'do-cu';
      if (isUsed) usedCount++;
      else newCount++;
    });
    return { all: initialProducts.length, new: newCount, used: usedCount };
  }, [initialProducts]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
          {activeCategory
            ? activeCategory.name.toUpperCase()
            : selectedCondition === 'used'
            ? 'MỤC BÁN ĐỒ CŨ TUYỂN CHỌN'
            : selectedCondition === 'new'
            ? 'BỘ SƯU TẬP GỐM MỚI NGUYÊN HỘP'
            : 'KINARI きなり — BỘ SƯU TẬP TOÀN DIỆN'}
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
          {activeCategory
            ? `Tác Phẩm: ${activeCategory.name}`
            : selectedCondition === 'used'
            ? 'Đồ Cũ Tuyển Chọn & Vintage Nhật'
            : selectedCondition === 'new'
            ? 'Gốm Sứ & Đồ Trang Trí Mới 100%'
            : 'Tất Cả Tác Phẩm & Đồ Trang Trí'}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#706A61] leading-relaxed">
          Kinari tuyển chọn từng tác phẩm gốm nghệ nhân, đồ trang trí phong thủy tinh xảo và các món đồ cũ vintage độc bản mang đậm tinh thần Wabi-sabi Nhật Bản.
        </p>
      </div>

      {/* Main Filter Control Box */}
      <div className="mb-8 rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 sm:p-6 shadow-xs">
        {/* Top: Condition Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFE8DC] pb-5">
          <div className="flex items-center gap-1.5 rounded-full bg-[#EFE8DC]/80 p-1">
            <button
              type="button"
              onClick={() => setSelectedCondition('all')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                selectedCondition === 'all'
                  ? 'bg-[#4A3728] text-[#FAF7F2] shadow-xs'
                  : 'text-[#706A61] hover:text-[#262422]'
              }`}
            >
              Tất Cả ({counts.all})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCondition('new')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                selectedCondition === 'new'
                  ? 'bg-[#4A3728] text-[#FAF7F2] shadow-xs'
                  : 'text-[#706A61] hover:text-[#262422]'
              }`}
            >
              Hàng Mới 100% ({counts.new})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCondition('used')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                selectedCondition === 'used'
                  ? 'bg-[#8C5E45] text-[#FAF7F2] shadow-xs'
                  : 'text-[#706A61] hover:text-[#262422]'
              }`}
            >
              Đồ Cũ Tuyển Chọn ({counts.used})
            </button>
          </div>

          {/* Quick search input */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A68A75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, mô tả..."
              className="w-full rounded-full border border-[#DDD3C4] bg-white py-1.5 pl-9 pr-3 text-xs text-[#2B2927] placeholder:text-[#A68A75] focus:border-[#8C5E45] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A68A75] hover:text-[#4A3728]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Middle: Category Pills */}
        <div className="pt-4">
          <div className="mb-2 text-[11px] font-semibold tracking-wider uppercase text-[#8C5E45]">
            Danh mục sản phẩm:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCat(null)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all ${
                !selectedCat
                  ? 'border border-[#4A3728] bg-[#4A3728] text-white shadow-xs'
                  : 'border border-[#DDD3C4] bg-white text-[#706A61] hover:border-[#9C6644] hover:text-[#4A3728]'
              }`}
            >
              Tất cả danh mục
            </button>
            {productCategories.map((c) => {
              const isSelected = selectedCat === c.slug || selectedCat === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCat(isSelected ? null : c.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    isSelected
                      ? 'border border-[#4A3728] bg-[#4A3728] text-white shadow-xs'
                      : 'border border-[#DDD3C4] bg-white text-[#706A61] hover:border-[#9C6644] hover:text-[#4A3728]'
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom: Results Count & Sort Droplist */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE8DC] pt-4 text-xs">
          <div className="flex items-center gap-2 text-xs text-[#706A61]">
            <span>
              Hiển thị <strong className="text-[#2B2927] font-semibold">{filteredProducts.length}</strong> tác phẩm phù hợp
            </span>
            {activeCategory && (
              <span className="rounded-full bg-[#EFE8DC] px-2.5 py-0.5 text-[11px] font-medium text-[#4A3728]">
                {activeCategory.name}
              </span>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#8C5E45]" />
            <span className="font-medium text-[#4A3728]">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-[#DDD3C4] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2B2927] shadow-2xs hover:border-[#8C5E45] focus:border-[#8C5E45] focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá tăng dần (Thấp → Cao)</option>
              <option value="priceDesc">Giá giảm dần (Cao → Thấp)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-2 inline-flex items-center gap-1 rounded-full border border-[#DDBEA9] bg-[#FAF7F2] px-3 py-1.5 text-[11px] font-medium text-[#8C5E45] hover:bg-[#EFE8DC] transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Đặt lại
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-[#E8E1D7] bg-[#FAF7F2] p-16 text-center">
          <p className="font-serif text-lg text-[#2B2927]">
            Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
          </p>
          <p className="mt-2 text-xs text-[#706A61]">
            Vui lòng thử bỏ bớt điều kiện lọc hoặc tìm kiếm với từ khóa khác.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#32251B]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Xem tất cả tác phẩm Kinari
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}
