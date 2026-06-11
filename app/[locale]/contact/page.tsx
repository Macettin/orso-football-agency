import {BadgeCheck, Mail, MapPin, MessageCircle} from 'lucide-react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ContactForm} from '@/components/contact-form';
import {VisualEditButton} from '@/components/admin/visual-edit-button';
import {BrandButton, PageHero} from '@/components/ui';
import type {Locale} from '@/i18n/routing';

export default async function ContactPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const common = await getTranslations('common');

  return (
    <>
      <div className="relative">
        <PageHero eyebrow={t('eyebrow')} title={t('title')} intro={t('intro')} />
        <VisualEditButton page="contact" section="hero" contentKey="title" />
        <VisualEditButton page="contact" section="hero" contentKey="intro" offset={1} />
      </div>
      <section className="section-pad">
        <div className="container-shell grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-12">
          <aside className="space-y-6">
            <div className="relative border border-accent/40 bg-accent/[0.08] p-6 shadow-blue-soft">
              <MessageCircle className="h-8 w-8 text-blue-400" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-white">{t('whatsapp')}</h2>
              <p className="mt-3 text-sm leading-7 text-mist">{t('directText')}</p>
              <div className="mt-6">
                <BrandButton href="https://wa.me/905000000000" external>WhatsApp</BrandButton>
              </div>
              <VisualEditButton page="contact" section="general" contentKey="directText" />
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-400" /><span className="text-xs font-bold uppercase tracking-wider text-white">{t('emailUs')}</span></div>
              <a href="mailto:info@orsofootball.com" className="mt-4 block text-sm text-mist hover:text-blue-300">info@orsofootball.com</a>
            </div>
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl font-semibold text-white">{t('company')}</h2>
              <div className="mt-6 space-y-5 text-sm">
                <Info icon={BadgeCheck} label={t('owner')} value={`Eren YILDIRIM · ${common('licensed')}`} />
                <Info icon={BadgeCheck} label={t('license')} value="202305-1527" />
                <Info icon={MapPin} label={t('location')} value="Türkiye" />
              </div>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

function Info({
  icon: Icon,
  label,
  value
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}
