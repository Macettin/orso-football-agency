import type {Metadata} from 'next';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Footer} from '@/components/footer';
import {Header} from '@/components/header';
import {routing} from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Orso Football Agency',
    template: '%s | Orso Football Agency'
  },
  description:
    'FIFA licensed international football agency for player representation, transfers, recruitment and career development.',
  metadataBase: new URL('https://orsofootball.com'),
  openGraph: {
    title: 'Orso Football Agency',
    description: 'International football representation with a personal standard.',
    type: 'website'
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} className={direction === 'rtl' ? 'rtl' : ''}>
      <body className="min-h-screen bg-ink font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
