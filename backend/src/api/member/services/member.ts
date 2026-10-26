import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const RECENT = 5;

type Author = { username: string } | null | undefined;

const publicAuthor = (author: Author) =>
  author ? { username: author.username } : null;

export type MemberService = {
  findByUsername(username: string): Promise<unknown>;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async findByUsername(username: string) {
    const user = await strapi
      .documents('plugin::users-permissions.user')
      .findFirst({
        filters: { username, blocked: false },
        fields: ['username', 'createdAt'],
      });
    if (!user) {
      throw new errors.NotFoundError('Member not found');
    }
    const byMember = { author: { id: user.id } };
    const discussions = strapi.documents('api::discussion.discussion');
    const replies = strapi.documents('api::reply.reply');

    const [discussionCount, replyCount, bestAnswers, helpful, recent, latest] =
      await Promise.all([
        discussions.count({ filters: byMember }),
        replies.count({ filters: byMember }),
        discussions.count({ filters: { bestReply: byMember } }),
        replies.findMany({ filters: byMember, fields: ['helpfulCount'] }),
        strapi.service('api::discussion.discussion').find({
          filters: byMember,
          pagination: { page: 1, pageSize: RECENT },
        }),
        replies.findMany({
          filters: byMember,
          fields: ['content', 'publishedAt', 'helpfulCount'],
          populate: { discussion: { fields: ['title', 'slug'] } },
          sort: 'publishedAt:desc',
          limit: RECENT,
        }),
      ]);

    return {
      username: user.username,
      memberSince: user.createdAt,
      stats: {
        discussions: discussionCount,
        replies: replyCount,
        helpful: helpful.reduce(
          (sum, reply) => sum + (reply.helpfulCount ?? 0),
          0,
        ),
        bestAnswers,
      },
      discussions: recent.results.map((discussion: { author?: Author }) => ({
        ...discussion,
        author: publicAuthor(discussion.author),
      })),
      replies: latest.map(
        ({ documentId, content, publishedAt, helpfulCount, discussion }) => ({
          documentId,
          content,
          publishedAt,
          helpfulCount,
          discussion: discussion
            ? { title: discussion.title, slug: discussion.slug }
            : null,
        }),
      ),
    };
  },
});
