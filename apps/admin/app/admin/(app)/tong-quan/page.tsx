'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Eye,
  ImageOff,
  LayoutGrid,
  Loader2,
  Megaphone,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stats {
  products: number;
  products_by_status: { available: number; reserved: number; sold: number };
  products_missing_images: number;
  categories: number;
  devices: number;
  views_today: number;
  views_7d: number;
  views_30d: number;
  events_active: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setStats(json);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
        <h2 className="text-lg font-semibold text-zinc-900">Không tải được dữ liệu</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Kiểm tra kết nối hoặc đăng nhập lại.
        </p>
      </div>
    );
  }

  const alerts: { label: string; href: string }[] = [];
  if (stats.products_missing_images > 0) {
    alerts.push({
      label: `${stats.products_missing_images} sản phẩm chưa có ảnh — nên bổ sung để khách xem được`,
      href: '/admin/san-pham',
    });
  }

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2B2927]">
          Bảng điều khiển
        </h1>
        <p className="mt-1 text-sm text-[#706A61]">
          Tổng quan số liệu và tình trạng sản phẩm gốm sứ mới tại Komorebi.
        </p>
      </header>

      {alerts.length > 0 && (
        <section className="mb-8 space-y-3">
          {alerts.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-start gap-3 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 text-sm text-[#9C6644] transition-colors hover:bg-[#F2ECE3]"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B07D62]" />
              <span className="font-medium">{a.label}</span>
            </Link>
          ))}
        </section>
      )}

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <Kpi
          label="Tác phẩm gốm"
          value={stats.products}
          sub={[
            `${stats.products_by_status.available} còn hàng`,
            `${stats.products_by_status.sold} đã hết`,
          ]}
          icon={<Package className="h-5 w-5" />}
        />
        <Kpi
          label="Danh mục gốm"
          value={stats.categories}
          icon={<LayoutGrid className="h-5 w-5" />}
        />
        <Kpi
          label="Thiết bị an toàn"
          value={stats.devices}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <Kpi
          label="Sự kiện đang chạy"
          value={stats.events_active}
          icon={<Megaphone className="h-5 w-5" />}
        />
        <Kpi
          label="Lượt xem hôm nay"
          value={stats.views_today}
          icon={<Eye className="h-5 w-5" />}
        />
        <Kpi
          label="Lượt xem 7 ngày"
          value={stats.views_7d}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <Kpi
          label="Lượt xem 30 ngày"
          value={stats.views_30d}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <Kpi
          label="Sản phẩm thiếu ảnh"
          value={stats.products_missing_images}
          icon={<ImageOff className="h-5 w-5" />}
        />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <QuickCard
          href="/admin/san-pham"
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Quản lý sản phẩm"
          desc="Thêm, sửa và quản lý hình ảnh các bộ sưu tập gốm sứ mới."
        />
        <QuickCard
          href="/admin/danh-muc"
          icon={<Tag className="h-5 w-5" />}
          title="Danh mục gốm"
          desc="Phân loại chén đĩa, tách trà, bình hoa, quà tặng nghệ nhân."
        />
        <QuickCard
          href="/admin/luot-truy-cap"
          icon={<BarChart3 className="h-5 w-5" />}
          title="Lượt truy cập"
          desc="Chi tiết lượt xem, khách ghé thăm và các sản phẩm được quan tâm."
        />
        <QuickCard
          href="/admin/su-kien"
          icon={<Megaphone className="h-5 w-5" />}
          title="Banner thông báo"
          desc="Cập nhật thông điệp hoặc chương trình đặc biệt cho khách hàng."
        />
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number;
  sub?: string[];
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-5 shadow-xs transition-all hover:border-[#DDD3C4]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFE8DC] text-[#4A3728]">
        {icon}
      </div>
      <p className="font-serif text-3xl font-semibold tracking-tight text-[#2B2927]">
        {(value ?? 0).toLocaleString('vi-VN')}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#8C5E45]">
        {label}
      </p>
      {sub && (
        <p className="mt-1.5 text-xs text-[#706A61]">{sub.join(' · ')}</p>
      )}
    </div>
  );
}

function QuickCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-5 transition-all hover:border-[#B07D62] hover:bg-[#F2ECE3]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#4A3728] text-[#FAF7F2] transition-colors group-hover:bg-[#32251B]">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-base font-semibold text-[#2B2927] group-hover:text-[#9C6644] transition-colors">
          {title}
        </h3>
        <p className="mt-0.5 text-xs text-[#706A61]">{desc}</p>
      </div>
    </Link>
  );
}