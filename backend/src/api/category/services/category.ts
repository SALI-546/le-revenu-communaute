import { factories } from '@strapi/strapi';
import { DEFAULT_LOCALE } from '../../../bootstrap/locales';

const UID = 'api::category.category';

type Counted = { documentId: string; discussions?: { count: number } };

export default factories.createCoreService(UID, ({ strapi }) => ({
  async find(params: { sort?: unknown; locale?: unknown } = {}) {
    const { results, pagination } = await super.find({
      ...params,
      sort: params.sort ?? 'position:asc',
      fields: ['name', 'slug', 'description', 'icon', 'color', 'position'],
      populate: { discussions: { count: true } },
    });
    if (params.locale === undefined || params.locale === DEFAULT_LOCALE) {
      return { results, pagination };
    }
    // Discussions are linked to the default locale version of each category.
    const counted = await strapi.documents(UID).findMany({
      filters: {
        documentId: { $in: results.map((c: Counted) => c.documentId) },
      },
      fields: ['id'],
      populate: { discussions: { count: true } },
    });
    const counts = new Map(
      counted.map((c) => [
        c.documentId,
        (c as Counted).discussions?.count ?? 0,
      ]),
    );
    return {
      results: results.map((c: Counted) => ({
        ...c,
        discussions: { count: counts.get(c.documentId) ?? 0 },
      })),
      pagination,
    };
  },
}));
