import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductsClientList } from '@/components/web/products-client-list';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm Gốm & Đồ Trang Trí | Kinari',
  description:
    'Danh mục gốm sứ nghệ nhân mới 100%, đồ trang trí tinh tế và đồ cũ vintage tuyển chọn từ Nhật Bản.',
};
import { DEMO_CERAMICS } from '@/lib/demo-products';

export default async function ProductsPage() {
  const [dbProducts, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = dbProducts.length > 0 ? dbProducts : DEMO_CERAMICS;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Suspense fallback={<div className="py-20 text-center text-[#706A61]">Đang tải bộ sưu tập gốm...</div>}>
        <ProductsClientList initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  );
}

