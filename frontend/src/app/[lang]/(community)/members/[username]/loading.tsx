import { MemberProfileSkeleton } from '@/features/members/components/MemberProfileSkeleton';

export default function MemberLoading() {
  return (
    <div className="pt-8 pb-24">
      <MemberProfileSkeleton />
    </div>
  );
}
