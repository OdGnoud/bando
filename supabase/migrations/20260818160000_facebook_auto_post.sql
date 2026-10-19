-- Đăng bài tự động lên Facebook: lưu id bài đăng để cập nhật/gỡ sau này
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS facebook_post_id text,
  ADD COLUMN IF NOT EXISTS facebook_posted_at timestamptz;
