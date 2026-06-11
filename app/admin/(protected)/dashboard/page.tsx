import Link from 'next/link';
import {ArrowRight, ArrowRightLeft, Database, Eye, FileText, Globe2, Handshake, Newspaper, Settings2, UserRound} from 'lucide-react';
import {requireAdmin} from '@/src/lib/supabase/admin';

export default async function AdminDashboardPage() {
  const {supabase} = await requireAdmin();
  const [{count}, {data: recent}] = await Promise.all([
    supabase
      .from('site_content')
      .select('*', {count: 'exact', head: true}),
    supabase
      .from('site_content')
      .select('id, page, section, content_key, locale, updated_at')
      .order('updated_at', {ascending: false})
      .limit(6)
  ]);

  return (
    <>
      <div className="max-w-3xl">
        <div className="eyebrow">Administration</div>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          Content dashboard
        </h1>
        <p className="mt-4 text-lg leading-8 text-mist">
          Manage localized website copy while keeping the JSON translations as a safe fallback.
        </p>
        <Link
          href="/en?edit=true"
          className="mt-6 inline-flex h-12 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent"
        >
          <Eye className="h-4 w-4" /> Edit website
        </Link>
        <Link
          href="/admin/settings"
          className="ms-3 mt-6 inline-flex h-12 items-center gap-2 border border-accent/60 bg-accent/10 px-5 text-xs font-bold uppercase tracking-wider text-blue-200 transition hover:bg-accent/20"
        >
          <Settings2 className="h-4 w-4" /> Video settings
        </Link>
        <Link href="/admin/staff" className="ms-3 mt-6 inline-flex h-12 items-center gap-2 border border-line px-5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-accent">
          <UserRound className="h-4 w-4" /> Staff
        </Link>
        <Link href="/admin/partners" className="ms-3 mt-6 inline-flex h-12 items-center gap-2 border border-line px-5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-accent">
          <Handshake className="h-4 w-4" /> Partners
        </Link>
        <Link href="/admin/news" className="ms-3 mt-6 inline-flex h-12 items-center gap-2 border border-line px-5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-accent">
          <Newspaper className="h-4 w-4" /> News
        </Link>
        <Link href="/admin/transfers" className="ms-3 mt-6 inline-flex h-12 items-center gap-2 border border-line px-5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:border-accent">
          <ArrowRightLeft className="h-4 w-4" /> Transfers
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <Stat icon={FileText} value={String(count ?? 0)} label="Content overrides" />
        <Stat icon={Globe2} value="4" label="Supported locales" />
        <Stat icon={Database} value="Supabase" label="Content source" />
      </div>

      <section className="mt-10 border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">Recent changes</h2>
            <p className="mt-1 text-sm text-mist">Latest database-backed text overrides.</p>
          </div>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
          >
            Edit content <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {recent?.length ? recent.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 px-5 py-4 text-sm sm:grid-cols-[90px_1fr_150px] sm:items-center sm:px-6"
            >
              <span className="w-fit bg-brand/20 px-2 py-1 text-xs font-bold uppercase text-blue-300">
                {item.locale}
              </span>
              <span className="text-white">
                {item.page} / {item.section} / {item.content_key}
              </span>
              <span className="text-slate-500 sm:text-end">
                {new Date(item.updated_at).toLocaleDateString('en-GB')}
              </span>
            </div>
          )) : (
            <p className="px-5 py-8 text-sm text-mist sm:px-6">
              No overrides yet. The public website is currently using JSON fallbacks.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label
}: {
  icon: typeof FileText;
  value: string;
  label: string;
}) {
  return (
    <div className="border border-line bg-panel p-6">
      <Icon className="h-6 w-6 text-blue-400" />
      <div className="mt-5 font-display text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
