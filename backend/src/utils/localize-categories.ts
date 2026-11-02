import type { Core } from '@strapi/strapi';
import { DEFAULT_LOCALE } from '../bootstrap/locales';

type Localizable = {
  category?: { documentId: string; name?: string | null } | null;
};

// Discussions are not localized, so their category relation always points to the default locale.
export const localizeCategories = async <T extends Localizable>(
  strapi: Core.Strapi,
  items: T[],
  locale: unknown,
): Promise<T[]> => {
  if (typeof locale !== 'string' || locale === DEFAULT_LOCALE) {
    return items;
  }
  const ids = [
    ...new Set(items.flatMap(({ category }) => category?.documentId ?? [])),
  ];
  if (ids.length === 0) {
    return items;
  }
  const translations = await strapi
    .documents('api::category.category')
    .findMany({
      locale,
      filters: { documentId: { $in: ids } },
      fields: ['name'],
    });
  const names = new Map(translations.map((c) => [c.documentId, c.name]));
  return items.map((item) => {
    const name = item.category && names.get(item.category.documentId);
    return name
      ? ({ ...item, category: { ...item.category, name } } as T)
      : item;
  });
};
