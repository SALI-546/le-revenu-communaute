import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

type OwnerPolicyContext = Core.PolicyContext & {
  state: { user?: { id: number } };
  params: { id: string };
};

type OwnerPolicyConfig = {
  uid: 'api::discussion.discussion' | 'api::reply.reply';
};

export default async (
  policyContext: OwnerPolicyContext,
  config: OwnerPolicyConfig,
  { strapi }: { strapi: Core.Strapi },
) => {
  const user = policyContext.state.user;
  if (!user) {
    throw new errors.UnauthorizedError('Authentication required');
  }

  const document = await strapi.documents(config.uid).findOne({
    documentId: policyContext.params.id,
    populate: { author: { fields: ['id'] } },
  });
  if (!document) {
    throw new errors.NotFoundError('Document not found');
  }
  if (document.author?.id !== user.id) {
    throw new errors.PolicyError('Only the author can do this');
  }
  return true;
};
