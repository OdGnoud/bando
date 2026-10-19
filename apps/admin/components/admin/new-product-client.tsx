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

export function NewProductClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleCreate(data: ProductPayload) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast({
          title: 'Lỗi',
          description: body?.error || `Không tạo được sản phẩm (HTTP ${res.status})`,
          variant: 'destructive',
        });
        return;
      }

      toast({ title: 'Đã tạo sản phẩm' });
      const body = await res.json().catch(() => null);
      if (body?.facebook && body.facebook.ok === false) {
        toast({
          title: 'Cảnh báo Facebook',
          description: `Sản phẩm đã tạo nhưng đăng Facebook thất bại: ${body.facebook.error}`,
          variant: 'destructive',
        });
      }
      router.push('/admin/san-pham');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err instanceof Error ? err.message : 'Không kết nối được server',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }

  return <ProductForm categories={categories} onSubmit={handleCreate} saving={saving} />;
}