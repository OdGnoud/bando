import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
        404 — Không Tìm Thấy
      </span>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
        Trang Không Tồn Tại
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#706A61]">
        Tác phẩm gốm hoặc đường dẫn bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#32251B] transition-colors"
      >
        Về Trang Chủ
      </Link>
    </div>
  );
}
