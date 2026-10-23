import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'invalidEmail' }).trim(),
  password: z.string().min(1, { error: 'required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
