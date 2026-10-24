import type { ListFilters } from './schemas';

export const listHref = (
  locale: string,
  { q, category, sort, page }: Partial<ListFilters>,
) => {
  const query = new URLSearchParams();
  if (q) {
    query.set('q', q);
  }
  if (category) {
    query.set('category', category);
  }
  if (sort && sort !== 'newest') {
    query.set('sort', sort);
  }
  if (page && page > 1) {
    query.set('page', String(page));
  }
  return query.size ? `/${locale}?${query}` : `/${locale}`;
};
