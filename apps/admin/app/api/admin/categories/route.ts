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
    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã danh mục' }, { status: 400 });
    }
    // Gỡ liên kết danh mục khỏi các sản phẩm trước để tránh lỗi ràng buộc khóa ngoại FOREIGN KEY
    try {
      await d1Query('UPDATE products SET category_id = NULL WHERE category_id = ?;', [id]);
    } catch {}
    // Xoá danh mục khỏi D1
    await d1Query('DELETE FROM categories WHERE id = ?;', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Lỗi xoá danh mục:', err);
    return NextResponse.json({ error: err.message || 'Lỗi xoá danh mục' }, { status: 500 });
  }
}