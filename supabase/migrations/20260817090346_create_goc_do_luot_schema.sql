/*
# Góc Đồ Lướt — Core Schema

1. Overview
This migration sets up the core data model for "Góc Đồ Lướt", a curated second-hand tech
brand. Products are stored in Supabase (text/metadata) while images are hosted externally
on Cloudflare R2 and referenced by URL. Admin pages manage products; the public website
reads and browses them.

This is a multi-user app with a sign-in screen for admin. Public reads (website) use the
anon key, admin writes use an authenticated session. So:
- SELECT on products/categories/images is open to anon + authenticated (public catalog).
- INSERT/UPDATE/DELETE on products/categories/images is restricted to authenticated owners.

2. New Tables
- `categories`
  - id (uuid, pk)
  - name (text, not null) — e.g. "Bàn phím", "Tai nghe"
  - slug (text, unique, not null) — for friendly URLs
  - sort_order (int, default 0)
  - created_at (timestamptz)
- `products`
  - id (uuid, pk)
  - name (text, not null) — model/name, accurate
  - slug (text, unique, not null)
  - category_id (uuid, fk -> categories.id, nullable)
  - price (bigint, not null) — in VND, integer to avoid float issues
  - condition_label (text, not null) — e.g. "95%", "Đã kiểm"
  - status (text, not null default 'available') — available | reserved | sold
  - short_description (text) — one-line summary for cards
  - full_description (text) — detailed listing (config, condition, defects, accessories, pin, etc.)
  - defects_notes (text) — explicit honest notes about flaws (brand transparency value)
  - accessories (text) — what's included
  - location (text) — area for handover
  - is_featured (boolean, default false) — show on homepage featured
  - is_new_arrival (boolean, default false) — show in "mới về" section
  - sort_order (int, default 0)
  - created_at (timestamptz)
  - updated_at (timestamptz)
  - user_id (uuid, not null, default auth.uid()) — owner (admin who created it)
- `product_images`
  - id (uuid, pk)
  - product_id (uuid, fk -> products.id, on delete cascade)
  - url (text, not null) — full R2 URL
  - alt (text)
  - sort_order (int, default 0)
  - created_at (timestamptz)

3. Security
- RLS enabled on all three tables.
- Public SELECT (anon + authenticated) for catalog browsing.
- Authenticated INSERT/UPDATE/DELETE scoped to ownership:
  - products: user_id = auth.uid()
  - product_images: ownership via parent product's user_id
  - categories: any authenticated user (shared catalog taxonomy)

4. Notes
- Prices stored as bigint (VND has no minor units).
- Images are referenced by URL; no file storage in Supabase.
- Foreign keys use ON DELETE CASCADE for product_images -> products.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories"
ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories"
ON categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories"
ON categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories"
ON categories FOR DELETE
TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price bigint NOT NULL DEFAULT 0,
  condition_label text NOT NULL DEFAULT 'Đã kiểm',
  status text NOT NULL DEFAULT 'available',
  short_description text,
  full_description text,
  defects_notes text,
  accessories text,
  location text,
  is_featured boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products"
ON products FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products"
ON products FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products"
ON products FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_product_images" ON product_images;
CREATE POLICY "public_read_product_images"
ON product_images FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
CREATE POLICY "auth_insert_product_images"
ON product_images FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.user_id = auth.uid())
);

DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
CREATE POLICY "auth_update_product_images"
ON product_images FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.user_id = auth.uid())
);

DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;
CREATE POLICY "auth_delete_product_images"
ON product_images FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.user_id = auth.uid())
);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_is_featured_idx ON products(is_featured);
CREATE INDEX IF NOT EXISTS products_is_new_arrival_idx ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON product_images(product_id);
