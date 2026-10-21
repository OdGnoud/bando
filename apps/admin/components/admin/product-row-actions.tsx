'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductWithRelations } from '@/lib/types';
import { Button } from '@gdl/ui/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@gdl/ui/hooks/use-toast';

export function ProductRowActions({ product }: { product: ProductWithRelations }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Xoá "${product.name}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product.id }),
      });
      setDeleting(false);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.error || 'Không xoá được sản phẩm');
        return;
      }
      toast({ title: 'Đã xoá' });
      router.refresh();
      window.location.reload();
    } catch (e: any) {
      setDeleting(false);
      alert('Lỗi kết nối khi xoá sản phẩm: ' + (e?.message || ''));
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="ghost" size="icon">
        <a href={`/admin/san-pham/${product.id}`}>
          <Pencil className="h-4 w-4" />
        </a>
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleting}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}