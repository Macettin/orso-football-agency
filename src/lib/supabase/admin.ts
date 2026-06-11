import {redirect} from 'next/navigation';
import {isSupabaseConfigured} from './config';
import {createClient} from './server';

export async function getAuthState() {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      user: null,
      isAdmin: false,
      adminError: null,
      supabase: null
    };
  }

  const supabase = await createClient();
  const {
    data: {user},
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      configured: true,
      user: null,
      isAdmin: false,
      adminError: userError?.message ?? null,
      supabase
    };
  }

  const {data: admin, error: adminError} = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    configured: true,
    user,
    isAdmin: !adminError && Boolean(admin),
    adminError: adminError?.message ?? null,
    supabase
  };
}

export async function getAdmin() {
  const state = await getAuthState();
  return state.user && state.isAdmin && state.supabase
    ? {user: state.user, supabase: state.supabase}
    : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  return admin;
}
