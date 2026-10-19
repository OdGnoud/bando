'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface KilnDetail {
  id: string;
  name: string;
  kanji: string;
  region: string;
  history: string;
  glaze: string;
  temperature: string;
  feel: string;
  image: string;
  recommendedCategory: string;
}

const KILNS: KilnDetail[] = [
  {
    id: 'mino',
    name: 'Gốm Mino (Mino-yaki)',
    kanji: '美濃焼',
    region: 'Tỉnh Gifu · Khởi nguồn từ thế kỷ thứ 7',
    history: 'Dòng gốm quốc dân của Nhật Bản, được các bậc thầy trà đạo như Sen no Rikyu vô cùng trân trọng.',
    glaze: 'Men Shino (trắng đục vỏ trứng), men Oribe (xanh lục ngọc) và men Kiseto (vàng tro tự nhiên).',
    temperature: '1,230°C – 1,260°C nung khử',
    feel: 'Đằm tay, mộc mạc, giữ nhiệt cho đồ uống cực kỳ bền bỉ.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=coc-tach',
  },
  {
    id: 'arita',
    name: 'Sứ Arita / Imari',
    kanji: '有田焼',
    region: 'Tỉnh Saga, Kyushu · Di sản hơn 400 năm',
    history: 'Cái nôi sứ đầu tiên của xứ Phù Tang. Từng được hoàng gia châu Âu thời kỳ Phục Hưng săn đón.',
    glaze: 'Cốt sứ cao lanh nguyên chất, men lam Sometsuke và viền vàng kim quý tộc.',
    temperature: '1,300°C – 1,350°C nhiệt độ siêu cao',
    feel: 'Mịn màng như ngọc thạch, gõ vang như chuông bạc, chống bám bẩn 100%.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=bat-to',
  },
  {
    id: 'kutani',
    name: 'Gốm Kutani ngũ sắc',
    kanji: '九谷焼',
    region: 'Tỉnh Ishikawa · Nghệ thuật cung đình',
    history: 'Nổi danh toàn cầu với phong cách vẽ tranh men nổi Gosai (đỏ, vàng, xanh lá, tím, xanh lam).',
    glaze: 'Men thủy tinh dày dặn vẽ tay tỉ mỉ từng chi tiết chim muông, hoa lá bốn mùa.',
    temperature: '1,200°C – 1,280°C nung 2 lần',
    feel: 'Rực rỡ, lộng lẫy và tràn đầy năng lượng nghệ thuật thị giác.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=dia-khay',
  },
  {
    id: 'bizen',
    name: 'Gốm Bizen Wabi-sabi',
    kanji: '備前焼',
    region: 'Tỉnh Okayama · Một trong Lục Đại Cổ Diêu',
    history: 'Dòng gốm cổ xưa không sử dụng bất kỳ lớp men hóa học nào, hoàn toàn dựa vào tro củi nung tự nhiên.',
    glaze: 'Tro thông đỏ chảy tự nhiên tạo vân Hidasuki (vệt lửa đỏ) độc nhất vô nhị.',
    temperature: 'Nung củi liên tục 10 – 14 ngày đêm',
    feel: 'Thô ráp nguyên sơ, càng chạm tay dùng lâu càng lên nước bóng mịn.',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=85',
    recommendedCategory: '/san-pham?cat=binh-hoa',
  },
];

export function KilnInteractiveExplorer() {
  const [selected, setSelected] = useState<KilnDetail>(KILNS[0]);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#E8E1D7] bg-[#FAF7F2] p-6 sm:p-10 shadow-lg">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:gap-12 items-center">
        {/* Left Column: Interactive Selector */}
        <div className="lg:col-span-5 space-y-4 w-full">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE8DC] px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-[#8C5E45]">
            <Sparkles className="h-3 w-3 text-[#B07D62]" />
            CHẠM ĐỂ KHÁM PHÁ LÒ NGHỆ NHÂN
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2927]">
            Mỗi vùng đất là một câu chuyện về đất sét & lửa
          </h3>

          <div className="space-y-2.5 pt-2">
            {KILNS.map((kiln) => {
              const isActive = selected.id === kiln.id;
              return (
                <button
                  key={kiln.id}
                  onClick={() => setSelected(kiln)}
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
                      {kiln.kanji[0]}
                    </span>
                    <div>
                      <div className="font-serif text-base font-semibold text-[#2B2927]">
                        {kiln.name}
                      </div>
                      <div className="text-xs text-[#8C5E45]">{kiln.region}</div>
                    </div>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#A68A75]">
                    {kiln.kanji}
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
                {selected.temperature}
              </p>
              <h4 className="font-serif text-2xl font-bold">{selected.name}</h4>
              <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                {selected.history}
              </p>
            </div>
          </div>

          {/* Details breakdown cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C5E45]">
                Đặc trưng chất men
              </span>
              <p className="text-xs leading-relaxed text-[#2B2927]">
                {selected.glaze}
              </p>
            </div>
            <div className="rounded-xl border border-[#E8E1D7] bg-[#FAF7F2] p-4 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C5E45]">
                Cảm giác trên tay
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
              Xem các mẫu gốm {selected.name.split(' ')[1]}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
