import { notFound } from 'next/navigation';
import { lang } from 'next/root-params';
import { hasLocale, type Locale } from './config';
import type fr from './fr.json';

export type Dictionary = typeof fr;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import('./fr.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default),
};

export const getLocale = async (): Promise<Locale> => {
  const locale = await lang();
  if (!hasLocale(locale)) {
    notFound();
  }
  return locale;
};

export const getDictionary = async (): Promise<Dictionary> =>
  dictionaries[await getLocale()]();
