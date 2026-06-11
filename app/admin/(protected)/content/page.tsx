import {Languages, Save} from 'lucide-react';
import {routing, type Locale} from '@/i18n/routing';
import {
  getContentEntry,
  getContentKeyOptions,
  getPageOptions,
  getSectionOptions
} from '@/lib/content/catalog';
import {requireAdmin} from '@/src/lib/supabase/admin';
import {saveContent} from './actions';

type SearchParams = {
  page?: string;
  section?: string;
  contentKey?: string;
  result?: string;
};

const localeDetails: Record<
  Locale,
  {label: string; nativeLabel: string; direction: 'ltr' | 'rtl'}
> = {
  en: {label: 'English', nativeLabel: 'English', direction: 'ltr'},
  tr: {label: 'Turkish', nativeLabel: 'Türkçe', direction: 'ltr'},
  ru: {label: 'Russian', nativeLabel: 'Русский', direction: 'ltr'},
  ar: {label: 'Arabic', nativeLabel: 'العربية', direction: 'rtl'}
};

export default async function AdminContentPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const pages = getPageOptions();
  const page = pages.some((item) => item.value === query.page)
    ? query.page!
    : 'home';
  const sections = getSectionOptions(page, 'en');
  const section = sections.includes(query.section ?? '')
    ? query.section!
    : sections[0];
  const contentKeys = getContentKeyOptions(page, section);
  const contentKey = contentKeys.some((item) => item.value === query.contentKey)
    ? query.contentKey!
    : contentKeys[0]?.value ?? '';

  const {supabase} = await requireAdmin();
  const {data: overrides, error} = await supabase
    .from('site_content')
    .select('locale, value, updated_at')
    .eq('page', page)
    .eq('section', section)
    .eq('content_key', contentKey)
    .in('locale', [...routing.locales]);
  const overrideMap = new Map(
    overrides?.map((item) => [item.locale as Locale, item]) ?? []
  );

  return (
    <>
      <div className="max-w-3xl">
        <div className="eyebrow">Multilingual copy</div>
        <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
          Website content
        </h1>
        <p className="mt-4 text-lg leading-8 text-mist">
          Select one content key and edit its English, Turkish, Russian and Arabic
          versions together.
        </p>
      </div>

      <form
        method="get"
        className="mt-10 grid gap-4 border border-line bg-panel p-5 md:grid-cols-[1fr_1fr_1.2fr_auto] md:items-end"
      >
        <Select label="Page" name="page" value={page} options={pages} />
        <Select
          label="Section"
          name="section"
          value={section}
          options={sections.map((value) => ({
            value,
            label: formatLabel(value)
          }))}
        />
        <Select
          label="Content key"
          name="contentKey"
          value={contentKey}
          options={contentKeys.map((item) => ({
            value: item.value,
            label: formatLabel(item.label)
          }))}
        />
        <button className="h-12 bg-slate-800 px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-700">
          Load
        </button>
      </form>

      {query.result === 'saved' ? (
        <p className="mt-5 border-s-2 border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          All four language versions were saved successfully.
        </p>
      ) : null}
      {query.result && query.result !== 'saved' ? (
        <p className="mt-5 border-s-2 border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Content could not be saved. Check the selected key, Supabase connection
          and admin permissions.
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 border-s-2 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Existing database values could not be loaded.
        </p>
      ) : null}

      <form action={saveContent} className="mt-6 border border-line bg-panel">
        <input type="hidden" name="page" value={page} />
        <input type="hidden" name="section" value={section} />
        <input type="hidden" name="contentKey" value={contentKey} />

        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-3">
              <Languages className="h-6 w-6 text-blue-400" />
              <h2 className="font-display text-2xl font-semibold text-white">
                {formatLabel(contentKey)}
              </h2>
            </div>
            <p className="mt-2 font-mono text-xs text-slate-500">
              {page} / {section} / {contentKey}
            </p>
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-accent"
          >
            <Save className="h-4 w-4" /> Save all languages
          </button>
        </div>

        <div className="grid gap-px bg-line lg:grid-cols-2">
          {routing.locales.map((locale) => {
            const details = localeDetails[locale];
            const fallback = getContentEntry(
              page,
              section,
              contentKey,
              locale
            );
            const override = overrideMap.get(locale);
            const value = override?.value ?? fallback?.fallback ?? '';

            return (
              <label key={locale} className="block bg-panel p-5 sm:p-6">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="font-display text-lg font-semibold text-white">
                      {details.label}
                    </span>
                    <span className="ms-2 text-sm text-slate-500">
                      {details.nativeLabel}
                    </span>
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      override ? 'text-blue-400' : 'text-slate-600'
                    }`}
                  >
                    {override ? 'Database value' : 'JSON fallback'}
                  </span>
                </span>
                <textarea
                  name={`value:${locale}`}
                  defaultValue={value}
                  dir={details.direction}
                  rows={Math.max(
                    4,
                    Math.min(8, Math.ceil(value.length / 70))
                  )}
                  className="mt-4 w-full resize-y border border-line bg-ink/70 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-accent"
                />
                {!override && fallback ? (
                  <span className="mt-2 block text-xs text-slate-600">
                    Loaded from messages/{locale}.json. Saving creates a database
                    value.
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
      </form>
    </>
  );
}

function Select({
  label,
  name,
  value,
  options
}: {
  label: string;
  name: string;
  value: string;
  options: {value: string; label: string}[];
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-12 w-full border border-line bg-ink px-3 text-sm text-white outline-none focus:border-accent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/\./g, ' / ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (letter) => letter.toUpperCase());
}
