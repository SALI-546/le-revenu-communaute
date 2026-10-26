import 'server-only';
import { cache } from 'react';
import { getSessionToken } from '@/lib/auth/session';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';

export const getMyHelpfulVotes = cache(async (discussionId: string) => {
  const token = await getSessionToken();
  if (!token) {
    return [];
  }
  try {
    const { data } = await strapiFetch<{ data: string[] }>('/replies/helpful', {
      token,
      query: new URLSearchParams({ discussion: discussionId }),
    });
    return data;
  } catch (error) {
    if (error instanceof StrapiError && error.status === 401) {
      return [];
    }
    throw error;
  }
});
