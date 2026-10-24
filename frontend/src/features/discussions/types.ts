export type DiscussionType = 'question' | 'discussion';

export type Author = { username: string } | null;

export type CategorySummary = {
  documentId: string;
  name: string;
  slug: string;
};

export type Category = CategorySummary & { description: string | null };

export type DiscussionSummary = {
  documentId: string;
  title: string;
  slug: string;
  type: DiscussionType;
  content: string;
  publishedAt: string;
  author: Author;
  category: CategorySummary | null;
  replies: { count: number };
};

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type StrapiList<T> = { data: T[]; meta: { pagination: Pagination } };
