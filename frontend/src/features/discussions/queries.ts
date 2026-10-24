import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import type { ListFilters } from './schemas';
import type {
  Category,
  DiscussionDetail,
  DiscussionSummary,
  StrapiList,
} from './types';

export const DISCUSSIONS_TAG = 'discussions';
const CATEGORIES_TAG = 'categories';
const PAGE_SIZE = 10;

export async function getDiscussions({ category, sort, page }: ListFilters) {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  const query = new URLSearchParams({
    sort: sort === 'oldest' ? 'publishedAt:asc' : 'publishedAt:desc',
    'pagination[page]': String(page),
    'pagination[pageSize]': String(PAGE_SIZE),
  });
  if (category) {
    query.set('filters[category][slug][$eq]', category);
  }
  return strapiFetch<StrapiList<DiscussionSummary>>('/discussions', { query });
}

export async function getCategories() {
  'use cache';
  cacheTag(CATEGORIES_TAG);
  cacheLife('hours');

  const query = new URLSearchParams({
    sort: 'name:asc',
    'pagination[pageSize]': '50',
  });
  const { data } = await strapiFetch<StrapiList<Category>>('/categories', {
    query,
  });
  return data;
}

export async function getDiscussion(slug: string) {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  try {
    const { data } = await strapiFetch<{ data: DiscussionDetail }>(
      `/discussions/slug/${encodeURIComponent(slug)}`,
    );
    return data;
  } catch (error) {
    if (error instanceof StrapiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
