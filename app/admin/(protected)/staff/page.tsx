import {ImagePlus, Pencil, Plus, Save, Trash2, UserRound} from 'lucide-react';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {createStaffMember, deleteStaffMember, updateStaffMember} from './actions';

type StaffRow = {
  id: string;
  name: string;
  slug: string;
  role: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  display_order: number;
  is_published: boolean;
};

export default async function AdminStaffPage({searchParams}: {searchParams: Promise<{result?: string}>}) {
  const query = await searchParams;
  const {supabase} = await requireAdmin();
  const {data, error} = await supabase
    .from('staff_members')
    .select('*')
    .order('display_order', {ascending: true})
    .order('name', {ascending: true});
  const staff = (data ?? []) as StaffRow[];

  return (
    <>
      <Header eyebrow="Team directory" title="Manage staff" text="Publish the people behind Orso and control their display order on the About page." />
      {query.result ? <ResultMessage result={query.result} noun="Staff member" /> : null}
      {error ? <ResultMessage result={error.message} noun="Staff member" /> : null}

      <details className="mt-10 border border-accent/40 bg-panel" open={!staff.length}>
        <summary className="flex cursor-pointer items-center gap-3 p-5 font-display text-xl font-semibold text-white sm:p-6">
          <Plus className="h-5 w-5 text-blue-400" /> Add staff member
        </summary>
        <StaffForm action={createStaffMember} submitLabel="Create staff member" />
      </details>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-white">Staff profiles</h2>
          <span className="text-sm text-slate-500">{staff.length} records</span>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {staff.map((member) => (
            <article key={member.id} className="overflow-hidden border border-line bg-panel">
              <div className="grid grid-cols-[130px_1fr]">
                {member.photo_url ? (
                  <div className="min-h-44 bg-cover bg-center" style={{backgroundImage: `url("${member.photo_url}")`}} role="img" aria-label={member.name} />
                ) : (
                  <div className="flex min-h-44 items-center justify-center bg-blue-950/40"><UserRound className="h-10 w-10 text-blue-400" /></div>
                )}
                <div className="p-5">
                  <Badge>{member.is_published ? 'Published' : 'Draft'}</Badge>
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Order {member.display_order}</div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm text-blue-300">{member.role}</p>
                </div>
              </div>
              <details className="border-t border-line">
                <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider text-blue-300">
                  <Pencil className="h-4 w-4" /> Edit staff member
                </summary>
                <StaffForm action={updateStaffMember} member={member} submitLabel="Save changes" />
                <DeleteForm action={deleteStaffMember} id={member.id} label="Delete staff member" />
              </details>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function StaffForm({action, member, submitLabel}: {action: (formData: FormData) => Promise<void>; member?: StaffRow; submitLabel: string}) {
  return (
    <form action={action} className="grid gap-4 border-t border-line p-5 sm:grid-cols-2 sm:p-6">
      {member ? <input type="hidden" name="id" value={member.id} /> : null}
      <input type="hidden" name="current_photo_url" value={member?.photo_url ?? ''} />
      <Field label="Name" name="name" defaultValue={member?.name} required />
      <Field label="Slug" name="slug" defaultValue={member?.slug} required />
      <Field label="Role" name="role" defaultValue={member?.role} required />
      <Field label="Display order" name="display_order" type="number" defaultValue={member?.display_order ?? 0} />
      <Field label="Email" name="email" type="email" defaultValue={member?.email ?? ''} />
      <Field label="Phone" name="phone" type="tel" defaultValue={member?.phone ?? ''} />
      <Field label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={member?.linkedin_url ?? ''} />
      <Field label="Instagram URL" name="instagram_url" type="url" defaultValue={member?.instagram_url ?? ''} />
      <label>
        <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400"><ImagePlus className="h-4 w-4" /> Staff photo</span>
        <input name="photo" type="file" accept="image/*" className="block h-12 w-full border border-line bg-ink px-3 py-2 text-sm text-slate-300 file:mr-3 file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:font-bold file:text-white" />
      </label>
      <label className="flex items-center gap-3 text-sm text-slate-300 sm:self-end sm:pb-3">
        <input name="is_published" type="checkbox" defaultChecked={member?.is_published ?? true} className="h-4 w-4 accent-blue-600" /> Published
      </label>
      <div className="sm:col-span-2"><SubmitButton label={submitLabel} /></div>
    </form>
  );
}

function Header({eyebrow, title, text}: {eyebrow: string; title: string; text: string}) {
  return <div className="max-w-3xl"><div className="eyebrow">{eyebrow}</div><h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">{title}</h1><p className="mt-4 text-lg leading-8 text-mist">{text}</p></div>;
}

function Field({label, name, defaultValue, type = 'text', required}: {label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean}) {
  return <label><span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span><input name={name} type={type} defaultValue={defaultValue} required={required} min={type === 'number' ? 0 : undefined} className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent" /></label>;
}

function SubmitButton({label}: {label: string}) {
  return <button className="inline-flex h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-accent"><Save className="h-4 w-4" /> {label}</button>;
}

function DeleteForm({action, id, label}: {action: (formData: FormData) => Promise<void>; id: string; label: string}) {
  return <form action={action} className="border-t border-line p-5 sm:p-6"><input type="hidden" name="id" value={id} /><button className="inline-flex h-10 items-center gap-2 border border-red-500/50 px-4 text-xs font-bold uppercase tracking-wider text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /> {label}</button></form>;
}

function Badge({children}: {children: React.ReactNode}) {
  return <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">{children}</span>;
}

function ResultMessage({result, noun}: {result: string; noun: string}) {
  const success = ['created', 'updated', 'deleted'].includes(result);
  return <p className={`mt-6 border-s-2 px-4 py-3 text-sm ${success ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200' : 'border-red-500 bg-red-500/10 text-red-200'}`}>{success ? `${noun} ${result} successfully.` : decodeURIComponent(result)}</p>;
}
