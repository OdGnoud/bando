import { z } from 'zod';
import { CONDITION_OPTIONS } from '@gdl/shared/lib/types';

export const MAX_IMAGES_PER_PRODUCT = 8;
export const MAX_ACTIVE_DEVICES = 3;

const slugSchema = (max: number) =>
  z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang')
    .max(max);

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Bắt buộc').max(80),
  slug: slugSchema(80).optional(),
});

export const productImageSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, 'Bắt buộc')
    .max(2048)
    .refine((v) => /^https:\/\//i.test(v), 'URL phải bắt đầu bằng https://'),
  alt: z
    .string()
    .trim()
    .max(300)
    .nullable()
    .optional()
    .transform((v) => v || null),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(1, 'Bắt buộc').max(200),
  slug: slugSchema(200).optional(),
  category_id: z.string().uuid().nullable().optional(),
  price: z.number().int().min(0).max(2_000_000_000),
  condition_label: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .default(CONDITION_OPTIONS[0]),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  short_description: z
    .string()
    .trim()
    .max(1000)
    .nullable()
    .optional()
    .transform((v) => v || null),
  full_description: z
    .string()
    .trim()
    .max(100000)
    .nullable()
    .optional()
    .transform((v) => v || null),
  defects_notes: z
    .string()
    .trim()
    .max(20000)
    .nullable()
    .optional()
    .transform((v) => v || null),
  accessories: z
    .string()
    .trim()
    .max(10000)
    .nullable()
    .optional()
    .transform((v) => v || null),
  location: z
    .string()
    .trim()
    .max(120)
    .nullable()
    .optional()
    .transform((v) => v || null),
  is_featured: z.boolean(),
  is_new_arrival: z.boolean(),
  publish_to_facebook: z.boolean().optional(),
  images: z.array(productImageSchema).max(MAX_IMAGES_PER_PRODUCT).default([]),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export function zodErrorMessage(err: unknown): string {
  if (err instanceof z.ZodError) return err.errors[0]?.message ?? 'Dữ liệu không hợp lệ';
  return 'Dữ liệu không hợp lệ';
}