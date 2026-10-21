import { Metadata } from 'next';
import { PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính Sách Bán Hàng & Đóng Gói | Kinari Ceramic',
  description:
    'Chính sách đóng gói chuyên dụng chống sốc, bảo hiểm bể vỡ 100% khi vận chuyển gốm sứ và đồ trang trí tại Kinari.',
};

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
        Chính sách bán hàng & vận chuyển
      </h1>
      <p className="mt-3 text-sm text-[#706A61]">
        Kinari luôn đặt sự cẩn trọng và trải nghiệm an tâm của khách hàng lên hàng đầu.
      </p>

      <div className="mt-12 space-y-8">
        <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#9C6644]" />
            <h2 className="font-serif text-lg font-semibold text-[#262422]">
              Quy chuẩn đóng gói gốm sứ
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#706A61]">
            Mỗi món đồ gốm mới đều được đặt trong hộp nguyên bản, bọc từ 3 đến 4 lớp xốp bóng khí (bubble wrap) chuyên dụng, chèn xốp định hình kín các góc và đặt trong thùng carton chịu lực 5 lớp.
          </p>
        </div>

        <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#9C6644]" />
            <h2 className="font-serif text-lg font-semibold text-[#262422]">
              Bảo hiểm bể vỡ 100% khi giao hàng
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#706A61]">
            Khi nhận hàng, quý khách được quyền đồng kiểm cùng shipper hoặc quay video mở hộp. Nếu phát hiện bất kỳ vết nứt, mẻ hay bể vỡ do vận chuyển, Kinari cam kết gửi đổi sản phẩm mới ngay lập tức hoặc hoàn tiền 100% không phát sinh chi phí.
          </p>
        </div>

        <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-[#9C6644]" />
            <h2 className="font-serif text-lg font-semibold text-[#262422]">
              Cam kết chất lượng 100% Hàng Mới
            </h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#706A61]">
            100% sản phẩm là gốm nghệ nhân mới nguyên chiếc từ Nhật Bản, nung ở nhiệt độ cao an toàn dùng cho lò vi sóng và máy rửa chén (đối với dòng men bóng). Các dòng men hỏa biến thủ công hoặc có mạ vàng/bạc khuyến khích rửa tay nhẹ nhàng bằng khăn mềm.
          </p>
        </div>
      </div>
    </div>
  );
}
