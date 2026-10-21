'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CraftStyle {
  id: string;
  name: string;
  kanji: string;
  subtitle: string;
  description: string;
  material: string;
  feature: string;
  feel: string;
  image: string;
  recommendedCategory: string;
}

const CRAFT_STYLES: CraftStyle[] = [
  {
    id: 'tea',
    name: 'Gốm Bàn Trà & Ly Tách',
    kanji: '茶器',
    subtitle: 'Nghệ thuật thưởng trà & sống chậm',
    description: 'Những chiếc tách trà, ly cà phê tráng men mộc mạc, dáng cầm đầm tay mang lại phút giây thưởng thức thư giãn và an yên mỗi ngày.',
    material: 'Men mộc tự nhiên, men lam hỏa biến và vân rạn cổ điển.',
    feature: 'Nung nhiệt độ cao 1,250°C, an toàn sức khỏe.',
    feel: 'Cầm đầm tay, giữ ấm trà lâu, chạm môi êm ái.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=coc-tach',
  },
  {
    id: 'tableware',
    name: 'Bát Đĩa Bàn Ăn Gia Đình',
    kanji: '飯碗',
    subtitle: 'Ấm cúng từng bữa cơm sum vầy',
    description: 'Chén cơm, tô canh, đĩa gốm có độ dày dặn và giữ nhiệt tốt. Thiết kế tối giản, thanh lịch làm tôn lên vẻ ngon mắt của từng món ăn.',
    material: 'Đất sét tự nhiên tráng men khoáng bền bỉ, dễ vệ sinh.',
    feature: 'Chịu nhiệt tốt, dùng bền đẹp theo thời gian.',
    feel: 'Cốt đất dày chắc chắn, bề mặt láng mịn sạch sẽ.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=bat-to',
  },
  {
    id: 'decor',
    name: 'Đồ Trang Trí & Bình Hoa',
    kanji: '置物',
    subtitle: 'Điểm nhấn tao nhã cho không gian',
    description: 'Tượng mèo phong thủy may mắn Maneki-neko và bình cắm hoa Ikebana mang lại sinh khí, vượng tài và nét bình yên cho phòng khách, bàn làm việc.',
    material: 'Gốm nghệ thuật tạo hình thủ công, họa tiết vẽ tay tỉ mỉ.',
    feature: 'Phong cách tối giản, hài hòa phong thủy.',
    feel: 'Sinh động, trang nhã, tạo cảm giác thư thái cho ngôi nhà.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=do-trang-tri',
  },
  {
    id: 'secondhand',
    name: 'Đồ Cũ Tuyển Chọn (Secondhand)',
    kanji: '古物',
    subtitle: 'Vẻ đẹp hoài niệm & Wabi-sabi',
    description: 'Những món gốm xưa đượm màu thời gian được Kinari tuyển lựa kỹ càng tại Nhật, lành lặn không sứt mẻ và mang phong vị hoài cổ độc bản.',
    material: 'Men rạn ngả sắc ngà tự nhiên, vết thời gian phong sương.',
    feature: 'Đồ xưa tuyển chọn, mỗi món là duy nhất.',
    feel: 'Mộc mạc, hoài niệm, giá trị sưu tầm cao.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?condition=used',
  },
];

export function KilnInteractiveExplorer() {
  const [selected, setSelected] = useState<CraftStyle>(CRAFT_STYLES[0]);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 sm:p-10 shadow-lg">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        {/* Left Column: Interactive Selector */}
        <div className="lg:col-span-5 space-y-4 w-full">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE8DC] px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[#8C5E45]">
            <Sparkles className="h-3 w-3 text-[#B07D62]" />
            CHẠM ĐỂ KHÁM PHÁ BỘ SƯU TẬP
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2927]">
            Mỗi tác phẩm là một nét mộc mạc cho ngôi nhà
          </h3>

          <div className="space-y-2.5 pt-2">
            {CRAFT_STYLES.map((style) => {
              const isActive = selected.id === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelected(style)}
                  className={`w-full text-left rounded-xl p-4 transition-all duration-300 flex items-center justify-between border ${
                    isActive
                      ? 'border-[#9C6644] bg-[#F4EFEB] shadow-sm translate-x-1'
                      : 'border-transparent bg-transparent hover:bg-[#F7F3EC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg font-serif text-sm font-bold transition-colors ${
                        isActive
                          ? 'bg-[#4A3728] text-[#FAF7F2]'
                          : 'bg-[#EFE8DC] text-[#706A61]'
                      }`}
                    >
                      {style.kanji[0]}
                    </span>
                    <div>
                      <div className="font-serif text-base font-semibold text-[#2B2927]">
                        {style.name}
                      </div>
                      <div className="text-xs text-[#8C5E45]">{style.subtitle}</div>
                    </div>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#A68A75]">
                    {style.kanji}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Stage with smooth change */}
        <div className="lg:col-span-7 w-full space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-white shadow-xl">
            <Image
              key={selected.id}
              src={selected.image}
              alt={selected.name}
              fill
              className="object-cover transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 right-4">
              <span className="rounded bg-[#BC4749] text-white px-3 py-1 font-serif text-xs font-bold tracking-widest shadow-md">
                {selected.kanji}
              </span>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
              <p className="text-xs tracking-widest uppercase text-white/80 font-mono">
                {selected.feature}
              </p>
              <h4 className="font-serif text-2xl font-bold">{selected.name}</h4>
              <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                {selected.description}
              </p>
            </div>
          </div>

          {/* Details breakdown cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C5E45]">
                Chất liệu & Men gốm
              </span>
              <p className="text-xs leading-relaxed text-[#2B2927]">
                {selected.material}
              </p>
            </div>
            <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C5E45]">
                Cảm nhận khi sử dụng
              </span>
              <p className="text-xs leading-relaxed text-[#2B2927]">
                {selected.feel}
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Link
              href={selected.recommendedCategory}
              className="inline-flex items-center gap-2 rounded-full bg-[#4A3728] px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white shadow-sm transition-all hover:bg-[#32251B] hover:gap-3"
            >
              Xem bộ sưu tập {selected.name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
