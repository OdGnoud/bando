import Link from 'next/link';
import { CONTACT_LINKS } from '@/lib/contact';
import { Heart, Sparkles, Compass } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E8E1D7] bg-[#F4EFEB] text-[#4A443E]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-[#2B2927]">
                KINARI
              </span>
              <span className="rounded bg-[#E3DAC9] px-2 py-0.5 text-[11px] font-medium text-[#5E503F]">
                きなり
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#706A61]">
              Kinari (生成り) mang ý nghĩa mộc mạc nguyên bản, tôn vinh vẻ đẹp tự nhiên và bất toàn theo tinh thần Wabi-sabi. Tuyển chọn gốm nghệ nhân, đồ trang trí phong thủy và các món đồ cũ vintage độc bản từ Nhật Bản.
            </p>
            <p className="text-xs text-[#9C6644] italic font-serif">
              “Vẻ đẹp giản dị, tĩnh lặng và trường tồn cùng thời gian.”
            </p>
          </div>

          {/* Collection Links */}
          <div>
            <h4 className="mb-4 font-serif text-base font-semibold tracking-wide text-[#2B2927]">
              Danh Mục Sản Phẩm
            </h4>
            <ul className="space-y-2.5 text-sm text-[#706A61]">
              <li>
                <Link href="/san-pham?cat=do-trang-tri" className="hover:text-[#9C6644] transition-colors font-medium text-[#8C5E45]">
                  ✦ Đồ Trang Trí & Phong Thủy
                </Link>
              </li>
              <li>
                <Link href="/san-pham?cat=do-cu" className="hover:text-[#9C6644] transition-colors font-medium text-[#8C5E45]">
                  ✦ Đồ Cũ Tuyển Chọn (Secondhand)
                </Link>
              </li>
              <li>
                <Link href="/san-pham?cat=coc-tach" className="hover:text-[#9C6644] transition-colors">
                  Tách & Chén Trà (Yunomi / Chawan)
                </Link>
              </li>
              <li>
                <Link href="/san-pham?cat=bat-to" className="hover:text-[#9C6644] transition-colors">
                  Bát Cơm & Tô Ramen
                </Link>
              </li>
              <li>
                <Link href="/san-pham?cat=dia-khay" className="hover:text-[#9C6644] transition-colors">
                  Đĩa Bánh & Khay Gốm
                </Link>
              </li>
              <li>
                <Link href="/san-pham?cat=binh-hoa" className="hover:text-[#9C6644] transition-colors">
                  Bình Hoa Ikebana & Lọ Cổ
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Craft */}
          <div>
            <h4 className="mb-4 font-serif text-base font-semibold tracking-wide text-[#2B2927]">
              Lò Gốm Truyền Thống
            </h4>
            <ul className="space-y-2.5 text-sm text-[#706A61]">
              <li>Gốm Mino (Mino-yaki, Gifu)</li>
              <li>Gốm Arita / Imari (Saga)</li>
              <li>Gốm Kutani vẽ tay sắc sảo</li>
              <li>Gốm mộc Bizen không men</li>
              <li>Kỹ thuật men rạn & hỏa biến</li>
            </ul>
          </div>

          {/* Contact & Purchase */}
          <div>
            <h4 className="mb-4 font-serif text-base font-semibold tracking-wide text-[#2B2927]">
              Ghé Thăm & Trò Chuyện
            </h4>
            <p className="mb-3 text-sm text-[#706A61]">
              Gốm thủ công mỗi mẫu chỉ có 1-2 chiếc. Vui lòng nhắn tin trực tiếp để kiểm tra ảnh chi tiết và chốt món bạn yêu thích.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href={CONTACT_LINKS.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#4A3728] px-4 py-2 text-xs font-semibold tracking-wider text-[#FAF7F2] transition-colors hover:bg-[#32251B]"
              >
                Nhắn tin qua Messenger
              </a>
              <a
                href={CONTACT_LINKS.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-[#DDD3C4] bg-[#FAF7F2] px-4 py-2 text-xs font-medium text-[#4A3728] transition-colors hover:bg-[#EFE8DC]"
              >
                Zalo: 0399.xxx.xxx
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E8E1D7] pt-8 text-xs text-[#857B72] sm:flex-row">
          <p>© 2026 Kinari. Nghệ thuật gốm sứ & Đồ trang trí Nhật Bản.</p>
          <p className="flex items-center gap-1 font-serif">
            Được chế tác với tâm huyết và tình yêu dành cho văn hoá trà & gốm
          </p>
        </div>
      </div>
    </footer>
  );
}
