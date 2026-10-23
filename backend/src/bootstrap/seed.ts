import type { Core } from '@strapi/strapi';
import { DEMO_CATEGORIES, DEMO_DISCUSSIONS, DEMO_USERS } from './demo-data';

const seedCategories = async (strapi: Core.Strapi) => {
  const categories = strapi.documents('api::category.category');
  const idsBySlug = new Map<string, string>();
  for (const data of DEMO_CATEGORIES) {
    const existing = await categories.findFirst({
      filters: { slug: data.slug },
    });
    const category = existing ?? (await categories.create({ data }));
    idsBySlug.set(data.slug, category.documentId);
  }
  return idsBySlug;
};

const seedUsers = async (strapi: Core.Strapi, password: string) => {
  const users = strapi.documents('plugin::users-permissions.user');
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });
  const idsByName = new Map<string, string>();
  for (const { username, email } of DEMO_USERS) {
    const existing = await users.findFirst({ filters: { email } });
    const user =
      existing ??
      (await users.create({
        data: {
          username,
          email,
          password,
          provider: 'local',
          confirmed: true,
          role: role.id,
        },
      }));
    idsByName.set(username, user.documentId);
  }
  return idsByName;
};

const seedDiscussions = async (
  strapi: Core.Strapi,
  categoryIds: Map<string, string>,
  userIds: Map<string, string>,
) => {
  const discussions = strapi.documents('api::discussion.discussion');
  const replies = strapi.documents('api::reply.reply');
  for (const {
    replies: demoReplies,
    category,
    author,
    ...data
  } of DEMO_DISCUSSIONS) {
    const existing = await discussions.findFirst({
      filters: { slug: data.slug },
    });
    if (existing) {
      continue;
    }
    const discussion = await discussions.create({
      data: {
        ...data,
        category: categoryIds.get(category),
        author: userIds.get(author),
      },
    });
    for (const reply of demoReplies) {
      await replies.create({
        data: {
          content: reply.content,
          discussion: discussion.documentId,
          author: userIds.get(reply.author),
        },
      });
    }
  }
};

export const seedDemoData = async (strapi: Core.Strapi, password: string) => {
  const categoryIds = await seedCategories(strapi);
  const userIds = await seedUsers(strapi, password);
  await seedDiscussions(strapi, categoryIds, userIds);
};
