import * as z from 'zod';

export const SORT_ORDERS = ['newest', 'oldest'] as const;

export const listSearchParamsSchema = z.object({
  category: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional()
    .catch(undefined),
  sort: z.enum(SORT_ORDERS).catch('newest'),
  page: z.coerce.number().int().min(1).catch(1),
  q: z
    .string()
    .trim()
    .max(100)
    .transform((value) => value || undefined)
    .optional()
    .catch(undefined),
});

export type ListFilters = z.infer<typeof listSearchParamsSchema>;

export const DISCUSSION_TYPES = ['question', 'discussion'] as const;

export const discussionSchema = z.object({
  type: z.enum(DISCUSSION_TYPES, { error: 'typeInvalid' }),
  title: z
    .string()
    .trim()
    .min(10, { error: 'titleTooShort' })
    .max(150, { error: 'titleTooLong' }),
  category: z.string().min(1, { error: 'categoryRequired' }),
  content: z
    .string()
    .trim()
    .min(1, { error: 'contentRequired' })
    .max(10000, { error: 'contentTooLong' }),
});
