import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import type { MemberService } from '../services/member';

const MAX_USERNAME_LENGTH = 100;

export default ({ strapi }: { strapi: Core.Strapi }): Core.Controller => ({
  async findOne(ctx) {
    const { username } = ctx.params;
    if (
      typeof username !== 'string' ||
      !username.trim() ||
      username.length > MAX_USERNAME_LENGTH
    ) {
      throw new errors.ValidationError('username is invalid');
    }
    const member = await (
      strapi.service('api::member.member') as MemberService
    ).findByUsername(username);
    return { data: member };
  },
});
