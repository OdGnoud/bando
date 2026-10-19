'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@gdl/ui/components/ui/button';
import { Input } from '@gdl/ui/components/ui/input';
import { Label } from '@gdl/ui/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@gdl/ui/hooks/use-toast';
import type { Category } from '@/lib/types';

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    });
    setAdding(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast({ title: 'Lỗi', description: body?.error || 'Không thêm được', variant: 'destructive' });
      return;
    }
    const data = (await res.json()) as Category;
    setCategories((prev) => [...prev, data]);
    setName('');
    toast({ title: 'Đã thêm danh mục' });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Xoá danh mục này? Sản phẩm trong danh mục sẽ không bị xoá.')) return;
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast({ title: 'Lỗi', description: body?.error || 'Không xoá được', variant: 'destructive' });
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast({ title: 'Đã xoá' });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="cat-name">Tên danh mục mới</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bàn phím, Tai nghe, Laptop..."
            maxLength={80}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={adding}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Tên</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 text-right font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-zinc-400">
                  Chưa có danh mục.
                </td>
              </tr>
            )}
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium text-zinc-900">{c.name}</td>
                <td className="px-4 py-3 text-zinc-500">{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}