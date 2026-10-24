import { factories, type Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { withPublicAuthor } from '../../../utils/public-author';
import type { ReplyService } from '../services/reply';

const UID = 'api::reply.reply';

type Controller = Core.CoreAPI.Controller.CollectionType;

const DOCUMENT_ID = /^[a-z0-9]+$/;

export default factories.createCoreController(UID, ({ strapi }) => ({
  async toggleHelpful(ctx) {
    const { id, documentId } = ctx.state.user;
    const result = await (strapi.service(UID) as ReplyService).toggleHelpful(
      ctx.params.id,
      { id, documentId },
    );
    return { data: result };
  },

  async findHelpfulVotes(ctx) {
    const { discussion } = ctx.query;
    if (typeof discussion !== 'string' || !DOCUMENT_ID.test(discussion)) {
      throw new errors.ValidationError(
        'discussion must be a discussion documentId',
      );
    }
    const replies = await (
      strapi.service(UID) as ReplyService
    ).findHelpfulVotes(discussion, ctx.state.user.id);
    return { data: replies };
  },

  async create(this: Controller, ctx) {
    await this.validateQuery(ctx);
    const { data } = ctx.request.body ?? {};
    if (typeof data !== 'object' || data === null) {
      throw new errors.ValidationError(
        'Missing "data" payload in the request body',
      );
    }
    const input = await this.sanitizeInput(data, ctx);
    const reply = await (strapi.service(UID) as ReplyService).createForAuthor(
      input,
      ctx.state.user.documentId,
    );
    const sanitized = (await this.sanitizeOutput(reply, ctx)) as Record<
      string,
      unknown
    >;
    ctx.status = 201;
    return this.transformResponse(withPublicAuthor(sanitized, reply));
  },
}));
