import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCategories } from '@/lib/queries';
import { NewProductClient } from '@/components/admin/new-product-client';

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/admin/san-pham"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Về danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Thêm sản phẩm
      </h1>
      <div className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-6">
        <NewProductClient categories={categories} />
      </div>
    </div>
  );
}
