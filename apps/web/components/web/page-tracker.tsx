'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTracker() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastSent.current === pathname) return;
    lastSent.current = pathname;

    let visitorId: string | null = null;
    try {
      visitorId = localStorage.getItem('gdl_visitor_id');
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('gdl_visitor_id', visitorId);
      }
    } catch {
      // localStorage unavailable — track without visitor id
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || null,
        visitor_id: visitorId,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
