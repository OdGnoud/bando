'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@gdl/ui/components/ui/button';
import { Check, Trash2, Loader2, Smartphone, Monitor } from 'lucide-react';
import { useToast } from '@gdl/ui/hooks/use-toast';

interface DeviceRow {
  id: string;
  device_id: string;
  device_label: string | null;
  user_agent: string | null;
  ip: string | null;
  status: 'active' | 'pending' | 'revoked';
  last_seen_at: string | null;
  approved_at: string | null;
  created_at: string;
}

function formatTime(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('vi-VN');
}

function formatAgent(agent: string | null): string {
  if (!agent) return '—';
  if (agent.length > 90) return agent.slice(0, 90) + '…';
  return agent;
}

export function DeviceManager() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [max, setMax] = useState(3);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/admin/devices');
    if (!res.ok) return;
    const data = await res.json();
    setDevices(data.devices ?? []);
    setMax(data.max ?? 3);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, [refresh]);

  async function act(rowId: string, action: 'approve' | 'revoke') {
    setActingId(rowId);
    const res = await fetch('/api/admin/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, row_id: rowId }),
    });
    setActingId(null);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.error === 'device_limit_reached') {
        toast({
          title: 'Đã đủ 3 thiết bị',
          description: 'Xoá 1 thiết bị cũ trước khi duyệt thiết bị mới.',
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Lỗi', description: 'Không thực hiện được', variant: 'destructive' });
      }
      return;
    }
    toast({ title: action === 'approve' ? 'Đã duyệt thiết bị' : 'Đã thu hồi thiết bị' });
    refresh();
  }

  const active = devices.filter((d) => d.status === 'active');
  const pending = devices.filter((d) => d.status === 'pending');
  const revoked = devices.filter((d) => d.status === 'revoked');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {active.length} thiết bị đang hoạt động
        </p>
        <p className="text-xs text-zinc-400">Tự làm mới mỗi 5 giây</p>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-600">
            Đang chờ duyệt ({pending.length})
          </h2>
          <div className="overflow-hidden rounded-lg border border-amber-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100">
                {pending.map((d) => (
                  <tr key={d.id} className="bg-amber-50/40">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-900">
                        {d.device_label || 'Thiết bị mới'}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {formatAgent(d.user_agent)}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-400">
                        IP {d.ip || '—'} · Đăng ký {formatTime(d.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => act(d.id, 'approve')}
                          disabled={actingId === d.id}
                        >
                          {actingId === d.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => act(d.id, 'revoke')}
                          disabled={actingId === d.id}
                        >
                          Từ chối
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Thiết bị đang đăng nhập
        </h2>
        {active.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-400">
            Chưa có thiết bị nào.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100">
                {active.map((d) => (
                  <tr key={d.id} className="hover:bg-zinc-50">
                    <td className="w-10 px-4 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                        <Monitor className="h-4 w-4 text-emerald-600" />
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="font-medium text-zinc-900">
                        {d.device_label || 'Thiết bị'}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500">
                        {formatAgent(d.user_agent)}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-400">
                        IP {d.ip || '—'} · Duyệt lúc {formatTime(d.approved_at)} · Hoạt động gần
                        nhất {formatTime(d.last_seen_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => act(d.id, 'revoke')}
                        disabled={actingId === d.id}
                      >
                        {actingId === d.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-xs text-zinc-400">
          Xoá 1 thiết bị sẽ khoá phiên đăng nhập của riêng thiết bị đó ngay lập tức
          (các thiết bị khác không bị ảnh hưởng).
        </p>
      </section>

      {revoked.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Đã thu hồi
          </h2>
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-zinc-100">
                {revoked.map((d) => (
                  <tr key={d.id} className="opacity-60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-zinc-400" />
                        <span className="font-medium text-zinc-700">
                          {d.device_label || 'Thiết bị'}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                          Đã khoá
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-zinc-400">
                      {formatTime(d.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}