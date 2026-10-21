'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, Loader2, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@gdl/ui/components/ui/dialog';
import { useToast } from '@gdl/ui/hooks/use-toast';
import type { PromoEvent } from '@/lib/types';

type EventForm = {
  name: string;
  description: string;
  banner_title: string;
  banner_body: string;
  background: string;
  tone: 'emerald' | 'zinc' | 'amber';
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm: EventForm = {
  name: '',
  description: '',
  banner_title: '',
  banner_body: '',
  background: '#18181b',
  tone: 'emerald',
  starts_at: '',
  ends_at: '',
  is_active: true,
  sort_order: 0,
};

function toLocalInput(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(v: string) {
  return v ? new Date(v).toISOString() : null;
}

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<PromoEvent[] | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const r = await fetch('/api/admin/events');
    if (r.ok) setEvents(await r.json());
    else setEvents([]);
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (e: PromoEvent) => {
    setEditingId(e.id);
    setForm({
      name: e.name,
      description: e.description || '',
      banner_title: e.banner_title || '',
      banner_body: e.banner_body || '',
      background: e.background,
      tone: (e.tone as EventForm['tone']) || 'emerald',
      starts_at: toLocalInput(e.starts_at),
      ends_at: toLocalInput(e.ends_at),
      is_active: e.is_active,
      sort_order: e.sort_order,
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Thiếu tên sự kiện', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      description: form.description || null,
      banner_title: form.banner_title || null,
      banner_body: form.banner_body || null,
      starts_at: fromLocalInput(form.starts_at),
      ends_at: fromLocalInput(form.ends_at),
      ...(editingId ? { id: editingId } : {}),
    };
    const r = await fetch('/api/admin/events', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (r.ok) {
      toast({ title: editingId ? 'Đã cập nhật sự kiện' : 'Đã tạo sự kiện' });
      setOpen(false);
      await load();
    } else {
      const json = await r.json().catch(() => ({}));
      toast({ title: 'Lưu thất bại', description: json.error, variant: 'destructive' });
    }
  };

  const remove = async (e: PromoEvent) => {
    if (!confirm(`Xoá sự kiện "${e.name}"?`)) return;
    const r = await fetch('/api/admin/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: e.id }),
    });
    if (r.ok) {
      toast({ title: 'Đã xoá sự kiện' });
      await load();
    } else {
      toast({ title: 'Xoá thất bại', variant: 'destructive' });
    }
  };

  const toggleActive = async (e: PromoEvent, is_active: boolean) => {
    const r = await fetch('/api/admin/events', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: e.id, is_active }),
    });
    if (r.ok) await load();
    else toast({ title: 'Cập nhật thất bại', variant: 'destructive' });
  };

  const set = <K extends keyof EventForm>(key: K, value: EventForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Sự kiện ưu đãi
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Tạo banner khuyến mãi hiển thị trên đầu website.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          Thêm sự kiện
        </Button>
      </header>

      {!events ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-16 text-center">
          <Megaphone className="mx-auto mb-4 h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-500">
            Chưa có sự kiện nào. Bấm "Thêm sự kiện" để tạo banner đầu tiên.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <th className="px-4 py-3">Tên / Banner</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{e.name}</p>
                    <div
                      className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                      style={{ backgroundColor: e.background }}
                    >
                      <Megaphone className="h-3 w-3 shrink-0" />
                      <span className="truncate">{e.banner_title || '—'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {e.starts_at || e.ends_at ? (
                        <span>
                          {e.starts_at ? new Date(e.starts_at).toLocaleString('vi-VN') : 'Mọi lúc'}
                          {' → '}
                          {e.ends_at ? new Date(e.ends_at).toLocaleString('vi-VN') : 'Mãi mãi'}
                        </span>
                      ) : (
                        <span>Mọi lúc</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={e.is_active}
                      onCheckedChange={(v: boolean) => toggleActive(e, v)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(e)}
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(e)}
                        aria-label="Xoá"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ev-name">Tên sự kiện *</Label>
              <Input
                id="ev-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="VD: Flash sale tháng 9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-desc">Ghi chú nội bộ</Label>
              <Input
                id="ev-desc"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Không hiển thị trên website"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-bt">Tiêu đề banner</Label>
              <Input
                id="ev-bt"
                value={form.banner_title}
                onChange={(e) => set('banner_title', e.target.value)}
                placeholder="VD: Giảm 5% khi nhắn tin mã FLASH5"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ev-bb">Nội dung banner</Label>
              <Input
                id="ev-bb"
                value={form.banner_body}
                onChange={(e) => set('banner_body', e.target.value)}
                placeholder="Dòng phụ hiển thị trên banner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Màu nền</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={form.background}
                    onChange={(e) => set('background', e.target.value)}
                    className="h-10 w-14 cursor-pointer p-1"
                  />
                  <Input
                    value={form.background}
                    onChange={(e) => set('background', e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Màu nhấn</Label>
                <Select value={form.tone} onValueChange={(v) => set('tone', v as EventForm['tone'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emerald">Xanh lá</SelectItem>
                    <SelectItem value="amber">Vàng</SelectItem>
                    <SelectItem value="zinc">Xám</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ev-start">Bắt đầu</Label>
                <Input
                  id="ev-start"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => set('starts_at', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ev-end">Kết thúc</Label>
                <Input
                  id="ev-end"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => set('ends_at', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 items-end gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ev-order">Thứ tự hiển thị</Label>
                <Input
                  id="ev-order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set('sort_order', Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Switch checked={form.is_active} onCheckedChange={(v) => set('is_active', v)} />
                <Label className="cursor-pointer">Kích hoạt</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Huỷ
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}