import { DiscussionDetailSkeleton } from '@/features/discussions/components/DiscussionDetailSkeleton';

export default function DiscussionLoading() {
  return (
    <div className="page-shell pt-8 pb-24">
      <DiscussionDetailSkeleton />
    </div>
  );
}
