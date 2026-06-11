'use server';

import {redirect} from 'next/navigation';
import {createClient} from '@/src/lib/supabase/server';

export type LoginState = {
  error: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return {error: 'Email and password are required.'};
  }

  const supabase = await createClient();
  const {
    data: {user},
    error: signInError
  } = await supabase.auth.signInWithPassword({email, password});

  if (signInError || !user) {
    return {error: signInError?.message ?? 'Supabase did not return a user.'};
  }

  const {data: admin, error: adminError} = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (adminError) {
    await supabase.auth.signOut();
    return {error: `Admin authorization check failed: ${adminError.message}`};
  }

  if (!admin) {
    await supabase.auth.signOut();
    return {
      error:
        'Login succeeded, but this account is not listed in the admin_users table.'
    };
  }

  redirect('/admin/dashboard');
}
