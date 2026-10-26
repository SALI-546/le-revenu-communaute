import Link from 'next/link';
import { UserIcon } from '@hugeicons/core-free-icons';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { StateCard } from '@/components/ui/StateCard';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';

export default async function MemberNotFound() {
  const [{ members }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);

  return (
    <main id="content" className="py-10">
      <StateCard
        icon={UserIcon}
        title={members.notFound.title}
        description={members.notFound.description}
        action={
          <Link href={localizedHref(locale)} className={buttonStyles()}>
            {members.notFound.back}
          </Link>
        }
      />
    </main>
  );
}
