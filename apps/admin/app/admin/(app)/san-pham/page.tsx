import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/queries';
import { formatPrice, STATUS_LABELS } from '@/lib/types';
import { ProductRowActions } from '@/components/admin/product-row-actions';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({}),
    getCategories(),
  ]);

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2B2927]">
              Quản lý Gốm Sứ
            </h1>
            <span className="rounded-full bg-[#EFE8DC] px-2.5 py-0.5 text-xs font-semibold text-[#8C5E45]">
              {products.length} tác phẩm
            </span>
          </div>
          <p className="mt-1 text-sm text-[#706A61]">
            Danh sách tác phẩm gốm sứ mới, đồ trang trí và đồ cũ vintage tuyển chọn từ Nhật Bản.
          </p>
        </div>
        <Link
          href="/admin/san-pham/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4A3728] px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] shadow-xs transition-all hover:bg-[#32251B]"
        >
          + Thêm tác phẩm mới
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] shadow-xs">
        <table className="w-full text-sm">
          <thead className="border-b border-[#E8E1D7] bg-[#F7F3EC] text-left text-[11px] font-semibold uppercase tracking-wider text-[#706A61]">
            <tr>
              <th className="px-5 py-3.5">Tác phẩm</th>
              <th className="px-5 py-3.5">Danh mục</th>
              <th className="px-5 py-3.5">Giá (JPY)</th>
              <th className="px-5 py-3.5">Tình trạng</th>
              <th className="px-5 py-3.5 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFE8DC]">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#8C5E45]">
                  Chưa có sản phẩm nào. Bấm &ldquo;Thêm tác phẩm mới&rdquo; để đăng gốm sứ.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-[#F2ECE3]">
                <td className="px-5 py-4 font-medium text-[#2B2927]">
                  <div className="font-serif text-base">{p.name}</div>
                  <div className="text-[11px] text-[#A68A75]">{p.slug}</div>
                </td>
                <td className="px-5 py-4 text-xs text-[#706A61]">
                  <span className="rounded bg-[#EFE8DC] px-2 py-1 font-medium">
                    {p.category_id ? catMap.get(p.category_id) || '—' : '—'}
                  </span>
                </td>
                <td className="px-5 py-4 font-serif text-base font-semibold text-[#4A3728]">
                  {formatPrice(p.price)}
                </td>
                <td className="px-5 py-4">
                  {p.status === 'available' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#588157]/10 px-2.5 py-0.5 text-xs font-semibold text-[#588157]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#588157]" />
                      Còn Hàng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#706A61]/10 px-2.5 py-0.5 text-xs font-medium text-[#706A61]">
                      Đã Hết
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <ProductRowActions product={p} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
