import { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { ProductsClientList } from '@/components/web/products-client-list';
import { DEMO_CERAMICS, DEFAULT_CATEGORIES } from '@/lib/demo-products';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm Gốm & Đồ Trang Trí | Kinari',
  description:
    'Danh mục gốm sứ nghệ nhân mới, đồ trang trí tinh tế và đồ cũ vintage tuyển chọn từ Nhật Bản.',
};

export default async function ProductsPage() {
  const [dbProducts, dbCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products = dbProducts.length > 0 ? dbProducts : DEMO_CERAMICS;
  const categories = dbCategories.length > 0 ? dbCategories : DEFAULT_CATEGORIES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Suspense fallback={<div className="py-20 text-center text-[#706A61]">Đang tải bộ sưu tập gốm...</div>}>
        <ProductsClientList initialProducts={products} categories={categories} />
      </Suspense>
    </div>
  );
}

