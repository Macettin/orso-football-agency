import {ClipboardCheck, Globe2, Trophy} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BrandButton, PageHero} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {coaches} from '@/lib/data';

export default async function CoachesPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('coaches');

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell grid gap-6 lg:grid-cols-3">
          {coaches.map((coach, index) => (
            <article key={coach.name} className="group border border-line bg-panel p-7 transition hover:border-accent/60 hover:shadow-blue-soft">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-blue-950/30 font-display text-lg text-blue-400">
                  {coach.name.split(' ').map((part) => part[0]).join('')}
                </span>
                <span className="text-4xl font-semibold text-white/5">0{index + 1}</span>
              </div>
              <h2 className="mt-8 font-display text-2xl font-semibold text-white">{coach.name}</h2>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-blue-400">{coach.role[locale]}</p>
              <div className="mt-7 border-t border-line pt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ClipboardCheck className="h-4 w-4 text-blue-400" />{t('expertise')}
                </div>
                <p className="mt-3 text-sm leading-7 text-mist">{coach.expertise[locale]}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                <Globe2 className="h-4 w-4 text-blue-400" />{t('availability')}
              </div>
            </article>
          ))}
        </div>
        <div className="container-shell mt-12 flex justify-center">
          <BrandButton href="/contact"><Trophy className="h-4 w-4" />{t('cta')}</BrandButton>
        </div>
      </section>
    </>
  );
}
