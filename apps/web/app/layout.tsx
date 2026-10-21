import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@gdl/ui/components/ui/sonner';

const serif = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kinari | Gốm Sứ Thủ Công & Đồ Trang Trí Nhật Bản',
  description:
    'Bộ sưu tập chén bát, ly tách trà, bình hoa nghệ nhân Nhật Bản, đồ trang trí mộc mạc và đồ cũ vintage tuyển chọn (Kinari きなり).',
  openGraph: {
    title: 'Kinari | Gốm Sứ & Đồ Trang Trí Nhật Bản',
    description: 'Nghệ thuật gốm sứ mộc mạc, đồ trang trí tinh tế và đồ cũ vintage tuyển chọn từ các lò gốm Nhật Bản.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-[#FAF7F2] font-sans text-[#2B2927] antialiased selection:bg-[#D4A373]/30 selection:text-[#582F0E]">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
