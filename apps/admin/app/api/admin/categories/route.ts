import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { d1Query } from '@/lib/d1';
import { slugify } from '@/lib/types';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const categories = await d1Query('SELECT * FROM categories ORDER BY display_order ASC, name ASC;');
    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = `cat_${Date.now()}`;
    const slug = slugify(body.name);

    await d1Query(
      'INSERT INTO categories (id, name, slug, display_order) VALUES (?, ?, ?, ?);',
      [id, body.name, slug, body.display_order || 0]
    );

    return NextResponse.json({ id, name: body.name, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await d1Query('DELETE FROM categories WHERE id = ?;', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}