import {getTranslations, setRequestLocale} from 'next-intl/server';
import {NewsCard} from '@/components/news-card';
import {PageHero} from '@/components/ui';
import type {Locale} from '@/i18n/routing';
import {getPublishedNews} from '@/lib/news';

export const dynamic = 'force-dynamic';

export default async function NewsPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const common = await getTranslations('common');
  const posts = await getPublishedNews(locale);

  return (
    <>
      <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
      <section className="section-pad">
        <div className="container-shell grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.length ? posts.map((post) => <NewsCard key={post.id ?? post.slug} post={post} readMore={common('readMore')} locale={locale} />) : (
            <p className="border border-line bg-panel p-8 text-mist md:col-span-2 lg:col-span-3">{t('empty')}</p>
          )}
        </div>
      </section>
    </>
  );
}
