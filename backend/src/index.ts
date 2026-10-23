import type { Core } from '@strapi/strapi';
import { syncRolePermissions } from './bootstrap/permissions';
import { seedDemoData } from './bootstrap/seed';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await syncRolePermissions(strapi);

    if (process.env.SEED_DEMO_DATA !== 'true') {
      return;
    }
    const password = process.env.SEED_USER_PASSWORD;
    if (!password) {
      throw new Error(
        'SEED_USER_PASSWORD is required when SEED_DEMO_DATA=true',
      );
    }
    await seedDemoData(strapi, password);
    strapi.log.info('Demo data seeded');
  },
};
