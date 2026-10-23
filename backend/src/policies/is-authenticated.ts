import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

type AuthPolicyContext = Core.PolicyContext & {
  state: { user?: { id: number } };
};

export default (policyContext: AuthPolicyContext) => {
  if (!policyContext.state.user) {
    throw new errors.UnauthorizedError('Authentication required');
  }
  return true;
};
