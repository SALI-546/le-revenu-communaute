import type { Core } from '@strapi/strapi';

const READ_ACTIONS = [
  'api::category.category.find',
  'api::category.category.findOne',
  'api::discussion.discussion.find',
  'api::discussion.discussion.findBySlug',
  'api::discussion.discussion.stats',
  'api::reply.reply.find',
  'api::member.member.findOne',
];

const WRITE_ACTIONS = [
  'api::discussion.discussion.create',
  'api::discussion.discussion.update',
  'api::discussion.discussion.delete',
  'api::discussion.discussion.setBestReply',
  'api::reply.reply.create',
  'api::reply.reply.update',
  'api::reply.reply.delete',
  'api::reply.reply.toggleHelpful',
  'api::reply.reply.findHelpfulVotes',
];

const PERMISSIONS_BY_ROLE = {
  public: READ_ACTIONS,
  authenticated: [...READ_ACTIONS, ...WRITE_ACTIONS],
};

export const syncRolePermissions = async (strapi: Core.Strapi) => {
  const roles = strapi.db.query('plugin::users-permissions.role');
  const permissions = strapi.db.query('plugin::users-permissions.permission');

  for (const [type, actions] of Object.entries(PERMISSIONS_BY_ROLE)) {
    const role = await roles.findOne({ where: { type } });
    if (!role) {
      throw new Error(`users-permissions role "${type}" is missing`);
    }
    for (const action of actions) {
      const existing = await permissions.findOne({
        where: { action, role: role.id },
      });
      if (!existing) {
        await permissions.create({ data: { action, role: role.id } });
      }
    }
  }
};
