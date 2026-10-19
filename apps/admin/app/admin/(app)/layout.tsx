import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { ProtectedRoute } from '@/components/admin/protected-route';

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect('/admin');
  }
  return <ProtectedRoute>{children}</ProtectedRoute>;
}