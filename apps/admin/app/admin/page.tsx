'use client';

import { useAdminAuth } from '@/components/admin/auth-provider';
import { LoginForm } from '@/components/admin/login-form';

export default function AdminIndex() {
  const { user, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] text-sm text-[#857B72]">
        Đang kết nối hệ thống Kinari...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FAF7F2]">
        <p className="text-sm text-[#706A61]">Bạn đã đăng nhập quyền quản trị.</p>
        <a
          href="/admin/tong-quan"
          className="rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] shadow-sm hover:bg-[#32251B]"
        >
          Vào Bảng Quản Trị Kinari
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#E8E1D7] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#EFE8DC] font-serif text-xl font-bold text-[#4A3728]">
            生
          </div>
          <div className="font-serif text-2xl font-bold tracking-tight text-[#2B2927]">
            KINARI <span className="text-[#9C6644] text-lg font-sans">Admin</span>
          </div>
          <p className="mt-1 text-xs text-[#857B72]">Hệ thống quản lý tiệm gốm & đồ trang trí Kinari</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
