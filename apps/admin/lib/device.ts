import { sha256Hex } from '@/lib/crypto';

export const DEVICE_COOKIE = 'gdl_device_id';
export const MAX_ACTIVE_DEVICES = 3;

export function hashUserAgent(userAgent: string): Promise<string> {
  return sha256Hex(userAgent || '');
}

export function deviceLabelFromUA(userAgent: string, platform: string): string {
  const ua = userAgent || 'Unknown';
  const labels: [RegExp, string][] = [
    [/iPad/i, 'iPad'],
    [/iPhone/i, 'iPhone'],
    [/Android/i, 'Android'],
    [/Macintosh|Mac OS/i, 'MacBook'],
    [/Windows/i, 'Windows'],
    [/Linux/i, 'Linux'],
  ];
  for (const [needle, label] of labels) {
    if (needle.test(ua)) return label;
  }
  return platform || 'Thiết bị';
}

export function deviceNameFromUA(userAgent: string): string {
  const ua = userAgent ?? '';
  let name = 'Thiết bị';
  if (/Windows/i.test(ua)) name = 'Windows';
  else if (/Mac OS X|iPhone|iPad/i.test(ua)) name = 'macOS/iOS';
  else if (/Android/i.test(ua)) name = 'Android';
  else if (/Linux/i.test(ua)) name = 'Linux';
  if (/Edg\//i.test(ua)) name += ' - Edge';
  else if (/Firefox\//i.test(ua)) name += ' - Firefox';
  else if (/Chrome\//i.test(ua)) name += ' - Chrome';
  else if (/Safari\//i.test(ua)) name += ' - Safari';
  return name;
}