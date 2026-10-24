import type { Core } from '@strapi/strapi';

const config: Core.RouterConfig = {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/replies/helpful',
      handler: 'api::reply.reply.findHelpfulVotes',
      config: { policies: ['global::is-authenticated'] },
    },
    {
      method: 'POST',
      path: '/replies/:id/helpful',
      handler: 'api::reply.reply.toggleHelpful',
      config: { policies: ['global::is-authenticated'] },
    },
  ],
};

export default config;
