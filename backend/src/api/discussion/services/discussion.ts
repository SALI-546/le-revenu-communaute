import { randomBytes } from 'node:crypto';
import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const UID = 'api::discussion.discussion';
const SORTS = ['publishedAt:desc', 'publishedAt:asc'];
const TYPES = ['question', 'discussion'] as const;
const authorFields = { fields: ['username' as const] };
const categoryFields = {
  fields: ['name' as const, 'slug' as const, 'icon' as const, 'color' as const],
};

type DiscussionType = (typeof TYPES)[number];

type Author = { username: string } | null;

export type RawDiscussion = {
  author?: Author;
  replies?: { author?: Author }[] | { count: number };
};

export type CommunityStats = {
  discussions: number;
  replies: number;
  questions: number;
  answeredQuestions: number;
  unanswered: number;
};

export type DiscussionService = {
  stats(category?: string): Promise<CommunityStats>;
  find(
    params: object,
  ): Promise<{ results: RawDiscussion[]; pagination: object }>;
  findBySlug(slug: string): Promise<RawDiscussion>;
  createForAuthor(
    input: unknown,
    authorDocumentId: string,
  ): Promise<RawDiscussion>;
};

const isDiscussionType = (value: unknown): value is DiscussionType =>
  TYPES.some((type) => type === value);

const readText = (value: unknown, field: string, min: number, max: number) => {
  const text = typeof value === 'string' ? value.trim() : '';
  if (text.length < min || text.length > max) {
    throw new errors.ValidationError(
      `${field} must contain between ${min} and ${max} characters`,
    );
  }
  return text;
};

const readInput = (input: unknown) => {
  const { title, content, type, category } = (input ?? {}) as Record<
    string,
    unknown
  >;
  if (!isDiscussionType(type)) {
    throw new errors.ValidationError(`type must be one of ${TYPES.join(', ')}`);
  }
  if (typeof category !== 'string') {
    throw new errors.ValidationError('category must be a category documentId');
  }
  return {
    title: readText(title, 'title', 10, 150),
    content: readText(content, 'content', 1, 10000),
    type,
    category,
  };
};

const toSlug = (title: string) => {
  const base = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return `${base}-${randomBytes(3).toString('hex')}`;
};

export default factories.createCoreService(UID, ({ strapi }) => {
  const assertCategoryExists = async (documentId: string) => {
    const category = await strapi
      .documents('api::category.category')
      .findOne({ documentId, fields: ['id'] });
    if (!category) {
      throw new errors.ValidationError('category does not exist');
    }
  };

  return {
    async stats(category?: string): Promise<CommunityStats> {
      const discussions = strapi.documents(UID);
      const inSpace = category ? { category: { slug: category } } : {};
      const withoutReply = { replies: { id: { $null: true } } };
      const [total, questions, unanswered, unansweredQuestions, replies] =
        await Promise.all([
          discussions.count({ filters: inSpace }),
          discussions.count({ filters: { ...inSpace, type: 'question' } }),
          discussions.count({ filters: { ...inSpace, ...withoutReply } }),
          discussions.count({
            filters: { ...inSpace, ...withoutReply, type: 'question' },
          }),
          strapi
            .documents('api::reply.reply')
            .count({ filters: category ? { discussion: inSpace } : {} }),
        ]);
      return {
        discussions: total,
        replies,
        questions,
        answeredQuestions: questions - unansweredQuestions,
        unanswered,
      };
    },

    async find(params: { sort?: unknown } = {}) {
      const sort = params.sort ?? SORTS[0];
      if (typeof sort !== 'string' || !SORTS.includes(sort)) {
        throw new errors.ValidationError(
          `sort must be one of ${SORTS.join(', ')}`,
        );
      }
      return super.find({
        ...params,
        sort,
        fields: ['title', 'slug', 'type', 'content', 'publishedAt'],
        populate: {
          author: authorFields,
          category: categoryFields,
          replies: { count: true },
        },
      });
    },

    async findBySlug(slug: string) {
      const discussion = await strapi.documents(UID).findFirst({
        filters: { slug },
        fields: ['title', 'slug', 'type', 'content', 'publishedAt'],
        populate: {
          author: authorFields,
          category: categoryFields,
          replies: {
            fields: ['content', 'publishedAt'],
            sort: 'publishedAt:asc',
            populate: { author: authorFields },
          },
        },
      });
      if (!discussion) {
        throw new errors.NotFoundError('Discussion not found');
      }
      return discussion;
    },

    async createForAuthor(input: unknown, authorDocumentId: string) {
      const data = readInput(input);
      await assertCategoryExists(data.category);
      return strapi.documents(UID).create({
        data: { ...data, slug: toSlug(data.title), author: authorDocumentId },
        populate: { author: authorFields, category: categoryFields },
      });
    },

    async update(documentId: string, params: { data?: unknown }) {
      const data = readInput(params.data);
      await assertCategoryExists(data.category);
      return super.update(documentId, { ...params, data });
    },

    async delete(documentId: string, params: object = {}) {
      const replies = strapi.documents('api::reply.reply');
      const orphans = await replies.findMany({
        filters: { discussion: { documentId } },
        fields: ['documentId'],
      });
      await Promise.all(
        orphans.map((reply) =>
          replies.delete({ documentId: reply.documentId }),
        ),
      );
      return super.delete(documentId, params);
    },
  };
});
