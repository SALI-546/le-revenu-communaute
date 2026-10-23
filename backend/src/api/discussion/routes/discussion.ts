import { factories } from '@strapi/strapi';

const ownerOnly = [
  'global::is-authenticated',
  { name: 'global::is-owner', config: { uid: 'api::discussion.discussion' } },
];

export default factories.createCoreRouter('api::discussion.discussion', {
  only: ['find', 'create', 'update', 'delete'],
  config: {
    create: { policies: ['global::is-authenticated'] },
    update: { policies: ownerOnly },
    delete: { policies: ownerOnly },
  },
});
