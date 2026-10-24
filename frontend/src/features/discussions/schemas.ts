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
});

export type ListFilters = z.infer<typeof listSearchParamsSchema>;
