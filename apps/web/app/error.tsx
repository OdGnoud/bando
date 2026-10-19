'use client';

import Link from 'next/link';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-xs font-semibold tracking-widest uppercase text-[#9C6644]">
        Đã Có Lỗi Xảy Ra
      </span>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
        Hệ Thống Đang Xử Lý
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#706A61]">
        Không thể tải nội dung vào lúc này. Vui lòng thử lại sau.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white hover:bg-[#32251B] transition-colors"
        >
          Thử Lại
        </button>
        <Link
          href="/"
          className="rounded-full border border-[#DDD3C4] bg-[#FAF7F2] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#4A3728] hover:border-[#B07D62] transition-colors"
        >
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
