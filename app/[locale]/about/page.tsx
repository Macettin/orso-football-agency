import {Compass, Eye, ShieldCheck} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BrandButton, PageHero, SectionHeading} from '@/components/ui';
import {StaffCard} from '@/components/staff-card';
import type {Locale} from '@/i18n/routing';
import {markets} from '@/lib/data';
import {getPublishedStaff} from '@/lib/staff';

export default async function AboutPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const common = await getTranslations('common');
  const staff = await getPublishedStaff();

  const values = [
    {icon: ShieldCheck, title: t('value1'), text: t('value1Text')},
    {icon: Eye, title: t('value2'), text: t('value2Text')},
    {icon: Compass, title: t('value3'), text: t('value3Text')}
  ];

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow={t('storyEyebrow')} title={t('storyTitle')} text={t('story')} />
          <div className="glass-card relative p-8 sm:p-10">
            <div className="absolute -left-px top-10 h-20 w-1 bg-accent rtl:left-auto rtl:-right-px" />
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{t('ownerTitle')}</div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white">Eren YILDIRIM</h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">{common('licensed')}</p>
            <p className="mt-6 text-base leading-8 text-mist">{t('ownerText')}</p>
            <div className="mt-8"><BrandButton href="/contact" outline>{common('contactAgent')}</BrandButton></div>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell">
          <SectionHeading eyebrow={t('marketsEyebrow')} title={t('marketsTitle')} align="center" />
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {markets.map((market, index) => (
              <div key={market} className="glass-card flex aspect-square items-center justify-center p-4 text-center">
                <div>
                  <div className="font-display text-3xl text-blue-400">0{index + 1}</div>
                  <div className="mt-3 text-sm font-semibold text-white">{market}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow={t('teamEyebrow')} title={t('teamTitle')} align="center" />
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((member) => <StaffCard key={member.id} member={member} />)}
          </div>
        </div>
      </section>

      <section className="section-pad border-t border-line">
        <div className="container-shell">
          <SectionHeading eyebrow={t('valuesEyebrow')} title={t('valuesTitle')} align="center" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="border border-line bg-panel p-8 transition hover:border-accent/50 hover:shadow-blue-soft">
                <value.icon className="h-9 w-9 text-blue-400" strokeWidth={1.4} />
                <h3 className="mt-7 font-display text-2xl font-semibold text-white">{value.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
