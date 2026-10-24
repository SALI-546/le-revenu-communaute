type Schema = Record<string, unknown>;
type Operation = { parameters?: Schema[] } & Schema;

type OpenApiDraft = {
  info: Schema;
  paths: Record<string, Record<string, Operation>>;
  components: { schemas: Record<string, Schema> };
};

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema: Schema) => ({ 'application/json': { schema } });

const publicAuthor = {
  type: 'object',
  nullable: true,
  properties: { username: { type: 'string', example: 'Thomas' } },
};

const document = {
  id: { type: 'integer' },
  documentId: { type: 'string' },
  publishedAt: { type: 'string', format: 'date-time' },
};

const discussionFields = {
  ...document,
  title: { type: 'string' },
  slug: {
    type: 'string',
    example: 'ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
  },
  type: { type: 'string', enum: ['question', 'discussion'] },
  content: { type: 'string' },
  author: publicAuthor,
  category: {
    type: 'object',
    properties: {
      ...document,
      name: { type: 'string' },
      slug: { type: 'string' },
    },
  },
};

const schemas: Record<string, Schema> = {
  DiscussionRequest: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        required: ['title', 'content', 'type', 'category'],
        description:
          'author and slug are set by the server; any value sent is ignored.',
        properties: {
          title: { type: 'string', minLength: 10, maxLength: 150 },
          content: { type: 'string', minLength: 1, maxLength: 10000 },
          type: { type: 'string', enum: ['question', 'discussion'] },
          category: {
            type: 'string',
            description: 'documentId of an existing category',
          },
        },
      },
    },
  },
  ReplyRequest: {
    type: 'object',
    required: ['data'],
    properties: {
      data: {
        type: 'object',
        required: ['content'],
        description:
          'author is set by the server; discussion is only read on creation.',
        properties: {
          content: { type: 'string', minLength: 1, maxLength: 5000 },
          discussion: {
            type: 'string',
            description: 'documentId of the discussion',
          },
        },
      },
    },
  },
  Reply: {
    type: 'object',
    properties: {
      ...document,
      content: { type: 'string' },
      author: publicAuthor,
    },
  },
  DiscussionSummary: {
    type: 'object',
    properties: {
      ...discussionFields,
      replies: { type: 'object', properties: { count: { type: 'integer' } } },
    },
  },
  DiscussionDetail: {
    type: 'object',
    properties: {
      ...discussionFields,
      replies: { type: 'array', items: ref('Reply') },
    },
  },
  DiscussionListResponse: {
    type: 'object',
    properties: {
      data: { type: 'array', items: ref('DiscussionSummary') },
      meta: {
        type: 'object',
        properties: {
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer' },
              pageSize: { type: 'integer' },
              pageCount: { type: 'integer' },
              total: { type: 'integer' },
            },
          },
        },
      },
    },
  },
  DiscussionResponse: {
    type: 'object',
    properties: { data: ref('DiscussionDetail') },
  },
  ReplyResponse: { type: 'object', properties: { data: ref('Reply') } },
};

const listParameters = [
  {
    name: 'filters[$and][0][$or][0][title][$containsi]',
    in: 'query',
    description:
      'Case-insensitive search in titles (pair it with the same filter on content)',
    schema: { type: 'string', example: 'pea' },
  },
  {
    name: 'filters[$and][0][$or][1][content][$containsi]',
    in: 'query',
    description: 'Case-insensitive search in contents',
    schema: { type: 'string', example: 'pea' },
  },
  {
    name: 'filters[category][slug][$eq]',
    in: 'query',
    description: 'Only discussions of this category',
    schema: { type: 'string', example: 'bourse' },
  },
  {
    name: 'filters[replies][id][$null]',
    in: 'query',
    description: 'Only discussions without any reply',
    schema: { type: 'boolean' },
  },
  {
    name: 'sort',
    in: 'query',
    schema: {
      type: 'string',
      enum: ['publishedAt:desc', 'publishedAt:asc'],
      default: 'publishedAt:desc',
    },
  },
  {
    name: 'pagination[page]',
    in: 'query',
    schema: { type: 'integer', minimum: 1, default: 1 },
  },
  {
    name: 'pagination[pageSize]',
    in: 'query',
    schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
  },
];

const findBySlug = {
  get: {
    tags: ['Discussion'],
    summary: 'Get a discussion with its replies by slug',
    operationId: 'get/discussions/slug/{slug}',
    security: [],
    parameters: [
      { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
    ],
    responses: {
      200: { description: 'OK', content: json(ref('DiscussionResponse')) },
      404: { description: 'Not Found', content: json(ref('Error')) },
    },
  },
};

const counter = { type: 'integer', minimum: 0 };

const stats = {
  get: {
    tags: ['Discussion'],
    summary: 'Count discussions, replies and answered questions',
    operationId: 'get/discussions/stats',
    security: [],
    parameters: [
      {
        name: 'category',
        in: 'query',
        description: 'Only count this space',
        schema: { type: 'string', example: 'bourse' },
      },
    ],
    responses: {
      200: {
        description: 'OK',
        content: json({
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                discussions: counter,
                replies: counter,
                questions: counter,
                answeredQuestions: counter,
                unanswered: counter,
              },
            },
          },
        }),
      },
      400: { description: 'Bad Request', content: json(ref('Error')) },
    },
  },
};

const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'string' },
};

const authErrors = {
  401: { description: 'Unauthorized', content: json(ref('Error')) },
  403: { description: 'Forbidden', content: json(ref('Error')) },
  404: { description: 'Not Found', content: json(ref('Error')) },
};

const toggleHelpful = {
  post: {
    tags: ['Reply'],
    summary: 'Mark a reply as helpful, or withdraw the vote',
    description: 'Members cannot vote for their own reply (403).',
    operationId: 'post/replies/{id}/helpful',
    parameters: [idParameter],
    responses: {
      200: {
        description: 'OK',
        content: json({
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: { helpfulCount: counter, voted: { type: 'boolean' } },
            },
          },
        }),
      },
      ...authErrors,
    },
  },
};

const helpfulVotes = {
  get: {
    tags: ['Reply'],
    summary: 'Replies of a discussion marked helpful by the current member',
    operationId: 'get/replies/helpful',
    parameters: [
      {
        name: 'discussion',
        in: 'query',
        required: true,
        description: 'Discussion documentId',
        schema: { type: 'string' },
      },
    ],
    responses: {
      200: {
        description: 'OK',
        content: json({
          type: 'object',
          properties: { data: { type: 'array', items: { type: 'string' } } },
        }),
      },
      400: { description: 'Bad Request', content: json(ref('Error')) },
      ...authErrors,
    },
  },
};

const bestReply = {
  put: {
    tags: ['Discussion'],
    summary: 'Choose the best reply of your discussion, or clear it with null',
    operationId: 'put/discussions/{id}/best-reply',
    parameters: [idParameter],
    requestBody: {
      required: true,
      content: json({
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: { reply: { type: 'string', nullable: true } },
          },
        },
      }),
    },
    responses: {
      200: { description: 'OK', content: json(ref('DiscussionResponse')) },
      400: { description: 'Bad Request', content: json(ref('Error')) },
      ...authErrors,
    },
  },
};

export const mutateDocumentation = (draft: OpenApiDraft) => {
  draft.info = {
    version: '1.0.0',
    title: 'Communauté Le Revenu API',
    description:
      'REST API of the Le Revenu community. Log in with POST /auth/local, then use the jwt with Authorize.',
  };
  Object.assign(draft.components.schemas, schemas);
  draft.paths['/discussions'].get.parameters = listParameters;
  draft.paths['/discussions/slug/{slug}'] = findBySlug;
  draft.paths['/discussions/stats'] = stats;
  draft.paths['/discussions/{id}/best-reply'] = bestReply;
  draft.paths['/replies/{id}/helpful'] = toggleHelpful;
  draft.paths['/replies/helpful'] = helpfulVotes;
};
