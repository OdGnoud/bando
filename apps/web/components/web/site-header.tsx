'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Bộ Sưu Tập' },
  { href: '/san-pham?cat=coc-tach', label: 'Tách & Ly' },
  { href: '/san-pham?cat=bat-to', label: 'Bát & Tô' },
  { href: '/san-pham?cat=dia-khay', label: 'Đĩa & Khay' },
  { href: '/san-pham?cat=binh-hoa', label: 'Bình Hoa' },
  { href: '/ve-chung-toi', label: 'Về Komorebi' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCat = searchParams.get('cat');
  const [mobileOpen, setMobileOpen] = useState(false);

  function isLinkActive(href: string) {
    if (href === '/') {
      return pathname === '/' && !currentCat;
    }
    if (href.startsWith('/san-pham?cat=')) {
      const targetCat = href.split('cat=')[1];
      return pathname.startsWith('/san-pham') && currentCat === targetCat;
    }
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E1D7] bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#4A3728] px-4 py-1.5 text-center text-xs tracking-wider text-[#FAF7F2]/90">
        <span className="font-medium">KOMOREBI 木漏れ日</span> — Gốm thủ công mộc mạc, mỗi món đồ là duy nhất (Độc bản).
      </div>

      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-sm bg-[#4A3728] text-[#FAF7F2] font-serif text-lg font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
            <span className="font-serif">木</span>
            <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border border-white bg-[#BC4749] text-[8px] flex items-center justify-center font-bold text-white shadow-xs">
              印
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-normal tracking-wide text-[#2B2927]">
                KOMOREBI
              </span>
              <span className="text-[10px] text-[#A68A75] font-serif italic">木漏れ日</span>
            </div>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#8C5E45] font-medium">
              Gốm Sứ Nghệ Nhân Nhật Bản
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-200',
                  active
                    ? 'font-bold text-[#4A3728]'
                    : 'text-[#6F675E] hover:text-[#2B2927] font-medium'
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#9C6644] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/san-pham"
            className="hidden items-center gap-2 rounded-full bg-[#4A3728] px-5 py-2 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] transition-all duration-200 hover:bg-[#32251B] shadow-sm sm:inline-flex"
          >
            <span>BỘ SƯU TẬP MỚI</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#706A61] hover:bg-[#EFE8DC] md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-[#E8E1D7] bg-[#FAF7F2] px-4 py-5 md:hidden">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-[#EFE8DC] font-bold text-[#4A3728]'
                      : 'font-medium text-[#706A61] hover:bg-[#EFE8DC]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/san-pham"
                onClick={() => setMobileOpen(false)}
                className="block text-center rounded-full bg-[#4A3728] px-4 py-2.5 text-xs font-semibold tracking-wider text-white"
              >
                XEM TOÀN BỘ GỐM
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}