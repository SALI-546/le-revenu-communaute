import * as z from 'zod';

export const replySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, { error: 'required' })
    .max(5000, { error: 'tooLong' }),
  discussion: z.string().min(1),
});

export type ReplyInput = z.infer<typeof replySchema>;
