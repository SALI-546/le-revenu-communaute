import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const UID = 'api::reply.reply';

export type ReplyService = {
  createForAuthor(
    input: unknown,
    authorDocumentId: string,
  ): Promise<{ author?: { username: string } | null }>;
};

const readContent = (input: unknown) => {
  const { content } = (input ?? {}) as Record<string, unknown>;
  const text = typeof content === 'string' ? content.trim() : '';
  if (text.length < 1 || text.length > 5000) {
    throw new errors.ValidationError(
      'content must contain between 1 and 5000 characters',
    );
  }
  return text;
};

export default factories.createCoreService(UID, ({ strapi }) => ({
  async createForAuthor(input: unknown, authorDocumentId: string) {
    const content = readContent(input);
    const { discussion } = (input ?? {}) as Record<string, unknown>;
    if (typeof discussion !== 'string') {
      throw new errors.ValidationError(
        'discussion must be a discussion documentId',
      );
    }
    const found = await strapi
      .documents('api::discussion.discussion')
      .findOne({ documentId: discussion, fields: ['id'] });
    if (!found) {
      throw new errors.NotFoundError('Discussion not found');
    }
    return strapi.documents(UID).create({
      data: { content, discussion, author: authorDocumentId },
      populate: { author: { fields: ['username'] } },
    });
  },

  async update(documentId: string, params: { data?: unknown }) {
    return super.update(documentId, {
      ...params,
      data: { content: readContent(params.data) },
    });
  },
}));
