import Link from 'next/link';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { StateCard } from '@/components/ui/StateCard';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';

export default async function CommunityNotFound() {
  const [{ notFound }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);

  return (
    <main id="content" className="py-10">
      <StateCard
        icon={Search01Icon}
        title={notFound.title}
        description={notFound.description}
        action={
          <Link href={localizedHref(locale)} className={buttonStyles()}>
            {notFound.back}
          </Link>
        }
      />
    </main>
  );
}
