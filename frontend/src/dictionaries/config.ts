export const locales = ['fr', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const hasLocale = (locale: string): locale is Locale =>
  locales.some((supported) => supported === locale);

export const localizedHref = (locale: Locale, path = '') => `/${locale}${path}`;
