import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { DISCUSSIONS_TAG } from '@/features/discussions/queries';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import type { Member } from './types';

export async function getMember(username: string) {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  try {
    const { data } = await strapiFetch<{ data: Member }>(
      `/members/${encodeURIComponent(username)}`,
    );
    return data;
  } catch (error) {
    if (error instanceof StrapiError && [400, 404].includes(error.status)) {
      return null;
    }
    throw error;
  }
}
