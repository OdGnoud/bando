import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductById, getCategories } from '@/lib/queries';
import { EditProductClient } from '@/components/admin/edit-product-client';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories(),
  ]);

  if (!product) notFound();

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
        Sửa: {product.name}
      </h1>
      <div className="max-w-2xl rounded-lg border border-zinc-200 bg-white p-6">
        <EditProductClient product={product} categories={categories} />
      </div>
    </div>
  );
}
