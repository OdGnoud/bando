import { DeviceManager } from '@/components/admin/device-manager';

export default function DevicesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Thiết bị đăng nhập</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Quản lý thiết bị được phép truy cập trang quản trị. Tối đa 3 thiết bị,
          thiết bị mới phải được duyệt từ thiết bị đã đăng nhập.
        </p>
      </div>
      <DeviceManager />
    </div>
  );
}