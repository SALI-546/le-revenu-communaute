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

export type Reply = {
  documentId: string;
  content: string;
  publishedAt: string;
  author: Author;
};

export type DiscussionDetail = Omit<DiscussionSummary, 'replies'> & {
  replies: Reply[];
};

export type DiscussionFormState = {
  fieldErrors?: {
    [Field in 'type' | 'title' | 'category' | 'content']?: string[];
  };
  error?: 'unavailable';
  values?: { type: string; category: string };
};
