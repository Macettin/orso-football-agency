import Image from 'next/image';
import {ArrowUpRight, Calendar} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import type {NewsPost} from '@/lib/news';

export function NewsCard({post, readMore, locale}: {post: NewsPost; readMore: string; locale: Locale}) {
  return (
    <article className="group overflow-hidden border border-line bg-panel transition hover:border-accent/60 hover:shadow-blue-soft">
      <div className="relative aspect-[16/10] bg-[#0B1E36]">
        {post.image_url ? (
          <Image src={post.image_url} alt={post.title} fill sizes="(max-width: 1024px) 100vw, 380px" className="object-cover" />
        ) : (
          <div className="h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,.30),transparent_45%),linear-gradient(135deg,#10243F,#071426)]" />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-mist">
          <Calendar className="h-4 w-4 text-blue-400" />
          {new Intl.DateTimeFormat(locale, {dateStyle: 'medium'}).format(new Date(post.published_at))}
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-white">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-mist">{post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          {readMore} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
