import {Handshake, ImagePlus, Pencil, Plus, Save, Trash2} from 'lucide-react';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {createPartner, deletePartner, updatePartner} from './actions';

type PartnerRow = {
  id: string;
  name: string;
  website_url: string | null;
  logo_url: string | null;
  description: string | null;
  display_order: number;
  is_published: boolean;
};

export default async function AdminPartnersPage({searchParams}: {searchParams: Promise<{result?: string}>}) {
  const query = await searchParams;
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase.from('partners').select('*').order('display_order', {ascending: true}).order('name', {ascending: true});
  const partners = (data ?? []) as PartnerRow[];

  return (
    <>
      <div className="max-w-3xl"><div className="eyebrow">Agency network</div><h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">Manage partners</h1><p className="mt-4 text-lg leading-8 text-mist">Publish partner logos, descriptions and links in a controlled homepage section.</p></div>
      {query.result ? <ResultMessage result={query.result} /> : null}
      {error ? <ResultMessage result={error.message} /> : null}

      <details className="mt-10 border border-accent/40 bg-panel" open={!partners.length}>
        <summary className="flex cursor-pointer items-center gap-3 p-5 font-display text-xl font-semibold text-white sm:p-6"><Plus className="h-5 w-5 text-blue-400" /> Add partner</summary>
        <PartnerForm action={createPartner} submitLabel="Create partner" />
      </details>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-semibold text-white">Partner records</h2><span className="text-sm text-slate-500">{partners.length} records</span></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {partners.map((partner) => (
            <article key={partner.id} className="overflow-hidden border border-line bg-panel">
              <div className="grid grid-cols-[150px_1fr]">
                <div className="flex min-h-40 items-center justify-center bg-white/[0.03] p-5">
                  {partner.logo_url ? <div className="h-24 w-full bg-contain bg-center bg-no-repeat" style={{backgroundImage: `url("${partner.logo_url}")`}} role="img" aria-label={`${partner.name} logo`} /> : <Handshake className="h-10 w-10 text-blue-400" />}
                </div>
                <div className="p-5">
                  <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">{partner.is_published ? 'Published' : 'Draft'}</span>
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Order {partner.display_order}</div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{partner.name}</h3>
                  {partner.description ? <p className="mt-2 line-clamp-2 text-sm text-mist">{partner.description}</p> : null}
                </div>
              </div>
              <details className="border-t border-line">
                <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider text-blue-300"><Pencil className="h-4 w-4" /> Edit partner</summary>
                <PartnerForm action={updatePartner} partner={partner} submitLabel="Save changes" />
                <form action={deletePartner} className="border-t border-line p-5 sm:p-6"><input type="hidden" name="id" value={partner.id} /><button className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /> Delete partner</button></form>
              </details>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function PartnerForm({action, partner, submitLabel}: {action: (formData: FormData) => Promise<void>; partner?: PartnerRow; submitLabel: string}) {
  return (
    <form action={action} className="grid gap-4 border-t border-line p-5 sm:grid-cols-2 sm:p-6">
      {partner ? <input type="hidden" name="id" value={partner.id} /> : null}
      <input type="hidden" name="current_logo_url" value={partner?.logo_url ?? ''} />
      <Field label="Partner name" name="name" defaultValue={partner?.name} required />
      <Field label="Website URL" name="website_url" type="url" defaultValue={partner?.website_url ?? ''} />
      <Field label="Display order" name="display_order" type="number" defaultValue={partner?.display_order ?? 0} />
      <label><span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><ImagePlus className="h-4 w-4" /> Partner logo</span><input name="logo" type="file" accept="image/*" className="block h-12 w-full border border-line bg-ink px-3 py-2 text-sm text-slate-300 file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:font-bold file:text-white" /></label>
      <label className="sm:col-span-2"><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Description</span><textarea name="description" defaultValue={partner?.description ?? ''} rows={4} className="w-full border border-line bg-ink px-3 py-3 text-sm text-white outline-none focus:border-accent" /></label>
      <label className="flex items-center gap-3 text-sm text-slate-300"><input name="is_published" type="checkbox" defaultChecked={partner?.is_published ?? true} className="h-4 w-4 accent-blue-600" /> Published</label>
      <div className="sm:text-end"><button className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent"><Save className="h-4 w-4" /> {submitLabel}</button></div>
    </form>
  );
}

function Field({label, name, defaultValue, type = 'text', required}: {label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean}) {
  return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span><input name={name} type={type} defaultValue={defaultValue} required={required} min={type === 'number' ? 0 : undefined} className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent" /></label>;
}

function ResultMessage({result}: {result: string}) {
  const success = ['created', 'updated', 'deleted'].includes(result);
  return <p className={`mt-6 border-s-2 px-4 py-3 text-sm ${success ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200' : 'border-red-500 bg-red-500/10 text-red-200'}`}>{success ? `Partner ${result} successfully.` : decodeURIComponent(result)}</p>;
}
