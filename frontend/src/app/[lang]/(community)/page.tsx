import Link from 'next/link';
import { Suspense } from 'react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { CommunityHero } from '@/features/discussions/components/CommunityHero';
import { DiscussionFeed } from '@/features/discussions/components/DiscussionFeed';
import { DiscussionFeedSkeleton } from '@/features/discussions/components/DiscussionFeedSkeleton';

export default async function CommunityHomePage({
  searchParams,
}: PageProps<'/[lang]'>) {
  const [{ home, discussions }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);
  const { list } = discussions;

  return (
    <main id="content">
      <CommunityHero hero={home.hero} />
      <div className="page-shell pt-8 pb-20 lg:pt-10">
        <div className="mb-6 flex items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-brand-text uppercase">
              {list.label}
            </p>
            <h2
              id="feed-title"
              className="font-display text-[25px] leading-tight font-bold text-ink sm:text-[31px]"
            >
              {list.title}
            </h2>
          </div>
          <Link
            href={localizedHref(locale, '/discussions/new')}
            className={buttonStyles({ className: 'max-sm:w-11 max-sm:px-0' })}
          >
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={17}
              color="currentColor"
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">{list.publish}</span>
          </Link>
        </div>
        <Suspense fallback={<DiscussionFeedSkeleton />}>
          <DiscussionFeed searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
