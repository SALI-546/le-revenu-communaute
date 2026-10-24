import type { Core } from '@strapi/strapi';

const ownerOnly = [
  'global::is-authenticated',
  { name: 'global::is-owner', config: { uid: 'api::discussion.discussion' } },
];

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/discussions/stats',
      handler: 'api::discussion.discussion.stats',
    },
    {
      method: 'GET',
      path: '/discussions/slug/:slug',
      handler: 'api::discussion.discussion.findBySlug',
    },
    {
      method: 'PUT',
      path: '/discussions/:id/best-reply',
      handler: 'api::discussion.discussion.setBestReply',
      config: { policies: ownerOnly },
    },
  ],
};

export default config;
