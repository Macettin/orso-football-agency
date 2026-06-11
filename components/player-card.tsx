import {ArrowUpRight, Flag, MapPin} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import Image from 'next/image';
import type {Locale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import type {Player} from '@/lib/data';
import {playerSlug} from '@/lib/slug';
import {InitialsPortrait} from './ui';

export async function PlayerCard({player, locale}: {player: Player; locale: Locale}) {
  const t = await getTranslations('common');
  const slug = playerSlug(player.slug, player.name);

  return (
    <article className="group mx-auto w-full max-w-[330px] overflow-hidden border border-line bg-panel shadow-[0_18px_45px_rgba(0,0,0,.18)] transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-blue">
      {player.photoUrl ? (
        <div className="relative aspect-[4/5] overflow-hidden border-b border-line bg-[radial-gradient(circle_at_50%_35%,rgba(11,75,211,.16),transparent_48%),linear-gradient(180deg,#0b1628_0%,#050c18_100%)] p-4 sm:p-5">
          <Image
            src={player.photoUrl}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 90vw, 330px"
            className="object-contain p-3 transition duration-500 group-hover:scale-[1.015] sm:p-4"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-panel/70 to-transparent" />
        </div>
      ) : (
        <div className="aspect-[4/5] border-b border-line">
          <InitialsPortrait initials={player.initials} tone={player.tone} />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-blue-400">{player.position[locale]}</div>
        <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-white">{player.name}</h3>
        <div className="mt-3 grid gap-2 text-xs text-mist">
          <span className="flex min-w-0 items-center gap-2">
            <Flag className="h-3.5 w-3.5 shrink-0 text-blue-400" />
            <span className="truncate">{player.nationality[locale]}</span>
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400" />
            <span className="truncate">{player.club}</span>
          </span>
        </div>
        <Link
          href={`/players/${slug}`}
          className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition group-hover:text-blue-300"
        >
          {t('viewProfile')}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
