import type { Core } from '@strapi/strapi';

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/members/:username',
      handler: 'api::member.member.findOne',
    },
  ],
};

export default config;
