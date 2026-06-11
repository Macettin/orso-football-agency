import Image from 'next/image';
import {ArrowRightLeft, ExternalLink} from 'lucide-react';
import type {TransferDeal} from '@/lib/transfers';

export function TransferCard({deal, from, to, type}: {deal: TransferDeal; from: string; to: string; type: string}) {
  return (
    <article className="overflow-hidden border border-line bg-panel transition hover:border-accent/60 hover:shadow-blue-soft">
      {(deal.image_url || deal.player_photo_url) ? (
        <div className="relative aspect-[16/9] bg-[#061426]">
          <Image src={deal.image_url || deal.player_photo_url!} alt={deal.player_name} fill sizes="(max-width: 768px) 100vw, 520px" className="object-contain p-3" />
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-blue-400">{deal.season}</span>
          {deal.is_top_deal ? <span className="bg-brand/20 px-2 py-1 text-[10px] font-bold uppercase text-blue-300">Top deal</span> : <ArrowRightLeft className="h-5 w-5 text-blue-400" />}
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-white">{deal.player_name}</h2>
        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div><div className="text-xs uppercase tracking-wider text-slate-500">{from}</div><div className="mt-2 font-semibold text-white">{deal.from_club}</div></div>
          <span className="text-blue-400 rtl:rotate-180">{'->'}</span>
          <div><div className="text-xs uppercase tracking-wider text-slate-500">{to}</div><div className="mt-2 font-semibold text-white">{deal.to_club}</div></div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs uppercase tracking-wider text-mist">
          <span>{type}: <strong className="text-white">{deal.transfer_type}</strong></span>
          {deal.announcement_url ? <a href={deal.announcement_url} target="_blank" rel="noreferrer" aria-label="Announcement"><ExternalLink className="h-4 w-4 text-blue-400" /></a> : null}
        </div>
      </div>
    </article>
  );
}
