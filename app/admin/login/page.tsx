import Image from 'next/image';
import {redirect} from 'next/navigation';
import {LoginForm} from './login-form';
import {getAuthState} from '@/src/lib/supabase/admin';
import {getSupabaseConfig, isSupabaseConfigured} from '@/src/lib/supabase/config';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const auth = await getAuthState();
  if (auth.user && auth.isAdmin) {
    redirect('/admin/dashboard');
  }
  const configured = isSupabaseConfigured();
  let urlConfigured = false;
  let keyConfigured = false;

  if (configured) {
    const {url, key} = getSupabaseConfig();
    urlConfigured = Boolean(url);
    keyConfigured = Boolean(key);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_50%_10%,rgba(11,75,211,.16),transparent_30rem)] px-5 py-12">
      <section className="w-full max-w-md border border-line bg-[#04102a]/90 p-7 shadow-blue sm:p-9">
        <div className="flex items-center gap-4 border-b border-line pb-6">
          <div className="logo-plate h-16 w-16 rounded-xl">
            <Image
              src="/images/orso-logo.png"
              alt="Orso Football Agency"
              width={58}
              height={58}
              className="relative z-10 h-14 w-14 object-contain"
            />
          </div>
          <div>
            <div className="font-display text-xl font-semibold">Orso Admin</div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-blue-400">
              Content management
            </div>
          </div>
        </div>

        {isSupabaseConfigured() ? (
          <LoginForm />
        ) : (
          <div className="mt-8 border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
            Supabase is not configured. Copy <code>.env.example</code> to{' '}
            <code>.env.local</code> and add your project URL and publishable key.
          </div>
        )}

        {auth.user && !auth.isAdmin ? (
          <div className="mt-6 border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
            A Supabase user session was detected, but this account is not authorized
            as an admin. Ensure the <code>admin_users</code> table exists and contains
            this user&apos;s UUID.
            {auth.adminError ? (
              <span className="mt-2 block text-xs text-amber-200/80">
                Authorization error: {auth.adminError}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 border border-blue-800/40 bg-blue-950/25 p-4 text-xs leading-6 text-slate-300">
          <div className="mb-2 font-bold uppercase tracking-[0.14em] text-blue-400">
            Temporary auth debug
          </div>
          <div>Supabase URL configured: {urlConfigured ? 'yes' : 'no'}</div>
          <div>Supabase key configured: {keyConfigured ? 'yes' : 'no'}</div>
          <div>Current user detected: {auth.user ? 'yes' : 'no'}</div>
        </div>
      </section>
    </main>
  );
}
