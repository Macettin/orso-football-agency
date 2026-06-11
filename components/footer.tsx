import Image from 'next/image';
import {Mail, MapPin, ShieldCheck} from 'lucide-react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {markets} from '@/lib/data';
import {VisualEditButton} from '@/components/admin/visual-edit-button';

export async function Footer() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const common = await getTranslations('common');

  return (
    <footer className="border-t border-line bg-[#010613]">
      <div className="container-shell grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <div className="logo-plate h-28 w-28 rounded-2xl">
            <Image
              src="/images/orso-logo.png"
              alt="Orso Football Agency"
              width={104}
              height={104}
              className="relative z-10 h-[102px] w-[102px] object-contain drop-shadow-[0_2px_6px_rgba(255,255,255,.1)]"
            />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-7 text-mist">{t('tagline')}</p>
          <VisualEditButton page="footer" section="footer" contentKey="tagline" />
        </div>
        <div className="relative">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">{t('navigation')}</h3>
          <VisualEditButton page="footer" section="footer" contentKey="navigation" />
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-mist">
            <Link href="/about" className="hover:text-blue-300">{nav('about')}</Link>
            <Link href="/players" className="hover:text-blue-300">{nav('players')}</Link>
            <Link href="/transfers" className="hover:text-blue-300">{nav('transfers')}</Link>
            <Link href="/services" className="hover:text-blue-300">{nav('services')}</Link>
            <Link href="/news" className="hover:text-blue-300">{nav('news')}</Link>
            <Link href="/contact" className="hover:text-blue-300">{nav('contact')}</Link>
          </div>
        </div>
        <div className="relative">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">{t('markets')}</h3>
          <VisualEditButton page="footer" section="footer" contentKey="markets" />
          <div className="mt-5 flex flex-wrap gap-2">
            {markets.map((market) => (
              <span key={market} className="border border-line bg-blue-950/20 px-2.5 py-1 text-xs text-mist">
                {market}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white">{t('contact')}</h3>
          <VisualEditButton page="footer" section="footer" contentKey="contact" />
          <div className="mt-5 space-y-3 text-sm text-mist">
            <p className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-blue-400" /> {common('licensed')}
            </p>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-blue-400" /> {common('based')}
            </p>
            <a href="mailto:info@orsofootball.com" className="flex items-center gap-3 hover:text-blue-300">
              <Mail className="h-4 w-4 text-blue-400" /> info@orsofootball.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-shell flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Orso Football Agency. {common('allRights')}</span>
          <span>FIFA License 202305-1527</span>
        </div>
      </div>
    </footer>
  );
}
