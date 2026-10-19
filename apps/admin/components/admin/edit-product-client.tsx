'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import type { Category, ProductWithRelations, ProductStatus } from '@/lib/types';
import { useToast } from '@gdl/ui/hooks/use-toast';

interface ProductPayload {
  id?: string;
  name: string;
  slug?: string;
  category_id: string | null;
  price: number;
  condition_label: string;
  status: ProductStatus;
  short_description: string;
  full_description: string;
  defects_notes: string;
  accessories: string;
  location: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  publish_to_facebook?: boolean;
  images: { url: string; alt: string }[];
}

export function EditProductClient({
  product,
  categories,
}: {
  product: ProductWithRelations;
  categories: Category[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleUpdate(data: ProductPayload) {
    setSaving(true);
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, id: product.id }),
    });
    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast({
        title: 'Lỗi',
        description: body?.error || 'Không cập nhật được sản phẩm',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Đã cập nhật' });
    const body = await res.json().catch(() => null);
    if (body?.facebook && body.facebook.ok === false) {
      toast({
        title: 'Cảnh báo Facebook',
        description: `Đã lưu nhưng đăng Facebook thất bại: ${body.facebook.error}`,
        variant: 'destructive',
      });
    }
    router.push('/admin/san-pham');
    router.refresh();
  }

  return (
    <ProductForm
      categories={categories}
      initial={product}
      onSubmit={handleUpdate}
      saving={saving}
    />
  );
}