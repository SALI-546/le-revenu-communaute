import { localizedHref, type Locale } from '@/dictionaries/config';

export const memberHref = (locale: Locale, username: string) =>
  localizedHref(locale, `/members/${encodeURIComponent(username)}`);
