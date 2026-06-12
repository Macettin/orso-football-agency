import Image from 'next/image';
import {ArrowLeft, Calendar} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import type {Locale} from '@/i18n/routing';
import {Link} from '@/i18n/navigation';
import {getPublishedNewsPost} from '@/lib/news';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({params}: {params: Promise<{locale: Locale; slug: string}>}) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const post = await getPublishedNewsPost(slug, locale);
  if (!post) notFound();
  const nav = await getTranslations('nav');

  return (
    <article className="pb-24 pt-32 sm:pt-40">
      <div className="container-shell max-w-5xl">
        <Link href="/news" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {nav('news')}
        </Link>
        <div className="mt-8 flex items-center gap-2 text-sm text-mist">
          <Calendar className="h-4 w-4 text-blue-400" />
          {new Intl.DateTimeFormat(locale, {dateStyle: 'long'}).format(new Date(post.published_at))}
        </div>
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">{post.title}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">{post.excerpt}</p>
        {post.image_url ? (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden border border-line bg-[#0B1E36]">
            <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" priority />
          </div>
        ) : null}
        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-mist">{post.content}</div>
      </div>
    </article>
  );
}
