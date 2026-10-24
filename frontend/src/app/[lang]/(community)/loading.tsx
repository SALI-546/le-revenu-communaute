import { DiscussionFeedSkeleton } from '@/features/discussions/components/DiscussionFeedSkeleton';

export default function CommunityLoading() {
  return (
    <div className="page-shell pt-10 pb-20">
      <DiscussionFeedSkeleton />
    </div>
  );
}
