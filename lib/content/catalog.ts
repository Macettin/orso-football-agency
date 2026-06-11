import type {Locale} from '@/i18n/routing';
import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import ru from '@/messages/ru.json';
import tr from '@/messages/tr.json';

type Messages = Record<string, Record<string, unknown>>;

const fallbackMessages: Record<Locale, Messages> = {en, tr, ru, ar};

export type ContentEntry = {
  page: string;
  section: string;
  contentKey: string;
  fallback: string;
};

const pageLabels: Record<string, string> = {
  nav: 'Navigation',
  common: 'Common labels',
  home: 'Home',
  about: 'About',
  players: 'Players',
  playerDetail: 'Player detail',
  coaches: 'Coaches',
  talents: 'Young talents',
  transfers: 'Transfers',
  news: 'News',
  services: 'Services',
  contact: 'Contact',
  footer: 'Footer'
};

function getSection(page: string, key: string) {
  if (page === 'nav' || page === 'common' || page === 'footer') {
    return page;
  }

  if (['eyebrow', 'title', 'titleAccent', 'intro', 'description', 'primaryCta', 'secondaryCta', 'license'].includes(key)) {
    return 'hero';
  }

  const prefixes = [
    'about',
    'players',
    'partners',
    'transfers',
    'services',
    'stats',
    'testimonials',
    'testimonial',
    'cta',
    'story',
    'owner',
    'markets',
    'values',
    'value',
    'path',
    'step',
    'guardian',
    'portfolio',
    'season',
    'clubs',
    'representation',
    'scouting',
    'career',
    'legal',
    'relocation',
    'documents',
    'request',
    'media',
    'profile',
    'overview',
    'strengths',
    'company',
    'whatsapp',
    'email'
  ];

  return prefixes.find((prefix) => key.startsWith(prefix)) ?? 'general';
}

function flatten(
  page: string,
  value: Record<string, unknown>,
  prefix = ''
): ContentEntry[] {
  return Object.entries(value).flatMap(([key, item]) => {
    const contentKey = prefix ? `${prefix}.${key}` : key;

    if (typeof item === 'string') {
      return [{
        page,
        section: getSection(page, contentKey),
        contentKey,
        fallback: item
      }];
    }

    if (item && typeof item === 'object') {
      return flatten(page, item as Record<string, unknown>, contentKey);
    }

    return [];
  });
}

export function getContentCatalog(locale: Locale) {
  return Object.entries(fallbackMessages[locale]).flatMap(([page, value]) =>
    flatten(page, value)
  );
}

export function getPageOptions() {
  return Object.keys(fallbackMessages.en).map((value) => ({
    value,
    label: pageLabels[value] ?? value
  }));
}

export function getSectionOptions(page: string, locale: Locale) {
  return Array.from(
    new Set(
      getContentCatalog(locale)
        .filter((entry) => entry.page === page)
        .map((entry) => entry.section)
    )
  );
}

export function getContentEntries(page: string, section: string, locale: Locale) {
  return getContentCatalog(locale).filter(
    (entry) => entry.page === page && entry.section === section
  );
}

export function getContentKeyOptions(page: string, section: string) {
  return getContentEntries(page, section, 'en').map((entry) => ({
    value: entry.contentKey,
    label: entry.contentKey
  }));
}

export function getContentEntry(
  page: string,
  section: string,
  contentKey: string,
  locale: Locale
) {
  return getContentEntries(page, section, locale).find(
    (entry) => entry.contentKey === contentKey
  );
}

export function isValidContentSelection(
  page: string,
  section: string,
  contentKey: string
) {
  return Boolean(getContentEntry(page, section, contentKey, 'en'));
}

export function getFallbackMessages(locale: Locale) {
  return structuredClone(fallbackMessages[locale]);
}
