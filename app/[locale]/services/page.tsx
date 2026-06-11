import {BriefcaseBusiness, FileCheck2, Globe2, Handshake, SearchCheck, TrendingUp} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {BrandButton, PageHero, SectionHeading} from '@/components/ui';
import type {Locale} from '@/i18n/routing';

export default async function ServicesPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const common = await getTranslations('common');

  const services = [
    {icon: BriefcaseBusiness, title: t('representation'), text: t('representationText')},
    {icon: Handshake, title: t('transfers'), text: t('transfersText')},
    {icon: SearchCheck, title: t('scouting'), text: t('scoutingText')},
    {icon: TrendingUp, title: t('career'), text: t('careerText')},
    {icon: FileCheck2, title: t('legal'), text: t('legalText')},
    {icon: Globe2, title: t('relocation'), text: t('relocationText')}
  ];

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.title} className="group bg-panel p-8 transition hover:bg-navy sm:p-10">
              <div className="flex items-center justify-between">
                <service.icon className="h-9 w-9 text-blue-400" strokeWidth={1.4} />
                <span className="font-display text-4xl text-white/5">0{index + 1}</span>
              </div>
              <h2 className="mt-8 font-display text-2xl font-semibold text-white">{service.title}</h2>
              <p className="mt-4 text-sm leading-7 text-mist">{service.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <SectionHeading eyebrow={t('clubsEyebrow')} title={t('clubsTitle')} text={t('clubsText')} />
          <BrandButton href="/contact">{common('learnMore')}</BrandButton>
        </div>
      </section>
    </>
  );
}
