import { DiscussionFeedSkeleton } from '@/features/discussions/components/DiscussionFeedSkeleton';

export default function CommunityLoading() {
  return (
    <div className="py-8">
      <DiscussionFeedSkeleton />
    </div>
  );
}
