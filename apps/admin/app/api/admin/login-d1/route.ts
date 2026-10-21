import { NextResponse } from 'next/server';
import { d1Query } from '@/lib/d1';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    let adminUser = null;

    try {
      const results = await d1Query(
        'SELECT * FROM admins WHERE email = ? AND password = ? LIMIT 1;',
        [email, password]
      );
      adminUser = results?.[0] || null;
    } catch {
      // D1 query failed or offline
    }

    // Master admin fallback
    const isMaster =
      email.toLowerCase().trim() === 'admin@kinari.vn' &&
      (password === '123456' || password === 'admin' || password === 'kinari' || password === 'kinari123');

    if (!adminUser && isMaster) {
      adminUser = {
        id: 'admin_1',
        email: 'admin@kinari.vn',
        name: 'Kinari Master',
      };
    }

    if (!adminUser) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
      },
    });

    // Set cookie session đơn giản
    response.cookies.set('admin_session', adminUser.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
