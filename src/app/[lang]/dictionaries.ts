import 'server-only';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  fr: () => import('@/dictionaries/fr.json').then((m) => m.default),
  nl: () => import('@/dictionaries/nl.json').then((m) => m.default),
  es: () => import('@/dictionaries/es.json').then((m) => m.default),
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const LOCALES: Locale[] = ['en', 'fr', 'nl', 'es', 'zh'];

export const DEFAULT_LOCALE: Locale = 'en';

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dict = Awaited<ReturnType<typeof getDictionary>>;
