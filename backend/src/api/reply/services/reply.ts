import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const UID = 'api::reply.reply';
const VOTE_UID = 'api::vote.vote';

type Voter = { id: number; documentId: string };

export type ReplyService = {
  createForAuthor(
    input: unknown,
    authorDocumentId: string,
  ): Promise<{ author?: { username: string } | null }>;
  toggleHelpful(
    replyDocumentId: string,
    voter: Voter,
  ): Promise<{ helpfulCount: number; voted: boolean }>;
  findHelpfulVotes(
    discussionDocumentId: string,
    voterId: number,
  ): Promise<string[]>;
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

  async toggleHelpful(replyDocumentId: string, voter: Voter) {
    const reply = await strapi.documents(UID).findOne({
      documentId: replyDocumentId,
      populate: { author: { fields: ['id'] } },
    });
    if (!reply) {
      throw new errors.NotFoundError('Reply not found');
    }
    if (reply.author?.id === voter.id) {
      throw new errors.ForbiddenError('You cannot vote for your own reply');
    }
    const votes = strapi.documents(VOTE_UID);
    const ofReply = { reply: { documentId: replyDocumentId } };
    const byVoter = { ...ofReply, voter: { id: voter.id } };
    const existing = await votes.findFirst({ filters: byVoter });
    if (existing) {
      await votes.delete({ documentId: existing.documentId });
    } else {
      await votes.create({
        data: { reply: replyDocumentId, voter: voter.documentId },
      });
      // Two simultaneous requests can both create a vote: keep the oldest one.
      const duplicates = await votes.findMany({
        filters: byVoter,
        sort: 'id:asc',
      });
      await Promise.all(
        duplicates
          .slice(1)
          .map((vote) => votes.delete({ documentId: vote.documentId })),
      );
    }
    const helpfulCount = await votes.count({ filters: ofReply });
    await strapi.db
      .query(UID)
      .update({ where: { id: reply.id }, data: { helpfulCount } });
    return { helpfulCount, voted: !existing };
  },

  async findHelpfulVotes(discussionDocumentId: string, voterId: number) {
    const votes = await strapi.documents(VOTE_UID).findMany({
      filters: {
        voter: { id: voterId },
        reply: { discussion: { documentId: discussionDocumentId } },
      },
      populate: { reply: { fields: ['id'] } },
    });
    return votes.flatMap(({ reply }) => (reply ? [reply.documentId] : []));
  },

  async delete(documentId: string, params: object = {}) {
    const votes = strapi.documents(VOTE_UID);
    const orphans = await votes.findMany({
      filters: { reply: { documentId } },
    });
    await Promise.all(
      orphans.map((vote) => votes.delete({ documentId: vote.documentId })),
    );
    return super.delete(documentId, params);
  },

  async update(documentId: string, params: { data?: unknown }) {
    return super.update(documentId, {
      ...params,
      data: { content: readContent(params.data) },
    });
  },
}));
