'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GalleryImage {
  id: string;
  url: string;
  alt?: string | null;
  sort_order: number;
}

export function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % sorted.length);
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + sorted.length) % sorted.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, sorted.length]);

  if (sorted.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-300">
        Chưa có ảnh
      </div>
    );
  }

  const current = sorted[active];

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-[#E8E1D7] bg-[#EFE8DC] shadow-xs"
        aria-label="Xem ảnh to"
      >
        <Image
          src={current.url}
          alt={current.alt || name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          priority={active === 0}
        />
        <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-[#262422]/70 px-3 py-1 text-xs font-medium text-[#FAF7F2] backdrop-blur-md">
          <ZoomIn className="h-3.5 w-3.5" />
          {active + 1}/{sorted.length}
        </span>
        <span className="absolute left-3.5 bottom-3.5 inline-flex items-center gap-1 rounded bg-[#FAF7F2]/90 px-2.5 py-1 text-[10px] font-serif font-bold text-[#4A3728] backdrop-blur-xs">
          手造り · Gốm Nhật
        </span>
      </button>

      {sorted.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-xl border-2 bg-[#EFE8DC] transition-all',
                i === active
                  ? 'border-[#4A3728] shadow-xs ring-1 ring-[#4A3728]/20'
                  : 'border-[#E8E1D7] opacity-75 hover:opacity-100 hover:border-[#B07D62]'
              )}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${name} ảnh ${i + 1}`}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh to"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>

          {sorted.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i - 1 + sorted.length) % sorted.length);
                }}
                className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
                aria-label="Ảnh trước"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((i) => (i + 1) % sorted.length);
                }}
                className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
                aria-label="Ảnh sau"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.alt || name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
            {active + 1}/{sorted.length}
          </span>
        </div>
      )}
    </div>
  );
}