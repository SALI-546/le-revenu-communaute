import { Suspense } from 'react';
import { MemberProfile } from '@/features/members/components/MemberProfile';
import { decodeUsername } from '@/features/members/decodeUsername';
import { getMember } from '@/features/members/queries';
import { MemberProfileSkeleton } from '@/features/members/components/MemberProfileSkeleton';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/members/[username]'>) {
  const username = decodeUsername((await params).username);
  const member = username ? await getMember(username) : null;
  return member ? { title: member.username } : {};
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
