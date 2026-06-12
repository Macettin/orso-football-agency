'use client';

import {useState} from 'react';
import {ChevronDown, Menu, X} from 'lucide-react';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname, useRouter} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';

const navItems = [
  ['home', '/'],
  ['about', '/about'],
  ['players', '/players'],
  ['coaches', '/coaches'],
  ['talents', '/young-talents'],
  ['transfers', '/transfers'],
  ['news', '/news'],
  ['services', '/services'],
  ['contact', '/contact']
] as const;

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
  ar: 'AR'
};

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function changeLocale(nextLocale: Locale) {
    router.replace(pathname, {locale: nextLocale});
    setOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071426]/78 shadow-[0_8px_30px_rgba(7,20,38,.16)] backdrop-blur-md">
      <div className="container-shell flex h-24 items-center justify-between gap-5">
        <Link
          href="/"
          className="logo-plate h-[82px] w-[82px] shrink-0 rounded-xl transition hover:border-blue-400/30"
          aria-label="Orso Football Agency"
        >
          <Image
            src="/images/orso-logo.png"
            alt="Orso Football Agency"
            width={76}
            height={76}
            priority
            className="relative z-10 h-[72px] w-[72px] object-contain drop-shadow-[0_2px_5px_rgba(255,255,255,.1)]"
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex">
          {navItems.map(([key, href]) => (
            <Link
              key={key}
              href={href}
              className="text-xs font-semibold uppercase tracking-[0.09em] text-slate-300 transition hover:text-blue-300"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <label className="relative hidden sm:block">
            <span className="sr-only">Language</span>
            <select
              value={locale}
              onChange={(event) => changeLocale(event.target.value as Locale)}
              className="h-10 appearance-none rounded-sm border border-slate-700/80 bg-panel py-0 ps-3 pe-9 text-xs font-bold tracking-wider text-white outline-none transition hover:border-accent focus:border-accent"
            >
              {routing.locales.map((item) => (
                <option key={item} value={item} className="bg-navy">
                  {localeLabels[item]}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-3 h-4 w-4 text-blue-400" />
          </label>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-slate-700/80 bg-panel text-white xl:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-navy px-5 py-6 xl:hidden">
          <nav className="container-shell grid gap-1 !px-0 sm:grid-cols-2">
            {navItems.map(([key, href]) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-blue-900/30 px-3 py-3 text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-blue-300"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className="container-shell mt-5 flex gap-2 !px-0 sm:hidden">
            {routing.locales.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLocale(item)}
                className={`h-10 flex-1 border text-xs font-bold ${
                  item === locale ? 'border-accent bg-brand text-white' : 'border-slate-700/80 text-white'
                }`}
              >
                {localeLabels[item]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
