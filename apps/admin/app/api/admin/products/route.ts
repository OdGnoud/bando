import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { d1Query } from '@/lib/d1';
import { slugify } from '@/lib/types';
import { randomUUID } from 'crypto';

export async function GET() {
  try {
    const products = await d1Query('SELECT * FROM products ORDER BY created_at DESC;');
    const images = await d1Query('SELECT * FROM product_images ORDER BY sort_order ASC;');

    // Ghép ảnh vào sản phẩm
    const productsWithImages = products.map((p) => ({
      ...p,
      product_images: images.filter((img) => img.product_id === p.id),
    }));

    return NextResponse.json(productsWithImages);
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
    const id = body.id || randomUUID();
    const slug = slugify(body.name) + '-' + id.slice(0, 6);

    await d1Query(
      `INSERT INTO products (
        id, name, slug, category_id, price, condition_label, status,
        short_description, full_description, accessories, location,
        is_featured, is_new_arrival
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        id,
        body.name,
        slug,
        body.category_id || null,
        body.price || 0,
        body.condition_label || 'Mới 100% nguyên hộp',
        body.status || 'available',
        body.short_description || null,
        body.full_description || null,
        body.accessories || null,
        body.location || 'Tại Nhật Bản',
        body.is_featured ? 1 : 0,
        body.is_new_arrival ? 1 : 0,
      ]
    );

    // Lưu ảnh nếu có
    if (body.images && Array.isArray(body.images)) {
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        await d1Query(
          'INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?, ?, ?, ?);',
          [randomUUID(), id, img.url, i]
        );
      }
    }

    return NextResponse.json({ id, name: body.name, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const slug = body.slug || slugify(body.name) + '-' + id.slice(0, 6);

    await d1Query(
      `UPDATE products SET
        name = ?,
        slug = ?,
        category_id = ?,
        price = ?,
        condition_label = ?,
        status = ?,
        short_description = ?,
        full_description = ?,
        accessories = ?,
        location = ?,
        is_featured = ?,
        is_new_arrival = ?
      WHERE id = ?;`,
      [
        body.name,
        slug,
        body.category_id || null,
        body.price || 0,
        body.condition_label || 'Mới 100% nguyên hộp',
        body.status || 'available',
        body.short_description || null,
        body.full_description || null,
        body.accessories || null,
        body.location || 'Tại Nhật Bản',
        body.is_featured ? 1 : 0,
        body.is_new_arrival ? 1 : 0,
        id,
      ]
    );

    // Cập nhật lại ảnh nếu có gửi ảnh mới
    if (body.images && Array.isArray(body.images)) {
      await d1Query('DELETE FROM product_images WHERE product_id = ?;', [id]);
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        if (img.url) {
          await d1Query(
            'INSERT INTO product_images (id, product_id, url, sort_order) VALUES (?, ?, ?, ?);',
            [randomUUID(), id, img.url, i]
          );
        }
      }
    }

    return NextResponse.json({ success: true, id, name: body.name, slug });
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
    await d1Query('DELETE FROM product_images WHERE product_id = ?;', [id]);
    await d1Query('DELETE FROM products WHERE id = ?;', [id]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}