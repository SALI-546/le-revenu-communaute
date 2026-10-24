import { factories, type Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { withPublicAuthor } from '../../../utils/public-author';
import type { ReplyService } from '../services/reply';

const UID = 'api::reply.reply';

type Controller = Core.CoreAPI.Controller.CollectionType;

export default factories.createCoreController(UID, ({ strapi }) => ({
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
