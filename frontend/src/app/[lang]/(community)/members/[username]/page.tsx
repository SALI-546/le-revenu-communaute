import { Suspense } from 'react';
import { MemberProfile } from '@/features/members/components/MemberProfile';
import { decodeUsername } from '@/features/members/decodeUsername';
import { MemberProfileSkeleton } from '@/features/members/components/MemberProfileSkeleton';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/members/[username]'>) {
  const username = decodeUsername((await params).username);
  return username ? { title: username } : {};
}

export default function MemberPage({
  params,
}: PageProps<'/[lang]/members/[username]'>) {
  return (
    <main id="content" className="pt-8 pb-24">
      <Suspense fallback={<MemberProfileSkeleton />}>
        <MemberProfile params={params} />
      </Suspense>
    </main>
  );
}
