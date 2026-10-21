import { getCategories } from '@/lib/queries';
import { CategoryManager } from '@/components/admin/category-manager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-zinc-900">
        Danh mục
      </h1>
      <div className="max-w-2xl">
        <CategoryManager initial={categories} />
      </div>
    </div>
  );
}
