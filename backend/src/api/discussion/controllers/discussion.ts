import { factories, type Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { withPublicAuthors } from '../../../utils/public-author';
import type { DiscussionService, RawDiscussion } from '../services/discussion';

const UID = 'api::discussion.discussion';
const SLUG = /^[a-z0-9-]+$/;

type Controller = Core.CoreAPI.Controller.CollectionType;
type Sanitized = Record<string, unknown>;
type Context = Parameters<Controller['sanitizeOutput']>[1];

export default factories.createCoreController(UID, ({ strapi }) => {
  const service = () => strapi.service(UID) as DiscussionService;

  const present = async (
    controller: Controller,
    discussion: RawDiscussion,
    ctx: Context,
  ) => {
    const sanitized = (await controller.sanitizeOutput(
      discussion,
      ctx,
    )) as Sanitized;
    return controller.transformResponse(
      withPublicAuthors(sanitized, discussion),
    );
  };

  return {
    async find(this: Controller, ctx) {
      await this.validateQuery(ctx);
      const query = await this.sanitizeQuery(ctx);
      const { results, pagination } = await service().find(query);
      const sanitized = (await this.sanitizeOutput(
        results,
        ctx,
      )) as Sanitized[];
      const data = sanitized.map((item, index) =>
        withPublicAuthors(item, results[index]),
      );
      return this.transformResponse(data, { pagination });
    },

    async stats(ctx) {
      const { category } = ctx.query;
      if (
        category !== undefined &&
        (typeof category !== 'string' || !SLUG.test(category))
      ) {
        throw new errors.ValidationError('category must be a category slug');
      }
      return { data: await service().stats(category) };
    },

    async setBestReply(this: Controller, ctx) {
      const { data } = ctx.request.body ?? {};
      const discussion = await service().setBestReply(ctx.params.id, data);
      return present(this, discussion, ctx);
    },

    async findBySlug(this: Controller, ctx) {
      await this.validateQuery(ctx);
      return present(this, await service().findBySlug(ctx.params.slug), ctx);
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
      const discussion = await service().createForAuthor(
        input,
        ctx.state.user.documentId,
      );
      ctx.status = 201;
      return present(this, discussion, ctx);
    },
  };
});
