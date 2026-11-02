import type { Core } from '@strapi/strapi';

export const DEFAULT_LOCALE = 'fr';

const LOCALES = [
  { code: 'fr', name: 'French (fr)' },
  { code: 'en', name: 'English (en)' },
];

export const syncLocales = async (strapi: Core.Strapi) => {
  const locales = strapi.plugin('i18n').service('locales');
  for (const locale of LOCALES) {
    if (!(await locales.findByCode(locale.code))) {
      await locales.create(locale);
    }
  }
  await locales.setDefaultLocale({ code: DEFAULT_LOCALE });
};
