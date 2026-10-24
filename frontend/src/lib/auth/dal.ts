import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import { getSessionToken } from './session';

export type SessionUser = { id: number; username: string };

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }
  try {
    const { id, username } = await strapiFetch<SessionUser>('/users/me', {
      token,
    });
    return { id, username };
  } catch (error) {
    if (error instanceof StrapiError && error.status === 401) {
      return null;
    }
    throw error;
  }
});

export const verifySession = cache(async (loginPath = '/login') => {
  const token = await getSessionToken();
  const user = await getCurrentUser();
  if (!token || !user) {
    redirect(loginPath);
  }
  return { token, user };
});
