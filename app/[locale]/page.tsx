import {
  ArrowDown,
  CheckCircle2,
  Globe2,
  Handshake,
  ShieldCheck,
  Trophy,
  UsersRound
} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {PlayerCard} from '@/components/player-card';
import {NewsCard} from '@/components/news-card';
import {BrandButton, SectionHeading} from '@/components/ui';
import {VisualEditButton} from '@/components/admin/visual-edit-button';
import type {Locale} from '@/i18n/routing';
import {getFeaturedPlayers} from '@/lib/players';
import {getHeroVideoSettings} from '@/lib/site-settings';
import {getPublishedPartners} from '@/lib/partners';
import {PartnerCard} from '@/components/partner-card';
import {getPublishedNews} from '@/lib/news';
import {getPublishedTransfers} from '@/lib/transfers';

export const dynamic = 'force-dynamic';

export default async function HomePage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const common = await getTranslations('common');
  const serviceT = await getTranslations('services');
  const [featuredPlayers, heroVideo, partners, latestNews, latestTransfers] = await Promise.all([
    getFeaturedPlayers(),
    getHeroVideoSettings(),
    getPublishedPartners(),
    getPublishedNews(locale, 3),
    getPublishedTransfers({preferTop: true, limit: 3})
  ]);

  const services = [
    {icon: UsersRound, title: serviceT('representation'), text: serviceT('representationText'), section: 'representation', contentKey: 'representationText'},
    {icon: Handshake, title: serviceT('transfers'), text: serviceT('transfersText'), section: 'transfers', contentKey: 'transfersText'},
    {icon: Globe2, title: serviceT('scouting'), text: serviceT('scoutingText'), section: 'scouting', contentKey: 'scoutingText'}
  ];

  return (
    <>
      <section className="relative min-h-screen overflow-hidden border-b border-line bg-[#071426]">
        {heroVideo.enabled && heroVideo.embedUrl ? (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <iframe
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 scale-125 border-0"
              src={heroVideo.embedUrl}
              title="Orso Football Agency background video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              tabIndex={-1}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_38%,rgba(37,99,235,.26),transparent_32rem),linear-gradient(135deg,#071426_0%,#0B1E36_55%,#071426_100%)] rtl:bg-[radial-gradient(circle_at_28%_38%,rgba(37,99,235,.26),transparent_32rem),linear-gradient(225deg,#071426_0%,#0B1E36_55%,#071426_100%)]" />
        )}
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(7,20,38,.88)_0%,rgba(11,30,54,.66)_45%,rgba(7,20,38,.38)_100%)] rtl:bg-[linear-gradient(270deg,rgba(7,20,38,.88)_0%,rgba(11,30,54,.66)_45%,rgba(7,20,38,.38)_100%)]" />
        <VisualEditButton page="home" section="hero" contentKey="title" />
        <VisualEditButton page="home" section="hero" contentKey="titleAccent" offset={1} />
        <VisualEditButton page="home" section="hero" contentKey="description" offset={2} />
        <VisualEditButton page="home" section="hero" contentKey="primaryCta" offset={3} />
        <VisualEditButton page="home" section="hero" contentKey="secondaryCta" offset={4} />
        <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl items-end px-5 pb-24 pt-36 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <div className="eyebrow">{t('eyebrow')}</div>
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.7rem]">
              {t('title')} <span className="brand-text">{t('titleAccent')}</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">{t('description')}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <BrandButton href="/players">{t('primaryCta')}</BrandButton>
              <BrandButton href="/contact" outline>{t('secondaryCta')}</BrandButton>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" />{t('license')}</span>
              <span className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-blue-400" />{common('based')}</span>
            </div>
          </div>
        </div>
        <ArrowDown className="absolute bottom-8 left-1/2 z-10 h-5 w-5 -translate-x-1/2 animate-bounce text-blue-400" />
      </section>

      <section className="light-section section-pad relative">
        <VisualEditButton page="home" section="about" contentKey="aboutText" />
        <div className="container-shell grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow={t('aboutEyebrow')} title={t('aboutTitle')} text={t('aboutText')} />
            <div className="mt-8"><BrandButton href="/about" outline>{common('discover')}</BrandButton></div>
          </div>
          <div className="relative min-h-[390px] border border-[#d7e1ee] bg-white p-8 shadow-blue-soft sm:p-10">
            <div className="absolute -right-3 -top-3 h-20 w-20 border-r border-t border-accent/70" />
            <div className="text-7xl font-semibold text-blue-400">“</div>
            <p className="mt-4 font-display text-2xl leading-relaxed text-[#0F172A]">
              {t('founderQuote')}
            </p>
            <div className="mt-10 border-t border-line pt-6">
              <div className="font-display text-lg font-bold text-[#0F172A]">Eren YILDIRIM</div>
              <div className="mt-1 text-xs uppercase tracking-[0.16em] text-blue-400">{common('licensed')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow={t('playersEyebrow')} title={t('playersTitle')} text={t('playersText')} />
            <BrandButton href="/players" outline>{common('viewAll')}</BrandButton>
          </div>
          <div className="mt-10 grid justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.slug} player={player} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {latestTransfers.length ? <section className="light-section section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow={t('transfersEyebrow')} title={t('transfersTitle')} />
          <div className="mt-10 divide-y divide-[#d7e1ee] border-y border-[#d7e1ee]">
            {latestTransfers.map((transfer, index) => (
              <div key={transfer.id ?? `${transfer.player_name}-${transfer.season}`} className="grid gap-4 py-6 sm:grid-cols-[60px_1fr_1fr_auto] sm:items-center">
                <span className="font-display text-2xl text-blue-400">0{index + 1}</span>
                <div>
                  <div className="font-display text-xl font-semibold text-[#0F172A]">{transfer.player_name}</div>
                  <div className="mt-1 text-sm text-slate-600">{transfer.season}</div>
                </div>
                <div className="text-sm text-slate-700">{transfer.from_club} <span className="mx-2 text-blue-600">{'->'}</span> {transfer.to_club}</div>
                <span className="w-fit border border-[#d7e1ee] bg-white px-3 py-1 text-xs uppercase tracking-wider text-slate-600">{transfer.transfer_type}</span>
              </div>
            ))}
          </div>
        </div>
      </section> : null}

      <section className="section-pad relative border-y border-line bg-panel/60">
        <div className="container-shell relative">
          <VisualEditButton page="home" section="services" contentKey="servicesTitle" />
          <VisualEditButton page="home" section="services" contentKey="servicesEyebrow" offset={1} />
          <SectionHeading eyebrow={t('servicesEyebrow')} title={t('servicesTitle')} align="center" />
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="relative bg-navy p-8 transition hover:bg-blue-950/60 sm:p-10">
                <service.icon className="h-8 w-8 text-blue-400" strokeWidth={1.5} />
                <h3 className="mt-8 font-display text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{service.text}</p>
                <VisualEditButton
                  page="services"
                  section={service.section}
                  contentKey={service.section}
                />
                <VisualEditButton
                  page="services"
                  section={service.section}
                  contentKey={service.contentKey}
                  offset={1}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="light-section section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow={t('statsEyebrow')} title={t('statsTitle')} align="center" />
          <div className="mt-12 grid grid-cols-2 overflow-hidden border border-[#d7e1ee] bg-white shadow-blue-soft md:grid-cols-4">
            {[
              ['6+', t('statMarkets')],
              ['4', t('statLanguages')],
              ['360°', t('statSupport')],
              ['1', t('statStandard')]
            ].map(([value, label], index) => (
              <div key={label} className="relative border-b border-r border-[#d7e1ee] bg-gradient-to-b from-blue-50 to-white p-7 text-center last:border-r-0 md:p-10">
                <div className="font-display text-4xl font-semibold text-blue-400 sm:text-5xl">{value}</div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-600">{label}</div>
                <VisualEditButton
                  page="home"
                  section="stats"
                  contentKey={['statMarkets', 'statLanguages', 'statSupport', 'statStandard'][index]}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-line bg-navy">
        <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <div className="eyebrow">{t('testimonialsEyebrow')}</div>
            <Trophy className="mt-6 h-12 w-12 text-blue-400" strokeWidth={1.2} />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-5xl">{t('testimonialsTitle')}</h2>
            <blockquote className="mt-7 text-xl leading-9 text-slate-300">“{t('testimonial')}”</blockquote>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-blue-400">{t('testimonialRole')}</p>
          </div>
        </div>
      </section>

      {partners.length ? (
        <section className="light-section section-pad relative border-b border-[#d7e1ee]">
          <div className="container-shell relative">
            <VisualEditButton page="home" section="partners" contentKey="partnersTitle" />
            <VisualEditButton page="home" section="partners" contentKey="partnersEyebrow" offset={1} />
            <SectionHeading eyebrow={t('partnersEyebrow')} title={t('partnersTitle')} align="center" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {partners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
            </div>
          </div>
        </section>
      ) : null}

      {latestNews.length ? <section className="light-section section-pad border-b border-[#d7e1ee]">
        <div className="container-shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow={t('newsEyebrow')} title={t('newsTitle')} />
            <BrandButton href="/news" outline>{common('viewAll')}</BrandButton>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post) => (
              <NewsCard key={post.id ?? post.slug} post={post} readMore={common('readMore')} locale={locale} />
            ))}
          </div>
        </div>
      </section> : null}

      <section className="section-pad">
        <div className="container-shell">
          <div className="relative overflow-hidden border border-accent/40 bg-[linear-gradient(120deg,#10243F,#0B1E36)] p-8 shadow-blue sm:p-12 lg:p-16">
            <VisualEditButton page="home" section="cta" contentKey="ctaTitle" />
            <VisualEditButton page="home" section="cta" contentKey="ctaText" offset={1} />
            <VisualEditButton page="home" section="cta" contentKey="ctaButton" offset={2} />
            <div className="absolute right-0 top-0 h-full w-1/2 bg-hero-grid bg-[size:44px_44px] opacity-40" />
            <div className="relative max-w-3xl">
              <CheckCircle2 className="h-9 w-9 text-blue-400" />
              <h2 className="mt-6 font-display text-3xl font-semibold text-white sm:text-5xl">{t('ctaTitle')}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-mist">{t('ctaText')}</p>
              <div className="mt-8"><BrandButton href="/contact">{t('ctaButton')}</BrandButton></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
