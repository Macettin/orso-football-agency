import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PlayerCard} from '@/components/player-card';
import {PageHero} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {getPublicPlayers} from '@/lib/players';

export const dynamic = 'force-dynamic';

export default async function PlayersPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('players');
  const players = await getPublicPlayers();

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {players.map((player) => (
            <PlayerCard key={player.slug} player={player} locale={locale} />
          ))}
        </div>
      </section>
    </>
  );
}
