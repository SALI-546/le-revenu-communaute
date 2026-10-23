import type { Core } from '@strapi/strapi';

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/discussions/slug/:slug',
      handler: 'api::discussion.discussion.findBySlug',
    },
  ],
};

export default config;
