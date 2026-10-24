import { Suspense } from 'react';
import { CommunityAside } from '@/features/discussions/components/CommunityAside';
import { CommunityIntro } from '@/features/discussions/components/CommunityIntro';
import { CommunityIntroSkeleton } from '@/features/discussions/components/CommunityIntroSkeleton';
import { DiscussionFeed } from '@/features/discussions/components/DiscussionFeed';
import { DiscussionFeedSkeleton } from '@/features/discussions/components/DiscussionFeedSkeleton';

export default function CommunityHomePage({
  searchParams,
}: PageProps<'/[lang]'>) {
  return (
    <main
      id="content"
      className="grid gap-8 pt-6 pb-20 lg:pt-8 xl:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <div className="grid min-w-0 content-start gap-8">
        <Suspense fallback={<CommunityIntroSkeleton />}>
          <CommunityIntro searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<DiscussionFeedSkeleton />}>
          <DiscussionFeed searchParams={searchParams} />
        </Suspense>
      </div>
      <CommunityAside />
    </main>
  );
}
