'use client';

import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Loader2,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrafficData {
  period: number;
  overview: {
    views_today: number;
    views_7d: number;
    views_30d: number;
    views_delta_pct: number | null;
    unique_visitors_today: number;
    unique_visitors_7d: number;
    unique_visitors_30d: number;
  };
  top_pages: { path: string; views: number; unique_visitors: number }[];
  daily: { date: string; views: number; unique_visitors: number }[];
}

export default function TrafficPage() {
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/traffic')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setData(json);
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

  if (!data) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
        <p className="text-sm text-zinc-500">
          Chưa có dữ liệu. Lượt truy cập sẽ được thống kê từ khi triển khai tính năng này.
        </p>
      </div>
    );
  }

  const { overview } = data;
  const maxViews = Math.max(...data.daily.map((d) => d.views), 1);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          Lượt truy cập
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Thống kê truy cập website trong 30 ngày gần nhất.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Lượt xem hôm nay"
          value={overview.views_today}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Lượt xem 7 ngày"
          value={overview.views_7d}
          icon={<Eye className="h-5 w-5" />}
          delta={overview.views_delta_pct}
        />
        <StatCard
          label="Lượt xem 30 ngày"
          value={overview.views_30d}
          icon={<Eye className="h-5 w-5" />}
        />
        <StatCard
          label="Khách truy cập 7 ngày"
          value={overview.unique_visitors_7d}
          icon={<Users className="h-5 w-5" />}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-3">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Lượt xem 14 ngày gần nhất
          </h2>
          <div className="flex h-44 items-end gap-1.5">
            {data.daily.map((d) => (
              <div
                key={d.date}
                className="group relative flex flex-1 flex-col items-center justify-end gap-1"
                title={`${d.date}: ${d.views} lượt xem`}
              >
                <span className="hidden text-[10px] text-zinc-500 group-hover:block">
                  {d.views}
                </span>
                <div
                  className={cn(
                    'w-full rounded-t-md transition-colors',
                    d.views > 0 ? 'bg-emerald-500' : 'bg-zinc-200'
                  )}
                  style={{ height: `${Math.max((d.views / maxViews) * 100, 3)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
            <span>{data.daily[0]?.date.slice(5)}</span>
            <span>{data.daily[data.daily.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Trang được xem nhiều (30 ngày)
          </h2>
          {data.top_pages.length === 0 ? (
            <p className="text-sm text-zinc-400">Chưa có dữ liệu.</p>
          ) : (
            <ul className="space-y-3">
              {data.top_pages.map((p, i) => (
                <li key={p.path} className="flex items-center gap-3">
                  <span className="w-5 text-right text-xs font-semibold text-zinc-400">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs text-zinc-700">{p.path}</p>
                    <p className="text-[11px] text-zinc-400">
                      {p.unique_visitors} khách truy cập
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">
                    {p.views.toLocaleString('vi-VN')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  delta,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  delta?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
          {icon}
        </div>
        {typeof delta === 'number' && delta !== 0 && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
              delta > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            )}
          >
            {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight text-zinc-900">
        {value.toLocaleString('vi-VN')}
      </p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}