import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import type { MemberService } from '../services/member';

const USERNAME = /^[\p{L}\p{N}_.-]{1,50}$/u;

export default ({ strapi }: { strapi: Core.Strapi }): Core.Controller => ({
  async findOne(ctx) {
    const { username } = ctx.params;
    if (!USERNAME.test(username)) {
      throw new errors.ValidationError('username is invalid');
    }
    const member = await (
      strapi.service('api::member.member') as MemberService
    ).findByUsername(username);
    return { data: member };
  },
});
