import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import type { ListFilters } from './schemas';
import type {
  Category,
  CommunityStats,
  DiscussionDetail,
  DiscussionSummary,
  StrapiList,
} from './types';

export const DISCUSSIONS_TAG = 'discussions';
const CATEGORIES_TAG = 'categories';
const PAGE_SIZE = 10;

const WITHOUT_REPLY = 'filters[replies][id][$null]';

export async function getDiscussions({
  category,
  tab,
  sort,
  page,
  q,
}: ListFilters) {
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
  if (tab === 'unanswered') {
    query.set(WITHOUT_REPLY, 'true');
  }
  if (q) {
    query.set('filters[$and][0][$or][0][title][$containsi]', q);
    query.set('filters[$and][0][$or][1][content][$containsi]', q);
  }
  return strapiFetch<StrapiList<DiscussionSummary>>('/discussions', { query });
}

export async function getAwaitingQuestions() {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  const query = new URLSearchParams({
    'filters[type][$eq]': 'question',
    [WITHOUT_REPLY]: 'true',
    sort: 'publishedAt:desc',
    'pagination[pageSize]': '3',
  });
  const { data } = await strapiFetch<StrapiList<DiscussionSummary>>(
    '/discussions',
    { query },
  );
  return data;
}

export async function getRelatedDiscussions(slug: string, category?: string) {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  const query = new URLSearchParams({
    'filters[slug][$ne]': slug,
    sort: 'publishedAt:desc',
    'pagination[pageSize]': '3',
  });
  if (category) {
    query.set('filters[category][slug][$eq]', category);
  }
  const { data } = await strapiFetch<StrapiList<DiscussionSummary>>(
    '/discussions',
    { query },
  );
  return data;
}

export async function getCommunityStats(category?: string) {
  'use cache';
  cacheTag(DISCUSSIONS_TAG);
  cacheLife('minutes');

  const query = new URLSearchParams(category ? { category } : {});
  const { data } = await strapiFetch<{ data: CommunityStats }>(
    '/discussions/stats',
    { query },
  );
  return data;
}

export async function getCategories() {
  'use cache';
  cacheTag(CATEGORIES_TAG);
  cacheLife('hours');

  const query = new URLSearchParams({ 'pagination[pageSize]': '50' });
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
