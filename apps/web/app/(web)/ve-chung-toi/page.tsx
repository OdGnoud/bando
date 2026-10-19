import { Metadata } from 'next';
import { Heart, Sparkles, Box, ShieldCheck, Flame, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Về Komorebi | Câu Chuyện Gốm Sứ Thủ Công Nhật Bản',
  description:
    'Komorebi ra đời từ niềm đam mê văn hoá trà đạo và nghệ thuật chế tác gốm sứ thủ công mới 100% từ các lò gốm truyền thống Nhật Bản.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDBEA9] bg-[#FAF7F2] px-3 py-1 text-xs font-medium tracking-wider text-[#9C6644]">
        <Sparkles className="h-3.5 w-3.5" />
        Về Komorebi Ceramic (木漏れ日)
      </span>

      {/* Heading */}
      <h1 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#262422] leading-tight">
        Gốm mới nguyên bản, <br />
        <span className="italic font-light text-[#9C6644]">chắt chiu từng giọt men lửa.</span>
      </h1>

      <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#706A61]">
        Komorebi (木漏れ日 - ánh nắng lọt qua kẽ lá) bắt đầu từ những chuyến đi tìm về các làng gốm cổ truyền Nhật Bản: Mino, Arita, Kutani, Bizen. Chúng tôi say đắm cảm giác cầm trên tay một chiếc tách trà men hỏa biến mới xuất xưởng, nghe được tiếng vọng của đất mẹ và hơi ấm từ bàn tay tài hoa của người nghệ nhân.
      </p>

      {/* Values */}
      <div className="mt-12 space-y-6">
        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              100% Gốm Mới Chính Hãng (New & Fullbox)
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Mỗi sản phẩm đều là gốm mới xuất xưởng nguyên hộp, đầy đủ tem mác xuất xứ và triện lò gốm (手造り). Hoàn toàn không qua sử dụng.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Nung Nhiệt Độ Cao & An Toàn Sức Khỏe
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Gốm Nhật được nung trên 1250°C - 1300°C loại bỏ hoàn toàn tạp chất, tráng men khoáng tự nhiên không chứa chì và cadimi, tuyệt đối an toàn cho sức khỏe gia đình bạn khi dùng đồ nóng.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Bọc Hàng Kỹ Càng & Bảo Hiểm Vận Chuyển 100%
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Gốm sứ được quấn 3-4 lớp bọt khí xốp nổ chuyên dụng, chèn xốp định hình trong thùng carton cứng. Đảm bảo kiện hàng đến tay bạn nguyên vẹn; đền bù hoặc đổi mới ngay nếu có sự cố bể vỡ khi vận chuyển.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Box */}
      <div className="mt-12 rounded-2xl border border-[#E8E1D7] bg-[#F4EFEB] p-8 text-center sm:text-left">
        <h4 className="font-serif text-base font-semibold text-[#262422]">
          Tôn chỉ của Komorebi
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#706A61]">
          Không chỉ bán một chiếc bát hay chiếc ly vô tri, Komorebi mong muốn mang đến một góc nhỏ bình yên, một phong vị sống chậm và thanh tao cho từng bữa cơm ấm cúng và tách trà thư giãn mỗi ngày của bạn.
        </p>
      </div>
    </div>
  );
}
