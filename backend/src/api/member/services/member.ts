import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { publicAuthor } from '../../../utils/public-author';

const RECENT = 5;

type Author = { username: string } | null;

type RawDiscussion = {
  documentId: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  publishedAt: string;
  author?: Author;
  category?: {
    name: string;
    slug: string;
    icon: string;
    color: string;
  } | null;
  replies?: { count: number };
  bestReply?: { documentId: string } | null;
};

export type MemberService = {
  findByUsername(username: string): Promise<unknown>;
};

const toPublicDiscussion = (discussion: RawDiscussion) => ({
  documentId: discussion.documentId,
  title: discussion.title,
  slug: discussion.slug,
  type: discussion.type,
  content: discussion.content,
  publishedAt: discussion.publishedAt,
  author: publicAuthor(discussion),
  category: discussion.category
    ? {
        name: discussion.category.name,
        slug: discussion.category.slug,
        icon: discussion.category.icon,
        color: discussion.category.color,
      }
    : null,
  replies: { count: discussion.replies?.count ?? 0 },
  bestReply: discussion.bestReply
    ? { documentId: discussion.bestReply.documentId }
    : null,
});

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async findByUsername(username: string) {
    const user = await strapi
      .documents('plugin::users-permissions.user')
      .findFirst({ filters: { username }, fields: ['username', 'createdAt'] });
    const byMember = { author: { id: user?.id } };
    const discussions = strapi.documents('api::discussion.discussion');
    const replies = strapi.documents('api::reply.reply');
    const [discussionCount, replyCount] = user
      ? await Promise.all([
          discussions.count({ filters: byMember }),
          replies.count({ filters: byMember }),
        ])
      : [0, 0];
    // Members without public activity stay hidden, so the route cannot list accounts.
    if (!user || discussionCount + replyCount === 0) {
      throw new errors.NotFoundError('Member not found');
    }

    const [bestAnswers, helpful, recent, latest] = await Promise.all([
      discussions.count({ filters: { bestReply: byMember } }),
      strapi
        .documents('api::vote.vote')
        .count({ filters: { reply: byMember } }),
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
        helpful,
        bestAnswers,
      },
      discussions: (recent.results as RawDiscussion[]).map(toPublicDiscussion),
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
