import { Metadata } from 'next';
import { Sparkles, Box, ShieldCheck, Flame, Compass, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Về Kinari | Câu Chuyện Gốm Sứ & Đồ Trang Trí Nhật Bản',
  description:
    'Kinari ra đời từ tình yêu với nghệ thuật gốm sứ mộc mạc, đồ trang trí tinh tế và những món đồ cũ vintage tuyển chọn từ Nhật Bản.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DDBEA9] bg-[#FAF7F2] px-3 py-1 text-xs font-medium tracking-wider text-[#9C6644]">
        <Sparkles className="h-3.5 w-3.5" />
        Về Kinari (生成り)
      </span>

      {/* Heading */}
      <h1 className="mt-6 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#262422] leading-tight">
        Vẻ đẹp mộc mạc nguyên bản, <br />
        <span className="italic font-light text-[#9C6644]">thanh lọc tâm hồn qua từng món đồ.</span>
      </h1>

      <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#706A61]">
        Trong tiếng Nhật, <strong>Kinari (生成り)</strong> biểu thị cho màu sợi tự nhiên nguyên bản, chưa qua tẩy trắng — là biểu tượng của sự mộc mạc, chân phương và gần gũi với thiên nhiên. Kinari ra đời với sứ mệnh mang không gian sống thanh tao, ấm cúng của văn hóa Nhật Bản về với gia đình bạn qua những món đồ gốm sứ thủ công, đồ trang trí phong thủy và các tác phẩm đồ cũ vintage độc bản.
      </p>

      {/* Values */}
      <div className="mt-12 space-y-6">
        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <Box className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Gốm Mới Thủ Công Nghệ Nhân (New & Fullbox)
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Bộ sưu tập chén bát, ly tách trà, bình hoa mới 100% xuất xưởng từ các làng nghề gốm sứ truyền thống Nhật Bản với đầy đủ triện lò và hộp bảo quản mộc mạc.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Đồ Trang Trí & Đồ Cũ Tuyển Chọn (Secondhand Vintage)
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Mục bán đồ cũ và đồ trang trí phong thủy (tượng mèo Maneki-Neko, đĩa cổ men rạn, bình gốm Wabi-sabi) được đội ngũ Kinari trực tiếp săn tìm và tuyển lựa kỹ lưỡng tại Nhật Bản, lành lặn và giàu giá trị thời gian.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Nung Nhiệt Độ Cao & An Toàn Tuyệt Đối
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Gốm được nung trên 1250°C - 1300°C loại bỏ hoàn toàn tạp chất, tráng men khoáng tự nhiên không chứa chì và cadimi, an toàn cho mọi bữa ăn gia đình.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 transition-all hover:border-[#D4A373]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4EFEB] text-[#9C6644]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#262422]">
              Đóng Gói Chuyên Nghiệp & Bảo Hiểm Bể Vỡ 100%
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#706A61]">
              Kinari quấn 3-4 lớp bọt khí chống sốc chuyên dụng và thùng xốp định hình. Cam kết hoàn tiền hoặc đổi mới ngay lập tức nếu phát sinh bể vỡ trong quá trình vận chuyển.
            </p>
          </div>
        </div>
      </div>

      {/* Quote Box */}
      <div className="mt-12 rounded-2xl border border-[#E8E1D7] bg-[#F4EFEB] p-8 text-center sm:text-left">
        <h4 className="font-serif text-base font-semibold text-[#262422]">
          Tôn chỉ của Kinari
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#706A61]">
          Không chỉ bán một chiếc bát hay chiếc ly vô tri, Kinari mong muốn mang đến một góc nhỏ bình yên, một phong vị sống chậm và thanh tao cho từng bữa cơm ấm cúng và tách trà thư giãn mỗi ngày của bạn.
        </p>
      </div>
    </div>
  );
}
