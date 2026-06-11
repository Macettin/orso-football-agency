import {Route, Search, TrendingUp, UsersRound} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BrandButton, PageHero, SectionHeading} from '@/components/ui';
import type {Locale} from '@/i18n/routing';

export default async function TalentsPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('talents');
  const common = await getTranslations('common');

  const steps = [
    {icon: Search, title: t('step1'), text: t('step1Text')},
    {icon: TrendingUp, title: t('step2'), text: t('step2Text')},
    {icon: Route, title: t('step3'), text: t('step3Text')}
  ];

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow={t('pathEyebrow')} title={t('pathTitle')} align="center" />
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-accent/40 md:block" />
            {steps.map((step, index) => (
              <article key={step.title} className="relative border border-line bg-panel p-8 text-center transition hover:border-accent/60 hover:shadow-blue-soft">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-accent/50 bg-blue-950/40 text-blue-400">
                  <step.icon className="h-7 w-7" />
                </span>
                <div className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-400">0{index + 1}</div>
                <h2 className="mt-3 font-display text-2xl font-semibold text-white">{step.title}</h2>
                <p className="mt-4 text-sm leading-7 text-mist">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <UsersRound className="h-16 w-16 text-blue-400" strokeWidth={1.2} />
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">{t('guardianTitle')}</h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-mist">{t('guardianText')}</p>
          </div>
          <BrandButton href="/contact">{common('contactAgent')}</BrandButton>
        </div>
      </section>
    </>
  );
}
