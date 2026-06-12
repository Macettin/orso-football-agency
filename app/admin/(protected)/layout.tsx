import Image from 'next/image';
import Link from 'next/link';
import {ArrowRightLeft, FileText, Handshake, LayoutDashboard, LogOut, Newspaper, Settings2, UserRound, UsersRound} from 'lucide-react';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {signOut} from '../actions';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children
}: Readonly<{children: React.ReactNode}>) {
  const {user} = await requireAdmin();

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-line bg-[#0B1E36]/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="logo-plate h-14 w-14 rounded-lg">
              <Image
                src="/images/orso-logo.png"
                alt="Orso Football Agency"
                width={50}
                height={50}
                className="relative z-10 h-12 w-12 object-contain"
              />
            </div>
            <div>
              <div className="font-display font-semibold text-white">Orso Admin</div>
              <div className="text-xs text-slate-400">{user.email}</div>
            </div>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-2">
            <Link
              href="/admin/dashboard"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <FileText className="h-4 w-4" /> Content
            </Link>
            <Link
              href="/admin/players"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <UsersRound className="h-4 w-4" /> Players
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <Settings2 className="h-4 w-4" /> Settings
            </Link>
            <Link
              href="/admin/staff"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <UserRound className="h-4 w-4" /> Staff
            </Link>
            <Link
              href="/admin/partners"
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white"
            >
              <Handshake className="h-4 w-4" /> Partners
            </Link>
            <Link href="/admin/news" className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white">
              <Newspaper className="h-4 w-4" /> News
            </Link>
            <Link href="/admin/transfers" className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-accent hover:text-white">
              <ArrowRightLeft className="h-4 w-4" /> Transfers
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 border border-line px-3 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:border-red-500/60 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
