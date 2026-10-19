import { Suspense } from 'react';
import { SiteHeader } from '@/components/web/site-header';
import { SiteFooter } from '@/components/web/site-footer';

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      <Suspense fallback={<div className="h-20 w-full bg-[#FAF7F2]" />}>
        <SiteHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}