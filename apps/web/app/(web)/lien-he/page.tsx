import { Metadata } from 'next';
import { MessageCircle, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { CONTACT_LINKS } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Liên Hệ | Tiệm Gốm Sứ & Đồ Trang Trí Kinari',
  description: 'Liên hệ tư vấn chọn gốm sứ mới, đồ trang trí phong thủy và đồ cũ vintage Nhật Bản.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDBEA9] bg-[#FAF7F2] px-3 py-1 text-xs font-medium tracking-wider text-[#9C6644]">
        <Sparkles className="h-3.5 w-3.5" />
        Kết Nối Cùng Kinari
      </span>

      <h1 className="mt-6 font-serif text-3xl sm:text-4xl font-normal text-[#262422]">
        Trò chuyện & tư vấn chọn tác phẩm
      </h1>
      <p className="mt-3 text-base text-[#706A61]">
        Bạn cần tìm một chiếc tách trà làm quà, một tượng mèo may mắn trang trí hay một món đồ gốm cũ vintage độc bản? Hãy nhắn tin cho Kinari, chúng tôi luôn sẵn lòng chụp ảnh video chi tiết từng góc cho bạn.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <a
          href={CONTACT_LINKS.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#9C6644] hover:shadow-sm"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#4A3728] text-[#FAF7F2]">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Facebook Messenger
            </h3>
            <p className="mt-1 text-xs text-[#706A61]">
              Phản hồi nhanh chóng, gửi video góc cạnh và tư vấn chọn men phù hợp.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#9C6644]">
              Nhắn tin ngay &rarr;
            </span>
          </div>
        </a>

        <a
          href={CONTACT_LINKS.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#9C6644] hover:shadow-sm"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#9C6644] text-[#FAF7F2]">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Zalo Hotline
            </h3>
            <p className="mt-1 text-xs text-[#706A61]">
              Trao đổi nhanh cho đơn hàng quà tặng doanh nghiệp hoặc set đôi.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#9C6644]">
              Kết nối Zalo &rarr;
            </span>
          </div>
        </a>
      </div>

      <div className="mt-12 rounded-xl border border-[#E8E1D7] bg-[#F4EFEB] p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm text-[#706A61]">
            <Clock className="h-5 w-5 text-[#9C6644]" />
            <span>Phục vụ online: 8:30 - 22:00 tất cả các ngày trong tuần</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#706A61]">
            <MapPin className="h-5 w-5 text-[#9C6644]" />
            <span>Hàng sẵn tại Nhật Bản (Vận chuyển toàn quốc)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
