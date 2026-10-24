import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::category.category', () => ({
  async find(params: { sort?: unknown } = {}) {
    return super.find({
      ...params,
      sort: params.sort ?? 'position:asc',
      fields: ['name', 'slug', 'description', 'icon', 'color', 'position'],
      populate: { discussions: { count: true } },
    });
  },
}));
