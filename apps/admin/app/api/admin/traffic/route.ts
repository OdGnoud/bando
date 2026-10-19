import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  const periodCounts = async (from: Date) =>
    supabaseAdmin
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', from.toISOString());

  const uniqueCounts = async (from: Date) =>
    supabaseAdmin
      .from('page_views')
      .select('visitor_id', { count: 'exact', head: true })
      .not('visitor_id', 'is', null)
      .gte('created_at', from.toISOString());

  const [
    { count: viewsToday },
    { count: views7d },
    { count: views30d },
    { count: viewsPrev7d },
    { count: uniqueToday },
    { count: unique7d },
    { count: unique30d },
  ] = await Promise.all([
    periodCounts(startOfToday),
    periodCounts(daysAgo(7)),
    periodCounts(daysAgo(30)),
    periodCounts(daysAgo(14)),
    uniqueCounts(startOfToday),
    uniqueCounts(daysAgo(7)),
    uniqueCounts(daysAgo(30)),
  ]);

  const views7dNum = views7d ?? 0;
  const viewsPrev7dNum = viewsPrev7d ?? 0;
  const viewsDeltaPct =
    viewsPrev7dNum === 0
      ? null
      : Math.round(((views7dNum - viewsPrev7dNum) / viewsPrev7dNum) * 100);

  const [{ data: topPages }, { data: daily }] = await Promise.all([
    supabaseAdmin
      .from('page_views')
      .select('path, visitor_id, created_at')
      .gte('created_at', daysAgo(30).toISOString()),
    supabaseAdmin
      .from('page_views')
      .select('created_at, visitor_id')
      .gte('created_at', daysAgo(13).toISOString()),
  ]);

  const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (const row of topPages ?? []) {
    const entry = pageMap.get(row.path) ?? { views: 0, visitors: new Set<string>() };
    entry.views += 1;
    if (row.visitor_id) entry.visitors.add(row.visitor_id);
    pageMap.set(row.path, entry);
  }
  const topPagesList = [...pageMap.entries()]
    .map(([path, v]) => ({
      path,
      views: v.views,
      unique_visitors: v.visitors.size,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const daySeries: { date: string; views: number; unique_visitors: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    daySeries.push({ date: key, views: 0, unique_visitors: 0 });
  }
  const uniquePerDay = new Map<string, Set<string>>();
  for (const row of daily ?? []) {
    const key = row.created_at.slice(0, 10);
    const entry = daySeries.find((s) => s.date === key);
    if (entry) {
      entry.views += 1;
      if (row.visitor_id) {
        const set = uniquePerDay.get(key) ?? new Set<string>();
        set.add(row.visitor_id);
        uniquePerDay.set(key, set);
      }
    }
  }
  for (const entry of daySeries) {
    entry.unique_visitors = uniquePerDay.get(entry.date)?.size ?? 0;
  }

  return NextResponse.json({
    period: 30,
    overview: {
      views_today: viewsToday ?? 0,
      views_7d: views7dNum,
      views_30d: views30d ?? 0,
      views_delta_pct: viewsDeltaPct,
      unique_visitors_today: uniqueToday ?? 0,
      unique_visitors_7d: unique7d ?? 0,
      unique_visitors_30d: unique30d ?? 0,
    },
    top_pages: topPagesList,
    daily: daySeries,
  });
}