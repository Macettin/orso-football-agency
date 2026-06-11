import {redirect} from 'next/navigation';
import {getAdmin} from '@/src/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const admin = await getAdmin();
  redirect(admin ? '/admin/dashboard' : '/admin/login');
}
