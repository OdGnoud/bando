-- Nâng giới hạn độ dài text sản phẩm (caption dài, mô tả chi tiết nhiều)
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_short_description_length_check,
  ADD CONSTRAINT products_short_description_length_check CHECK (char_length(short_description) <= 1000);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_full_description_length_check,
  ADD CONSTRAINT products_full_description_length_check CHECK (char_length(full_description) <= 100000);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_defects_notes_length_check,
  ADD CONSTRAINT products_defects_notes_length_check CHECK (char_length(defects_notes) <= 20000);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_accessories_length_check,
  ADD CONSTRAINT products_accessories_length_check CHECK (char_length(accessories) <= 10000);
