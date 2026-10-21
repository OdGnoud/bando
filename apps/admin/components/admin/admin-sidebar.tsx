'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/components/admin/auth-provider';
import { cn } from '@/lib/utils';
import {
  Package,
  LogOut,
  LayoutGrid,
  ShieldCheck,
  LayoutDashboard,
  BarChart3,
  Megaphone,
} from 'lucide-react';

const links = [
  { href: '/admin/tong-quan', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { href: '/admin/san-pham', label: 'Quản lý Gốm Sứ', icon: Package },
  { href: '/admin/danh-muc', label: 'Danh mục', icon: LayoutGrid },
  { href: '/admin/thiet-bi', label: 'Thiết bị bảo mật', icon: ShieldCheck },
  { href: '/admin/luot-truy-cap', label: 'Lượt xem khách', icon: BarChart3 },
  { href: '/admin/su-kien', label: 'Thông báo / Banner', icon: Megaphone },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAdminAuth();
  const [open, setOpen] = useState(false);

  function handleSignOut() {
    signOut();
  }

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-[#3D3731] bg-[#262422] px-4 py-3 text-[#FAF7F2] lg:hidden">
        <span className="font-serif font-bold">Kinari Admin</span>
        <button onClick={() => setOpen(!open)} className="text-xs text-[#DDD3C4]">
          Menu
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 transform bg-[#262422] text-[#FAF7F2] transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[#3D3731] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A3728] font-serif text-sm font-bold text-[#FAF7F2]">
            生
          </div>
          <Link href="/admin/tong-quan" className="font-serif text-lg font-bold tracking-wide">
            KINARI <span className="text-[#D4A373] text-xs font-sans uppercase">Quản trị</span>
          </Link>
        </div>

        <nav className="space-y-1 p-3">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium tracking-wide transition-colors',
                  active
                    ? 'bg-[#4A3728] text-[#FAF7F2] font-semibold'
                    : 'text-[#B0A79C] hover:bg-[#322F2B] hover:text-[#FAF7F2]'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-[#3D3731] p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-[#B0A79C] hover:bg-[#322F2B] hover:text-[#FAF7F2] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
