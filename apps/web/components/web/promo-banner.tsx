'use client';

import { useEffect, useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { getActivePromoEvents } from '@/lib/queries';
import type { PromoEvent } from '@/lib/types';

const DISMISSED_KEY = 'gdl_dismissed_events';

export function PromoBanner() {
  const [event, setEvent] = useState<PromoEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getActivePromoEvents()
      .then((events) => {
        if (cancelled || events.length === 0) return;
        let dismissedIds: string[] = [];
        try {
          dismissedIds = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
        } catch {
          // ignore
        }
        const first = events.find((e) => !dismissedIds.includes(e.id)) ?? events[0];
        setEvent(first);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!event) return null;

  const dismiss = () => {
    try {
      const dismissedIds = JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
      localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissedIds, event.id]));
    } catch {
      // ignore
    }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className="relative flex items-center justify-center gap-2 px-10 py-2 text-center text-xs font-medium text-white sm:text-sm"
      style={{ backgroundColor: event.background || '#18181b' }}
    >
      <Megaphone className="h-4 w-4 shrink-0 text-emerald-300" />
      <span>
        {event.banner_title || event.name}
        {event.banner_body ? (
          <>
            {' '}
            <span className="hidden text-white/70 sm:inline">— {event.banner_body}</span>
          </>
        ) : null}
      </span>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 inline-flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Đóng thông báo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}