import type {ReactNode} from 'react';
import {ArrowRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = 'left'
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <div className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {text ? <p className="mt-5 text-base leading-8 text-mist sm:text-lg">{text}</p> : null}
    </div>
  );
}

export function BrandButton({
  href,
  children,
  outline = false,
  external = false
}: {
  href: string;
  children: ReactNode;
  outline?: boolean;
  external?: boolean;
}) {
  const className = `group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-6 text-sm font-bold uppercase tracking-[0.12em] transition ${
    outline
      ? 'border border-slate-700/80 bg-slate-900/40 text-white hover:border-accent hover:bg-accent/10 hover:text-blue-200'
      : 'bg-brand text-white shadow-blue-soft hover:bg-accent hover:shadow-blue'
  }`;
  const content = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
    </>
  );

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-navy/20 pt-32 sm:pt-40">
      <div className="absolute inset-0 bg-hero-grid bg-[size:60px_60px] opacity-50" />
      <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-accent/15 blur-[120px]" />
      <div className="container-shell relative pb-16 sm:pb-24">
        <div className="max-w-4xl">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-mist sm:text-xl">{intro}</p>
        </div>
      </div>
    </section>
  );
}

export function InitialsPortrait({
  initials,
  tone,
  compact = false
}: {
  initials: string;
  tone: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${tone} ${
        compact ? 'aspect-[4/3]' : 'aspect-[4/5]'
      }`}
    >
      <div className="absolute inset-0 bg-hero-grid bg-[size:32px_32px] opacity-30" />
      <div className="absolute inset-x-8 bottom-0 h-2/3 rounded-t-full border border-blue-800/30 bg-blue-950/20" />
      <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-semibold text-white/80">
        {initials}
      </span>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
}
