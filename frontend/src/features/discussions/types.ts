export type DiscussionType = 'question' | 'discussion';

export type Author = { username: string } | null;

export type SpaceIconName =
  | 'chart'
  | 'globe'
  | 'piggy-bank'
  | 'umbrella'
  | 'building'
  | 'invoice'
  | 'sofa'
  | 'family'
  | 'diamond'
  | 'wallet'
  | 'coffee';

export type SpaceColor =
  | 'blue'
  | 'slate'
  | 'green'
  | 'teal'
  | 'orange'
  | 'indigo'
  | 'rose'
  | 'purple'
  | 'cyan'
  | 'gray'
  | 'sand';

export type CategorySummary = {
  documentId: string;
  name: string;
  slug: string;
  icon: SpaceIconName;
  color: SpaceColor;
};

export type Category = CategorySummary & {
  description: string | null;
  discussions: { count: number };
};

export type CommunityStats = {
  discussions: number;
  replies: number;
  questions: number;
  answeredQuestions: number;
  unanswered: number;
};

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
