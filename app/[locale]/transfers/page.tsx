import {CalendarDays} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {TransferCard} from '@/components/transfer-card';
import {PageHero, SectionHeading} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {getPublishedTransfers} from '@/lib/transfers';

export const dynamic = 'force-dynamic';

export default async function TransfersPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('transfers');
  const deals = await getPublishedTransfers();
  const seasons = Array.from(new Set(deals.map((deal) => deal.season)));

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow={t('portfolioEyebrow')} title={t('topDeals')} />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {deals.length ? deals.map((deal) => <TransferCard key={deal.id ?? `${deal.player_name}-${deal.season}`} deal={deal} from={t('from')} to={t('to')} type={t('type')} />) : (
              <p className="border border-line bg-panel p-8 text-mist md:col-span-2">{t('empty')}</p>
            )}
          </div>
        </div>
      </section>
      {seasons.length ? <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell">
          <SectionHeading eyebrow={t('seasonEyebrow')} title={t('yearly')} />
          <div className="mt-10 space-y-4">
            {seasons.map((season) => (
              <div key={season} className="glass-card flex items-center justify-between gap-5 p-6">
                <div className="flex items-center gap-4"><CalendarDays className="h-6 w-6 text-blue-400" /><span className="font-display text-xl font-semibold text-white">{season}</span></div>
                <span className="text-sm text-mist">{t('completedMoves', {count: deals.filter((deal) => deal.season === season).length})}</span>
              </div>
            ))}
          </div>
        </div>
      </section> : null}
    </>
  );
}
