import {getTranslations, setRequestLocale} from 'next-intl/server';
import {TransferCard} from '@/components/transfer-card';
import {PageHero} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {getPublishedTransfers} from '@/lib/transfers';

export const dynamic = 'force-dynamic';

export default async function TopDealsPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('transfers');
  const deals = await getPublishedTransfers({topOnly: true});
  return (
    <>
      <PageHero eyebrow={t('portfolioEyebrow')} title={t('topDeals')} intro={t('intro')} />
      <section className="section-pad"><div className="container-shell grid gap-6 md:grid-cols-2">
        {deals.length ? deals.map((deal) => <TransferCard key={deal.id ?? `${deal.player_name}-${deal.season}`} deal={deal} from={t('from')} to={t('to')} type={t('type')} />) : (
          <p className="border border-line bg-panel p-8 text-mist md:col-span-2">{t('emptyTopDeals')}</p>
        )}
      </div></section>
    </>
  );
}
