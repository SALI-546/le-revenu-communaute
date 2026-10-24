import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { Core } from '@strapi/strapi';
import {
  currentUserId,
  login,
  request,
  startStrapi,
  type Discussion,
  type Reply,
} from './strapi.mts';

let strapi: Core.Strapi;
let thomasToken: string;
let hugoToken: string;
let hugoId: number;
let categoryId: string;

const validDiscussion = () => ({
  title: 'Faut-il diversifier son PEA avec des ETF ?',
  content: 'Je cherche des retours d’expérience sur la diversification.',
  type: 'question',
  category: categoryId,
});

const countDiscussions = async () => {
  const { body } = await request<Discussion[]>('/discussions');
  return body.meta?.pagination.total;
};

const authorEmailOf = async (
  uid: 'api::discussion.discussion' | 'api::reply.reply',
  documentId: string,
) => {
  const document = await strapi.documents(uid).findOne({
    documentId,
    populate: { author: { fields: ['email'] } },
  });
  return document?.author?.email;
};

before(async () => {
  strapi = await startStrapi();
  thomasToken = await login('thomas@demo.lerevenu.test');
  hugoToken = await login('hugo@demo.lerevenu.test');
  hugoId = await currentUserId(hugoToken);
  const { body } = await request<{ documentId: string }[]>(
    `/categories?${new URLSearchParams({ 'filters[slug][$eq]': 'bourse' })}`,
  );
  categoryId = body.data[0].documentId;
});

after(async () => {
  await strapi.destroy();
});

describe('discussion list', () => {
  it('shows title, author, category, reply count and date, newest first', async () => {
    const { status, body } = await request<Discussion[]>(
      '/discussions?pagination[pageSize]=20',
    );

    assert.equal(status, 200);
    assert.equal(body.data.length, 12);
    const pea = body.data.find(({ slug }) => slug.startsWith('ouvrir-un-pea'));
    assert.equal(pea?.title, 'Ouvrir un PEA avec 5 000 € : par où commencer ?');
    assert.deepEqual(pea?.author, { username: 'Thomas' });
    assert.equal(pea?.category.slug, 'bourse');
    assert.deepEqual(pea?.replies, { count: 2 });
    const dates = body.data.map(({ publishedAt }) => Date.parse(publishedAt));
    assert.deepEqual(
      dates,
      [...dates].sort((a, b) => b - a),
    );
  });

  it('filters by category on the server', async () => {
    const query = new URLSearchParams({
      'filters[category][slug][$eq]': 'retraite',
    });
    const { body } = await request<Discussion[]>(`/discussions?${query}`);

    assert.deepEqual(
      body.data.map(({ category }) => category.slug),
      ['retraite'],
    );
  });

  it('searches titles and contents without case sensitivity', async () => {
    const query = new URLSearchParams({
      'filters[$and][0][$or][0][title][$containsi]': 'PEA',
      'filters[$and][0][$or][1][content][$containsi]': 'PEA',
    });
    const { status, body } = await request<Discussion[]>(
      `/discussions?${query}`,
    );

    assert.equal(status, 200);
    assert.ok(body.data.some(({ slug }) => slug.startsWith('ouvrir-un-pea')));
    assert.ok(
      body.data.every(({ slug }) => !slug.startsWith('credit-immobilier')),
    );
  });

  it('lists discussions without any reply', async () => {
    const query = new URLSearchParams({
      'filters[replies][id][$null]': 'true',
    });
    const { body } = await request<Discussion[]>(`/discussions?${query}`);

    assert.deepEqual(
      body.data.map(({ replies }) => replies.count).sort(),
      [0, 0, 0, 0],
    );
  });

  it('never exposes author emails', async () => {
    const { body } = await request<Discussion[]>('/discussions');

    assert.doesNotMatch(JSON.stringify(body), /@demo\.lerevenu\.test/);
  });
});

describe('spaces', () => {
  it('lists spaces in editorial order with icon, color and discussion count', async () => {
    const { status, body } = await request<
      {
        slug: string;
        icon: string;
        color: string;
        discussions: { count: number };
      }[]
    >('/categories?pagination[pageSize]=50');

    assert.equal(status, 200);
    assert.equal(body.data.length, 11);
    assert.deepEqual(
      body.data.slice(0, 3).map(({ slug }) => slug),
      ['bourse', 'economie', 'epargne'],
    );
    const bourse = body.data[0];
    assert.equal(bourse.icon, 'chart');
    assert.equal(bourse.color, 'blue');
    assert.equal(typeof bourse.discussions.count, 'number');
  });
});

describe('community stats', () => {
  it('counts discussions, replies and answered questions', async () => {
    const { status, body } =
      await request<Record<string, number>>('/discussions/stats');

    assert.equal(status, 200);
    assert.deepEqual(body.data, {
      discussions: 12,
      replies: 12,
      questions: 7,
      answeredQuestions: 4,
      unanswered: 4,
    });
  });

  it('scopes the stats to a space and rejects an invalid slug', async () => {
    const { body } = await request<Record<string, number>>(
      '/discussions/stats?category=bourse',
    );
    const invalid = await request('/discussions/stats?category=%3Cscript%3E');

    assert.equal(body.data.discussions, 2);
    assert.equal(body.data.replies, 2);
    assert.equal(invalid.status, 400);
  });
});

describe('discussion validation', () => {
  it('rejects a title shorter than 10 characters', async () => {
    const total = await countDiscussions();
    const { status, body } = await request('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: { ...validDiscussion(), title: 'Trop bref' },
    });

    assert.equal(status, 400);
    assert.match(body.error?.message ?? '', /title/);
    assert.equal(await countDiscussions(), total);
  });

  it('accepts a title of exactly 10 characters', async () => {
    const { status } = await request('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: { ...validDiscussion(), title: 'Dix lettre' },
    });

    assert.equal(status, 201);
  });

  it('rejects an empty content', async () => {
    const { status, body } = await request('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: { ...validDiscussion(), content: '   ' },
    });

    assert.equal(status, 400);
    assert.match(body.error?.message ?? '', /content/);
  });

  it('rejects an unknown category', async () => {
    const { status } = await request('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: { ...validDiscussion(), category: 'unknown' },
    });

    assert.equal(status, 400);
  });
});

describe('authentication', () => {
  it('refuses to publish a discussion without authentication', async () => {
    const { status } = await request('/discussions', {
      method: 'POST',
      data: validDiscussion(),
    });

    assert.ok([401, 403].includes(status), `unexpected status ${status}`);
  });

  it('refuses to publish a reply without authentication', async () => {
    const { body } = await request<Discussion[]>('/discussions');
    const { status } = await request('/replies', {
      method: 'POST',
      data: { content: 'Bonjour', discussion: body.data[0].documentId },
    });

    assert.ok([401, 403].includes(status), `unexpected status ${status}`);
  });
});

describe('author spoofing', () => {
  it('ignores an author sent by the client when creating a discussion', async () => {
    const { status, body } = await request<Discussion>('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: { ...validDiscussion(), author: hugoId },
    });

    assert.equal(status, 201);
    assert.deepEqual(body.data.author, { username: 'Thomas' });
    assert.equal(
      await authorEmailOf('api::discussion.discussion', body.data.documentId),
      'thomas@demo.lerevenu.test',
    );
  });

  it('ignores an author sent by the client when replying', async () => {
    const { body: list } = await request<Discussion[]>('/discussions');
    const { status, body } = await request<Reply>('/replies', {
      method: 'POST',
      token: thomasToken,
      data: {
        content: 'Merci pour ce partage',
        discussion: list.data[0].documentId,
        author: hugoId,
      },
    });

    assert.equal(status, 201);
    assert.equal(
      await authorEmailOf('api::reply.reply', body.data.documentId),
      'thomas@demo.lerevenu.test',
    );
  });

  it('deletes the replies of a deleted discussion', async () => {
    const { body: created } = await request<Discussion>('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: validDiscussion(),
    });
    const { body: reply } = await request<Reply>('/replies', {
      method: 'POST',
      token: hugoToken,
      data: {
        content: 'Réponse vouée à disparaître',
        discussion: created.data.documentId,
      },
    });

    const { status } = await request(
      `/discussions/${created.data.documentId}`,
      {
        method: 'DELETE',
        token: thomasToken,
      },
    );

    assert.equal(status, 204);
    assert.equal(
      await strapi
        .documents('api::reply.reply')
        .findOne({ documentId: reply.data.documentId }),
      null,
    );
  });

  it('forbids editing a discussion written by someone else', async () => {
    const { body: created } = await request<Discussion>('/discussions', {
      method: 'POST',
      token: thomasToken,
      data: validDiscussion(),
    });
    const { status } = await request(
      `/discussions/${created.data.documentId}`,
      {
        method: 'PUT',
        token: hugoToken,
        data: {
          ...validDiscussion(),
          title: 'Titre modifié par un autre membre',
        },
      },
    );

    assert.equal(status, 403);
  });
});

describe('helpful votes and best reply', () => {
  type DetailReply = Reply & { helpfulCount: number; publishedAt: string };
  type Detail = {
    documentId: string;
    publishedAt: string;
    replies: DetailReply[];
    bestReply: { documentId: string } | null;
  };

  const detailOf = async (slug: string) => {
    const { body } = await request<Detail>(`/discussions/slug/${slug}`);
    return body.data;
  };
  const replyBy = (detail: Detail, username: string) =>
    detail.replies.find((reply) => reply.author?.username === username)!;

  it('counts a helpful vote once per member and lets them withdraw it', async () => {
    const pea = await detailOf('ouvrir-un-pea-avec-5-000-eur-par-ou-commencer');
    const reply = replyBy(pea, 'Camille');
    const vote = () =>
      request<{ helpfulCount: number; voted: boolean }>(
        `/replies/${reply.documentId}/helpful`,
        { method: 'POST', token: hugoToken },
      );

    const first = await vote();
    const mine = await request<string[]>(
      `/replies/helpful?discussion=${pea.documentId}`,
      { token: hugoToken },
    );
    const second = await vote();
    const after = await detailOf(
      'ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
    );

    assert.equal(first.status, 200);
    assert.deepEqual(first.body.data, {
      helpfulCount: reply.helpfulCount + 1,
      voted: true,
    });
    assert.ok(mine.body.data.includes(reply.documentId));
    assert.deepEqual(second.body.data, {
      helpfulCount: reply.helpfulCount,
      voted: false,
    });
    assert.equal(replyBy(after, 'Camille').publishedAt, reply.publishedAt);
  });

  it('refuses a helpful vote on your own reply or without authentication', async () => {
    const discussion = await detailOf(
      'j-ai-25-ans-et-10-000-eur-de-cote-je-fais-quoi',
    );
    const ownReply = replyBy(discussion, 'Thomas');
    const path = `/replies/${ownReply.documentId}/helpful`;

    const own = await request(path, { method: 'POST', token: thomasToken });
    const anonymous = await request(path, { method: 'POST' });

    assert.equal(own.status, 403);
    assert.equal(anonymous.status, 403);
  });

  it('lets only the author choose a best reply from the same discussion', async () => {
    const pea = await detailOf('ouvrir-un-pea-avec-5-000-eur-par-ou-commencer');
    const other = await detailOf(
      'j-ai-25-ans-et-10-000-eur-de-cote-je-fais-quoi',
    );
    const camille = replyBy(pea, 'Camille');
    const choose = (token: string, reply: string | null) =>
      request<{ bestReply: { documentId: string } | null }>(
        `/discussions/${pea.documentId}/best-reply`,
        { method: 'PUT', token, data: { reply } },
      );

    const byStranger = await choose(hugoToken, camille.documentId);
    const fromElsewhere = await choose(
      thomasToken,
      other.replies[0].documentId,
    );
    const empty = await choose(thomasToken, '');
    const byAuthor = await choose(thomasToken, camille.documentId);
    const chosen = await detailOf(
      'ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
    );
    const cleared = await choose(thomasToken, null);

    assert.equal(byStranger.status, 403);
    assert.equal(fromElsewhere.status, 400);
    assert.equal(empty.status, 400);
    assert.equal(chosen.publishedAt, pea.publishedAt);
    assert.equal(byAuthor.status, 200);
    assert.equal(byAuthor.body.data.bestReply?.documentId, camille.documentId);
    assert.equal(cleared.body.data.bestReply, null);
    assert.equal(pea.bestReply?.documentId, replyBy(pea, 'Vincent').documentId);
  });
});
