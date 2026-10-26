import type { DiscussionSummary } from '@/features/discussions/types';

export type MemberReply = {
  documentId: string;
  content: string;
  publishedAt: string;
  helpfulCount: number;
  discussion: { title: string; slug: string } | null;
};

export type Member = {
  username: string;
  memberSince: string;
  stats: {
    discussions: number;
    replies: number;
    helpful: number;
    bestAnswers: number;
  };
  discussions: DiscussionSummary[];
  replies: MemberReply[];
};
