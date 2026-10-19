/*
# Góc Đồ Lướt — Security Hardening

1. Overview
   - Adds `app_admins` registry: only users listed here may WRITE to the catalog.
     Everyone else (including any authenticated user that could register/sign up)
     is locked to read-only.
   - Adds `user_sessions` registry: login device tracking with a hard cap of 3
     active devices per user, a pending -> approval flow, per-device soft revoke
     (via refresh-token hash checked by the app middleware), and last-seen data.
   - Rewrites all write policies (products, categories, product_images) to require
     an admin identity AND MFA (aal2 claim) — defense in depth.
   - Adds CHECK constraints that bound input sizes and formats so a compromised or
     malicious client cannot flood the database with junk rows / giant blobs.
   - Adds a trigger to keep products.updated_at fresh.

2. Seed the first admin (run once — replace the email):
   INSERT INTO public.app_admins (user_id)
   SELECT id FROM auth.users WHERE email = 'admin@gocdoluot.vn';
*/

-- =====================================================================
-- app_admins: who may write to the catalog
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.app_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_admins ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role (app server) can read/write this table.

-- =====================================================================
-- user_sessions: login device registry (max 3 active devices)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  device_label text,
  user_agent text,
  ip inet,
  refresh_hash text,
  status text NOT NULL DEFAULT 'pending',
  last_seen_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  approval_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_sessions_device_unique UNIQUE (user_id, device_id),
  CONSTRAINT user_sessions_status_check CHECK (status IN ('active', 'pending', 'revoked'))
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
-- No policies: the app server (service role) manages this table exclusively.

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_device_id_idx ON public.user_sessions(device_id);
CREATE INDEX IF NOT EXISTS user_sessions_approval_token_idx ON public.user_sessions(approval_token);

-- Enforce a hard maximum of 3 active devices per user.
CREATE OR REPLACE FUNCTION public.guard_max_active_devices()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' THEN
    IF (
      SELECT count(*) FROM public.user_sessions
      WHERE user_id = NEW.user_id AND status = 'active' AND id <> NEW.id
    ) >= 3 THEN
      RAISE EXCEPTION 'device_limit_reached';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_sessions_max_active_trigger ON public.user_sessions;
CREATE TRIGGER user_sessions_max_active_trigger
  BEFORE INSERT OR UPDATE OF status ON public.user_sessions
  FOR EACH ROW EXECUTE FUNCTION public.guard_max_active_devices();

-- =====================================================================
-- updated_at trigger (products)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- CHECK constraints — flood / junk-data protection
-- =====================================================================
ALTER TABLE public.categories
  DROP CONSTRAINT IF EXISTS categories_name_length_check,
  ADD CONSTRAINT categories_name_length_check CHECK (char_length(name) BETWEEN 1 AND 80);
ALTER TABLE public.categories
  DROP CONSTRAINT IF EXISTS categories_slug_format_check,
  ADD CONSTRAINT categories_slug_format_check CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 80);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_price_range_check,
  ADD CONSTRAINT products_price_range_check CHECK (price BETWEEN 0 AND 2000000000);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_status_check,
  ADD CONSTRAINT products_status_check CHECK (status IN ('available', 'reserved', 'sold'));
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_name_length_check,
  ADD CONSTRAINT products_name_length_check CHECK (char_length(name) BETWEEN 1 AND 200);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_slug_format_check,
  ADD CONSTRAINT products_slug_format_check CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 200);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_condition_label_length_check,
  ADD CONSTRAINT products_condition_label_length_check CHECK (char_length(condition_label) <= 80);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_short_description_length_check,
  ADD CONSTRAINT products_short_description_length_check CHECK (char_length(short_description) <= 300);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_full_description_length_check,
  ADD CONSTRAINT products_full_description_length_check CHECK (char_length(full_description) <= 20000);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_defects_notes_length_check,
  ADD CONSTRAINT products_defects_notes_length_check CHECK (char_length(defects_notes) <= 10000);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_accessories_length_check,
  ADD CONSTRAINT products_accessories_length_check CHECK (char_length(accessories) <= 5000);
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_location_length_check,
  ADD CONSTRAINT products_location_length_check CHECK (char_length(location) <= 120);

ALTER TABLE public.product_images
  DROP CONSTRAINT IF EXISTS product_images_url_check,
  ADD CONSTRAINT product_images_url_check CHECK (url ~ '^https://' AND char_length(url) <= 2048);
ALTER TABLE public.product_images
  DROP CONSTRAINT IF EXISTS product_images_alt_length_check,
  ADD CONSTRAINT product_images_alt_length_check CHECK (char_length(alt) <= 300);

-- =====================================================================
-- Helper security functions used by policies
-- =====================================================================
-- Is the current user an admin? (SECURITY DEFINER: bypasses RLS on app_admins)
CREATE OR REPLACE FUNCTION public.is_app_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.app_admins WHERE user_id = auth.uid());
$$;

-- Is the current user an admin AND has confirmed MFA (aal2)?
CREATE OR REPLACE FUNCTION public.is_app_admin_aal2()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (auth.jwt() ->> 'aal') = 'aal2'
     AND EXISTS (SELECT 1 FROM public.app_admins WHERE user_id = auth.uid());
$$;

-- =====================================================================
-- Policy rewrite: writes require admin + MFA
-- =====================================================================
DROP POLICY IF EXISTS "auth_insert_categories" ON public.categories;
CREATE POLICY "auth_insert_categories"
ON public.categories FOR INSERT
TO authenticated WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_update_categories" ON public.categories;
CREATE POLICY "auth_update_categories"
ON public.categories FOR UPDATE
TO authenticated USING (public.is_app_admin_aal2()) WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_delete_categories" ON public.categories;
CREATE POLICY "auth_delete_categories"
ON public.categories FOR DELETE
TO authenticated USING (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_insert_products" ON public.products;
CREATE POLICY "auth_insert_products"
ON public.products FOR INSERT
TO authenticated WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_update_products" ON public.products;
CREATE POLICY "auth_update_products"
ON public.products FOR UPDATE
TO authenticated USING (public.is_app_admin_aal2()) WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_delete_products" ON public.products;
CREATE POLICY "auth_delete_products"
ON public.products FOR DELETE
TO authenticated USING (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_insert_product_images" ON public.product_images;
CREATE POLICY "auth_insert_product_images"
ON public.product_images FOR INSERT
TO authenticated WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_update_product_images" ON public.product_images;
CREATE POLICY "auth_update_product_images"
ON public.product_images FOR UPDATE
TO authenticated USING (public.is_app_admin_aal2()) WITH CHECK (public.is_app_admin_aal2());

DROP POLICY IF EXISTS "auth_delete_product_images" ON public.product_images;
CREATE POLICY "auth_delete_product_images"
ON public.product_images FOR DELETE
TO authenticated USING (public.is_app_admin_aal2());