import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || 'ee9a0aaf159b3753ceae44eccba6f849';
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || '62fcb3ae-5b9b-4608-85f7-468d76bdaa07';
    const token = process.env.CLOUDFLARE_D1_TOKEN || '';

    let adminUser = null;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'SELECT * FROM admins WHERE email = ? AND password = ? LIMIT 1;',
          params: [email, password],
        }),
      });

      const data = await res.json();
      adminUser = data?.result?.[0]?.results?.[0];
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
