'use client';

import {useState} from 'react';
import {ArrowRight, ArrowRightLeft, ImagePlus} from 'lucide-react';
import {AdminSubmitButton} from '@/components/admin/submit-button';

export type TransferFormRow = {
  id: string;
  player_name: string;
  player_photo_url: string | null;
  from_club: string;
  to_club: string;
  country: string;
  season: string;
  transfer_type: string;
  announcement_url: string | null;
  image_url: string | null;
  display_order: number;
  is_top_deal: boolean;
  is_published: boolean;
};

type Props = {
  action: (data: FormData) => Promise<void>;
  label: string;
  row?: TransferFormRow;
};

export function TransferForm({action, label, row}: Props) {
  const [playerName, setPlayerName] = useState(row?.player_name ?? '');
  const [fromClub, setFromClub] = useState(row?.from_club ?? '');
  const [toClub, setToClub] = useState(row?.to_club ?? '');
  const [season, setSeason] = useState(row?.season ?? '');
  const [transferType, setTransferType] = useState(row?.transfer_type ?? '');
  const [published, setPublished] = useState(row?.is_published ?? true);
  const [topDeal, setTopDeal] = useState(row?.is_top_deal ?? false);
  const [dealImage, setDealImage] = useState(row?.image_url ?? '');
  const [playerImage, setPlayerImage] = useState(row?.player_photo_url ?? '');
  const previewImage = dealImage || playerImage;

  function selectImage(file: File | undefined, current: string | null | undefined, setter: (value: string) => void, previous: string) {
    if (previous.startsWith('blob:')) URL.revokeObjectURL(previous);
    setter(file ? URL.createObjectURL(file) : (current ?? ''));
  }

  return (
    <form action={action} className="grid gap-6 border-t border-line p-5 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {row ? <input type="hidden" name="id" value={row.id} /> : null}
        <input type="hidden" name="current_player_photo_url" value={row?.player_photo_url ?? ''} />
        <input type="hidden" name="current_image_url" value={row?.image_url ?? ''} />
        <Field label="Player name" name="player_name" value={playerName} onChange={setPlayerName} required />
        <Field label="Season" name="season" value={season} onChange={setSeason} required />
        <Field label="From club" name="from_club" value={fromClub} onChange={setFromClub} required />
        <Field label="To club" name="to_club" value={toClub} onChange={setToClub} required />
        <Field label="Country" name="country" value={row?.country ?? ''} />
        <Field label="Transfer type" name="transfer_type" value={transferType} onChange={setTransferType} />
        <Field label="Announcement URL" name="announcement_url" type="url" value={row?.announcement_url ?? ''} />
        <Field label="Display order" name="display_order" type="number" value={String(row?.display_order ?? 0)} />
        <Upload
          label="Player photo"
          name="player_photo"
          onChange={(file) => selectImage(file, row?.player_photo_url, setPlayerImage, playerImage)}
        />
        <Upload
          label="Deal image"
          name="image"
          onChange={(file) => selectImage(file, row?.image_url, setDealImage, dealImage)}
        />
        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <Check name="is_published" label="Published" checked={published} onChange={setPublished} />
          <Check name="is_top_deal" label="Top deal" checked={topDeal} onChange={setTopDeal} />
        </div>
        <div className="sm:col-span-2">
          <AdminSubmitButton label={label} />
        </div>
      </div>

      <aside>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Live preview</div>
        <article className="overflow-hidden border border-line bg-panel shadow-blue-soft">
          <div
            className="flex aspect-[16/9] items-center justify-center bg-[#061426] bg-contain bg-center bg-no-repeat"
            style={previewImage ? {backgroundImage: `url("${previewImage}")`} : undefined}
          >
            {!previewImage ? <ArrowRightLeft className="h-12 w-12 text-blue-400" /> : null}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{season || 'Season'}</span>
              <div className="flex gap-2">
                {topDeal ? <Badge>Top deal</Badge> : null}
                <Badge>{published ? 'Published' : 'Draft'}</Badge>
              </div>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">{playerName || 'Player name'}</h3>
            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
              <span className="font-semibold text-white">{fromClub || 'From club'}</span>
              <ArrowRight className="h-4 w-4 text-blue-400 rtl:rotate-180" />
              <span className="text-end font-semibold text-white">{toClub || 'To club'}</span>
            </div>
            <p className="mt-5 border-t border-line pt-4 text-xs uppercase tracking-wider text-mist">
              Type: <strong className="text-white">{transferType || 'Transfer'}</strong>
            </p>
          </div>
        </article>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required
}: {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  const [localValue, setLocalValue] = useState(value);
  const displayedValue = onChange ? value : localValue;
  const update = onChange ?? setLocalValue;
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase text-slate-400">{label}</span>
      <input
        name={name}
        type={type}
        value={displayedValue}
        onChange={(event) => update(event.target.value)}
        required={required}
        min={type === 'number' ? 0 : undefined}
        className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent"
      />
    </label>
  );
}

function Upload({label, name, onChange}: {label: string; name: string; onChange: (file?: File) => void}) {
  return (
    <label>
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
        <ImagePlus className="h-4 w-4" /> {label}
      </span>
      <input
        name={name}
        type="file"
        accept="image/*"
        onChange={(event) => onChange(event.target.files?.[0])}
        className="block h-12 w-full border border-line bg-ink px-3 py-2 text-sm text-slate-300"
      />
    </label>
  );
}

function Check({
  name,
  label,
  checked,
  onChange
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-slate-300">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
      {label}
    </label>
  );
}

function Badge({children}: {children: React.ReactNode}) {
  return <span className="bg-blue-950/70 px-2 py-1 text-[10px] font-bold uppercase text-blue-300">{children}</span>;
}
