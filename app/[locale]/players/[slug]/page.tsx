import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Star
} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {BrandButton, InitialsPortrait} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {players} from '@/lib/data';
import {getPublicPlayer} from '@/lib/players';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return players.map((player) => ({slug: player.slug}));
}

export default async function PlayerPage({
  params
}: {
  params: Promise<{locale: Locale; slug: string}>;
}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const player = await getPublicPlayer(slug, locale);
  if (!player) notFound();

  const t = await getTranslations('playerDetail');
  const labels = await getTranslations('players');
  const common = await getTranslations('common');
  const empty = '—';

  const details = [
    [labels('position'), player.position[locale] || empty],
    [labels('nationality'), player.nationality[locale] || empty],
    [labels('age'), player.age ? `${player.age} ${common('years')}` : empty],
    [labels('club'), player.club || empty],
    [labels('height'), player.height || empty],
    [labels('foot'), player.foot[locale] || empty],
    [labels('contract'), player.contract[locale] || empty]
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-[#071426] pt-32 sm:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(11,75,211,0.20),transparent_35%)]" />
        <div className="container-shell relative z-10 pb-8">
          <Link
            href="/players"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-mist transition hover:text-blue-300"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {common('backToPlayers')}
          </Link>
        </div>
        <div className="container-shell relative z-10 grid items-end gap-10 lg:grid-cols-[.82fr_1.18fr]">
          <div className="relative overflow-hidden border border-line bg-panel shadow-blue">
            {player.photoUrl ? (
              <div
                className="aspect-[4/5] min-h-[480px] bg-slate-900 bg-cover bg-center"
                style={{backgroundImage: `url("${player.photoUrl}")`}}
                role="img"
                aria-label={player.name}
              />
            ) : (
              <div className="aspect-[4/5] min-h-[480px]">
                <InitialsPortrait initials={player.initials} tone={player.tone} compact />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#071426] to-transparent" />
          </div>
          <div className="pb-12 lg:pb-20">
            <div className="eyebrow">{t('profile')}</div>
            <h1 className="font-display text-5xl font-semibold tracking-[-0.04em] text-white sm:text-7xl">
              {player.name}
            </h1>
            <div className="mt-4 text-lg font-semibold text-blue-300">
              {player.position[locale] || empty} <span className="text-slate-600">·</span>{' '}
              {player.club || empty}
            </div>
            {player.shortBio ? (
              <p className="mt-7 max-w-2xl text-lg leading-8 text-mist">{player.shortBio}</p>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BrandButton href="/contact">{t('careerPlan')}</BrandButton>
              {player.transfermarktUrl ? (
                <BrandButton href={player.transfermarktUrl} external outline>
                  {common('transfermarkt')}
                </BrandButton>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">{t('overview')}</h2>
            <div className="mt-7 divide-y divide-line border-y border-line">
              {details.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-4">
                  <span className="text-sm text-mist">{label}</span>
                  <span className="text-end text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-white">{t('strengths')}</h2>
            {player.localizedStrengths.length ? (
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {player.localizedStrengths.map((strength) => (
                  <div key={strength} className="glass-card flex items-center gap-4 p-5">
                    <Star className="h-5 w-5 shrink-0 text-blue-400" />
                    <span className="font-semibold text-white">{strength}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-7 border border-dashed border-line p-6 text-mist">
                {t('noStrengths')}
              </p>
            )}
            {player.careerSummary ? (
              <div className="mt-8 border-s-2 border-accent bg-panel p-6">
                <div className="flex items-center gap-3 text-blue-300">
                  <ShieldCheck className="h-5 w-5" />
                  <h3 className="font-display text-xl font-semibold">{t('careerSummary')}</h3>
                </div>
                <p className="mt-4 leading-7 text-mist">{player.careerSummary}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-pad border-y border-line bg-navy/60">
        <div className="container-shell">
          <h2 className="font-display text-3xl font-semibold text-white">{t('career')}</h2>
          {player.careerEntries.length ? (
            <div className="mt-8 overflow-x-auto border border-line bg-panel">
              <table className="w-full min-w-[760px] text-start">
                <thead className="border-b border-line bg-blue-950/40 text-xs uppercase tracking-wider text-blue-300">
                  <tr>
                    <th className="px-5 py-4 text-start">{t('season')}</th>
                    <th className="px-5 py-4 text-start">{labels('club')}</th>
                    <th className="px-5 py-4 text-start">{t('country')}</th>
                    <th className="px-5 py-4 text-center">{t('appearances')}</th>
                    <th className="px-5 py-4 text-center">{t('goals')}</th>
                    <th className="px-5 py-4 text-center">{t('assists')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {player.careerEntries.map((entry, index) => (
                    <tr key={entry.id ?? `${entry.season}-${entry.club}-${index}`}>
                      <td className="px-5 py-5 font-bold text-blue-300">{entry.season}</td>
                      <td className="px-5 py-5 font-display text-lg font-semibold text-white">{entry.club}</td>
                      <td className="px-5 py-5 text-mist">{entry.country || empty}</td>
                      <td className="px-5 py-5 text-center text-white">{entry.appearances ?? empty}</td>
                      <td className="px-5 py-5 text-center text-white">{entry.goals ?? empty}</td>
                      <td className="px-5 py-5 text-center text-white">{entry.assists ?? empty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-8 border border-dashed border-line p-8 text-mist">
              {t('noCareerHistory')}
            </p>
          )}
        </div>
      </section>

      {player.videos.length ? (
        <section className="section-pad">
          <div className="container-shell">
            <div className="max-w-3xl">
              <div className="eyebrow">{t('profile')}</div>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {t('media')}
              </h2>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {player.videos.map((video) => (
                <article
                  key={video.id}
                  className="overflow-hidden border border-line bg-panel shadow-blue-soft"
                >
                  <h3 className="border-b border-line px-5 py-4 font-display text-xl font-semibold text-white">
                    {video.title}
                  </h3>
                  <div className="aspect-video bg-[#071426]">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      loading="lazy"
                      className="h-full w-full border-0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`section-pad ${player.videos.length ? 'border-t border-line bg-navy/40' : ''}`}>
        <div className="container-shell">
          <div className="glass-card flex flex-col justify-between p-8 sm:p-10">
            <div>
              <div className="flex items-center gap-3 text-blue-400">
                <Download className="h-6 w-6" />
                <span className="font-bold uppercase tracking-wider">{t('documents')}</span>
              </div>
              <p className="mt-5 text-base leading-8 text-mist">{t('documentsText')}</p>
            </div>
            <div className="mt-8">
              <BrandButton href="/contact" outline>{t('requestDocuments')}</BrandButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
