'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod';
import { createSession, deleteSession } from '@/lib/auth/session';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import { loginSchema } from './schemas';
import type { LoginState } from './types';

const safeRedirect = (target: FormDataEntryValue | null) =>
  typeof target === 'string' &&
  target.startsWith('/') &&
  !target.startsWith('//')
    ? target
    : '/';

export async function login(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    const { jwt } = await strapiFetch<{ jwt: string }>('/auth/local', {
      method: 'POST',
      body: { identifier: parsed.data.email, password: parsed.data.password },
    });
    await createSession(jwt);
  } catch (error) {
    const invalid = error instanceof StrapiError && error.status === 400;
    return {
      error: invalid ? 'invalidCredentials' : 'unavailable',
      email: parsed.data.email,
    };
  }

  redirect(safeRedirect(formData.get('redirectTo')));
}

export async function logout(formData: FormData) {
  await deleteSession();
  redirect(safeRedirect(formData.get('redirectTo')));
}
