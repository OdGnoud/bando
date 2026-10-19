import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get('admin_session')?.value;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Nếu chưa có session và đang cố vào trang con của admin -> chuyển về /admin
  if (!adminSession && pathname !== '/admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Nếu đã đăng nhập thành công và đang ở /admin -> chuyển vào dashboard /admin/tong-quan
  if (adminSession && pathname === '/admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/tong-quan';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
