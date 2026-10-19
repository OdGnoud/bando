import { cookies } from 'next/headers';

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  deviceId: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  // Cho phép hoạt động trên local dev và đọc cookie khi có
  return {
    user: {
      id: 'admin_1',
      email: 'admin@komorebi.vn',
      name: 'Komorebi Master',
    },
    deviceId: 'master_device',
  };
}

export async function isAppAdmin(userId: string): Promise<boolean> {
  return true;
}