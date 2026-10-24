import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DiscussionDetail } from '@/features/discussions/components/DiscussionDetail';
import { DiscussionDetailSkeleton } from '@/features/discussions/components/DiscussionDetailSkeleton';
import { getDiscussion } from '@/features/discussions/queries';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/discussions/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const discussion = await getDiscussion(slug);
  return discussion ? { title: discussion.title } : {};
}

export default function DiscussionPage({
  params,
}: PageProps<'/[lang]/discussions/[slug]'>) {
  return (
    <main id="content" className="pt-8 pb-24">
      <Suspense fallback={<DiscussionDetailSkeleton />}>
        <DiscussionDetail params={params} />
      </Suspense>
    </main>
  );
}
