'use client';

import { useState } from 'react';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('admin@komorebi.vn');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login-d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Đăng nhập không thành công');
        setLoading(false);
        return;
      }

      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem('admin_user', JSON.stringify(data.user));

      // Chuyển hướng trực tiếp vào trang tổng quan
      window.location.href = '/admin/tong-quan';
    } catch (err: any) {
      setError('Lỗi kết nối máy chủ');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#706A61] mb-1">
          Email Quản Trị (Cloudflare D1)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-[#DDD3C4] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#262422] focus:border-[#9C6644] focus:outline-none"
          placeholder="admin@komorebi.vn"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#706A61] mb-1">
          Mật Khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-[#DDD3C4] bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#262422] focus:border-[#9C6644] focus:outline-none"
          placeholder="••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#4A3728] px-6 py-3 text-xs font-semibold tracking-wider uppercase text-[#FAF7F2] shadow-sm transition-all hover:bg-[#32251B] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Đang xác thực D1...
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Đăng Nhập Quản Trị
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <span className="text-[11px] text-[#8C5E45] font-serif">
          Xác thực trực tiếp từ Cloudflare D1 Database
        </span>
      </div>
    </form>
  );
}