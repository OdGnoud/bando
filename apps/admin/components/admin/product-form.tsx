'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@gdl/ui/components/ui/button';
import { Input } from '@gdl/ui/components/ui/input';
import { Label } from '@gdl/ui/components/ui/label';
import { Textarea } from '@gdl/ui/components/ui/textarea';
import { Switch } from '@gdl/ui/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gdl/ui/components/ui/select';
import { Trash2, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import type { Category, ProductWithRelations, ProductStatus } from '@/lib/types';
import { slugify, STATUS_LABELS } from '@/lib/types';

interface ProductFormProps {
  categories: Category[];
  initial?: ProductWithRelations;
  onSubmit: (data: FormData) => void;
  saving: boolean;
}

interface FormData {
  id?: string;
  name: string;
  slug: string;
  category_id: string | null;
  price: number;
  condition_label: string;
  status: ProductStatus;
  short_description: string;
  full_description: string;
  defects_notes: string;
  accessories: string;
  location: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  publish_to_facebook?: boolean;
  images: { url: string; alt: string }[];
}

interface UploadItem {
  key: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url: string;
  alt: string;
  name: string;
  file?: File;
  errorMsg?: string;
}

const MAX_IMAGE_DIM = 1600;

async function compressImage(file: File): Promise<{ blob: Blob; type: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIM / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', 0.82)
  );
  if (!blob) throw new Error('toBlob');
  return { blob, type: 'image/webp' };
}

export function ProductForm({ categories, initial, onSubmit, saving }: ProductFormProps) {
  const [categoryOptions, setCategoryOptions] = useState<Category[]>(categories);
  const [name, setName] = useState(initial?.name || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [categoryId, setCategoryId] = useState<string>(initial?.category_id || 'none');
  const [conditionLabel, setConditionLabel] = useState<string>(
    initial?.condition_label && (initial.condition_label.toLowerCase().includes('cũ') || initial.condition_label.toLowerCase().includes('secondhand') || initial.condition_label.toLowerCase().includes('used'))
      ? 'Đồ cũ'
      : 'Đồ mới'
  );
  const [price, setPrice] = useState<string>(initial ? String(initial.price) : '');
  const [status, setStatus] = useState<ProductStatus>(initial?.status || 'available');
  const [shortDesc, setShortDesc] = useState(initial?.short_description || '');
  const [fullDesc, setFullDesc] = useState(initial?.full_description || '');
  const [defects, setDefects] = useState(initial?.defects_notes || '');
  const [accessories, setAccessories] = useState(initial?.accessories || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured || false);
  const [isNew, setIsNew] = useState(initial?.is_new_arrival || false);
  const [publishToFb, setPublishToFb] = useState(true);
  const [fbRemoving, setFbRemoving] = useState(false);
  const nextUploadKey = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productId = useRef<string | undefined>(
    initial?.id ?? (typeof crypto !== 'undefined' ? crypto.randomUUID() : undefined)
  ).current;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCategoryOptions(data);
          setCategoryId((prev) => (prev === 'none' ? 'none' : prev));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [uploads, setUploads] = useState<UploadItem[]>(() =>
    (initial?.product_images ?? []).map((i) => ({
      key: ++nextUploadKey.current,
      status: 'done' as const,
      url: i.url,
      alt: i.alt || '',
      name: i.url.split('/').pop() || 'Ảnh',
    }))
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploads.some((u) => u.status === 'uploading' || u.status === 'pending')) {
      alert('Đang tải ảnh lên, chờ một chút rồi thử lại.');
      return;
    }
    onSubmit({
      id: initial?.id ?? productId,
      name,
      slug: slug || slugify(name),
      category_id: categoryId === 'none' ? null : categoryId,
      price: Number(price) || 0,
      condition_label: conditionLabel,
      status,
      short_description: shortDesc,
      full_description: fullDesc,
      defects_notes: defects,
      accessories,
      location,
      is_featured: isFeatured,
      is_new_arrival: isNew,
      publish_to_facebook: publishToFb,
      images: uploads
        .filter((u) => u.status === 'done' && u.url)
        .map((u) => ({ url: u.url, alt: u.alt })),
    });
  }

  async function uploadFile(item: UploadItem) {
    if (!item.file) return;
    setUploads((prev) =>
      prev.map((u) => (u.key === item.key ? { ...u, status: 'uploading', errorMsg: undefined } : u))
    );
    try {
      const { blob } = await compressImage(item.file);
      let lastError = 'network_error';
      const delays = [2000, 4000, 8000, 15000];
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          const fd = new FormData();
          fd.append('file', blob, item.file.name);
          if (productId) fd.append('productId', productId);
          const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            lastError = body?.detail || body?.error || `http_${res.status}`;
            if (res.status === 413 || res.status === 400 || res.status === 401) {
              throw new Error(lastError);
            }
          } else {
            const data = await res.json();
            setUploads((prev) =>
              prev.map((u) =>
                u.key === item.key ? { ...u, status: 'done', url: data.url } : u
              )
            );
            return;
          }
        } catch (err) {
          if (err instanceof Error) lastError = err.message;
        }
        if (attempt <= delays.length) {
          await new Promise((r) => setTimeout(r, delays[attempt - 1]));
        }
      }
      throw new Error(lastError);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'upload_failed';
      setUploads((prev) =>
        prev.map((u) => (u.key === item.key ? { ...u, status: 'error', errorMsg: msg } : u))
      );
    }
  }

  function onFilesSelected(files: FileList | null) {
    if (!files) return;
    let idx = 0;
    const filesArr = Array.from(files);
    const items: UploadItem[] = filesArr.map((file) => ({
      key: ++nextUploadKey.current,
      status: 'pending' as const,
      url: '',
      alt: '',
      name: file.name,
      file,
    }));
    setUploads((prev) => [...prev, ...items]);
    void (async function runNext() {
      if (idx >= items.length) return;
      const item = items[idx];
      idx++;
      await uploadFile(item);
      await runNext();
    })();
  }

  function updateAlt(key: number, alt: string) {
    setUploads((prev) => prev.map((u) => (u.key === key ? { ...u, alt } : u)));
  }

  function removeUpload(key: number) {
    setUploads((prev) => prev.filter((u) => u.key !== key));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Tên sản phẩm *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!initial) setSlug(slugify(e.target.value));
          }}
          placeholder="Ví dụ: Tách trà men hỏa biến quai gỗ"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <div className="space-y-2 flex flex-col justify-end">
          <Label htmlFor="category" className="min-h-[20px] flex items-center">Danh mục</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">— Không —</SelectItem>
              {categoryOptions.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex flex-col justify-end">
          <Label htmlFor="condition" className="min-h-[20px] flex items-center whitespace-nowrap">Tình trạng (Mới / Cũ)</Label>
          <Select
            value={
              conditionLabel && (conditionLabel.toLowerCase().includes('cũ') || conditionLabel.toLowerCase().includes('secondhand') || conditionLabel.toLowerCase().includes('used'))
                ? 'Đồ cũ'
                : 'Đồ mới'
            }
            onValueChange={(val) => setConditionLabel(val)}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Đồ mới">Đồ mới</SelectItem>
              <SelectItem value="Đồ cũ">Đồ cũ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex flex-col justify-end">
          <Label htmlFor="price" className="min-h-[20px] flex items-center">Giá (Yên - JPY) *</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ví dụ: 1500"
            required
          />
        </div>
        <div className="space-y-2 flex flex-col justify-end">
          <Label htmlFor="status" className="min-h-[20px] flex items-center">Trạng thái gốm</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_LABELS) as ProductStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="short">Mô tả ngắn</Label>
        <Input
          id="short"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          placeholder="Ví dụ: Men hỏa biến xanh lam, kèm đĩa lót gỗ mộc"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full">Mô tả chi tiết</Label>
        <Textarea
          id="full"
          value={fullDesc}
          onChange={(e) => setFullDesc(e.target.value)}
          rows={6}
          placeholder="Mô tả kỹ thuật nung men, kích thước, nghệ thuật thủ công..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="acc">Quy cách & Phụ kiện kèm theo</Label>
        <Textarea
          id="acc"
          value={accessories}
          onChange={(e) => setAccessories(e.target.value)}
          rows={2}
          placeholder="Ví dụ: Hộp gỗ truyền thống, khay gỗ tuyết tùng, đũa tre..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="featured" />
          <Label htmlFor="featured">Nổi bật (hiện trang chủ)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isNew} onCheckedChange={setIsNew} id="new" />
          <Label htmlFor="new">Mới về</Label>
        </div>
        {initial?.facebook_post_id && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              Đã đăng lên Facebook
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fbRemoving}
              onClick={async () => {
                if (!initial?.id) return;
                if (!confirm('Gỡ bài đăng này khỏi Facebook?')) return;
                setFbRemoving(true);
                try {
                  const res = await fetch('/api/admin/facebook', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: initial.id }),
                  });
                  if (!res.ok) {
                    const body = await res.json().catch(() => null);
                    alert(body?.detail || body?.error || 'Gỡ bài thất bại');
                    return;
                  }
                  alert('Đã gỡ bài khỏi Facebook.');
                  window.location.reload();
                } catch {
                  alert('Không kết nối được server');
                } finally {
                  setFbRemoving(false);
                }
              }}
            >
              {fbRemoving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Gỡ bài trên Facebook
            </Button>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Ảnh sản phẩm</Label>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                onFilesSelected(e.target.files);
                e.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-1 h-4 w-4" />
              Thêm ảnh từ máy
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {uploads.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-zinc-400">
              Chưa có ảnh — bấm "Thêm ảnh từ máy" để chọn ảnh trên thiết bị.
            </div>
          )}
          {uploads.map((u, idx) => (
            <div key={u.key} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-zinc-50">
                  {u.status === 'done' && u.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.url}
                      alt=""
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : u.status === 'uploading' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-red-400" />
                  )}
                  {idx === 0 && u.status === 'done' && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 text-center text-[9px] text-white">
                      Đại diện
                    </span>
                  )}
                </div>
                {u.status === 'done' ? (
                  <>
                    <Input
                      placeholder="alt (tuỳ chọn)"
                      value={u.alt}
                      onChange={(e) => updateAlt(u.key, e.target.value)}
                      className="max-w-[240px]"
                    />
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate text-xs text-zinc-400 hover:text-zinc-600"
                    >
                      {u.name}
                    </a>
                  </>
                ) : u.status === 'uploading' || u.status === 'pending' ? (
                  <p className="text-sm text-zinc-400">
                    {u.status === 'pending' ? 'Đang chờ tải lên: ' : 'Đang tải lên: '}
                    {u.name}...
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-red-500">
                      Tải lên thất bại: {u.name}
                      {u.errorMsg ? ` (${u.errorMsg})` : ''}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => uploadFile(u)}
                    >
                      Thử lại
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => removeUpload(u.key)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-400">
          Ảnh được tự động nén (tối đa 1600px, WebP) và upload lên Cloudflare R2. Ảnh đầu
          tiên sẽ là ảnh đại diện.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </Button>
      </div>
    </form>
  );
}
