/*
# Góc Đồ Lướt — Analytics & Promo Events

1. Overview
Adds traffic tracking (`page_views`) for the admin "Lượt truy cập" dashboard and
promotional events (`promo_events`) shown as banners on the public website.

2. New Tables
- `page_views`
  - id (uuid, pk)
  - path (text, not null) — page path, e.g. "/san-pham/zfold-5"
  - referrer (text) — document.referrer if any
  - visitor_id (text) — browser-generated uuid from localStorage (unique visitors)
  - created_at (timestamptz)
- `promo_events`
  - id (uuid, pk)
  - name (text, not null) — internal name, e.g. "Flash sale tháng 9"
  - description (text) — admin-only notes
  - banner_title (text) — headline shown on the website banner
  - banner_body (text) — supporting text on the banner
  - background (text) — CSS color, e.g. "#065f46"
  - tone (text, default 'emerald') — emerald | zinc | amber (badge/border tone)
  - starts_at (timestamptz, nullable) — window start (null = always)
  - ends_at (timestamptz, nullable) — window end (null = forever)
  - is_active (boolean, default true)
  - sort_order (int, default 0)
  - created_at (timestamptz)
  - updated_at (timestamptz)

3. Security
- page_views: anonymous INSERT allowed (tracking), no SELECT/UPDATE/DELETE for
  anon (dashboard reads go through the admin API with service role).
- promo_events: public SELECT (website banner), authenticated INSERT/UPDATE/DELETE
  (admin writes via service role through API routes).
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_page_views" ON page_views;
CREATE POLICY "anon_insert_page_views"
ON page_views FOR INSERT
TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(path);

CREATE TABLE IF NOT EXISTS promo_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  banner_title text,
  banner_body text,
  background text NOT NULL DEFAULT '#065f46',
  tone text NOT NULL DEFAULT 'emerald',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE promo_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_promo_events" ON promo_events;
CREATE POLICY "public_read_promo_events"
ON promo_events FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_promo_events" ON promo_events;
CREATE POLICY "auth_insert_promo_events"
ON promo_events FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_promo_events" ON promo_events;
CREATE POLICY "auth_update_promo_events"
ON promo_events FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_promo_events" ON promo_events;
CREATE POLICY "auth_delete_promo_events"
ON promo_events FOR DELETE
TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS promo_events_active_idx ON promo_events(is_active, starts_at, ends_at);
