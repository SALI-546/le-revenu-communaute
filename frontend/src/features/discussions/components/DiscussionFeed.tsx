import Link from 'next/link';
import {
  Add01Icon,
  CheckmarkCircle02Icon,
  MessageMultiple01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchForm } from '@/components/layout/SearchForm';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Pagination } from '@/components/ui/Pagination';
import { StateCard } from '@/components/ui/StateCard';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { pluralize } from '@/lib/plural';
import { listHref } from '../listHref';
import { getCategories, getCommunityStats, getDiscussions } from '../queries';
import { listSearchParamsSchema } from '../schemas';
import { CategoryNav } from './CategoryNav';
import { DensityToggle } from './DensityToggle';
import { DiscussionCard } from './DiscussionCard';
import { FeedTabs } from './FeedTabs';
import { SortSelect } from './SortSelect';

type DiscussionFeedProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function DiscussionFeed({ searchParams }: DiscussionFeedProps) {
  const filters = listSearchParamsSchema.parse(await searchParams);
  const [{ data: discussions, meta }, categories, stats, dict, locale] =
    await Promise.all([
      getDiscussions(filters),
      getCategories(),
      getCommunityStats(filters.category),
      getDictionary(),
      getLocale(),
    ]);
  const { list } = dict.discussions;
  const { total } = meta.pagination;
  const empty = filters.q
    ? {
        title: list.search.emptyTitle,
        description: list.search.emptyDescription,
      }
    : filters.tab === 'unanswered'
      ? list.unansweredEmpty
      : list.empty;

  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:hidden">
        <SearchForm
          id="feed-search"
          action={listHref(locale, {})}
          labels={dict.layout.search}
          defaultValue={filters.q}
        />
        <CategoryNav
          categories={categories}
          filters={filters}
          locale={locale}
          labels={list.categories}
        />
      </div>
      <section aria-labelledby="feed-title" className="min-w-0">
        <h2 id="feed-title" className="sr-only">
          {list.title}
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FeedTabs
            filters={filters}
            locale={locale}
            labels={dict.home.tabs}
            unanswered={filters.q ? undefined : stats.unanswered}
          />
          <div className="flex gap-2">
            <DensityToggle labels={list.density} />
            <SortSelect filters={filters} locale={locale} labels={list.sort} />
          </div>
        </div>
        <p className="mt-3 mb-3 flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-3">
          <span>
            {total} {pluralize(locale, total, list.count)}
          </span>
          {filters.q && (
            <>
              <span className="text-ink-2">
                {list.search.results}{' '}
                <strong className="text-ink">
                  {list.search.quoteOpen}
                  {filters.q}
                  {list.search.quoteClose}
                </strong>
              </span>
              <Link
                href={listHref(locale, { ...filters, q: undefined, page: 1 })}
                className="inline-flex min-h-8 items-center font-bold text-brand-text"
              >
                {list.search.clear}
              </Link>
            </>
          )}
        </p>
        {discussions.length === 0 ? (
          <StateCard
            icon={
              filters.tab === 'unanswered' && !filters.q
                ? CheckmarkCircle02Icon
                : MessageMultiple01Icon
            }
            title={empty.title}
            description={empty.description}
            action={
              <Link
                href={localizedHref(locale, '/discussions/new')}
                className={buttonStyles()}
              >
                <HugeiconsIcon
                  icon={Add01Icon}
                  size={17}
                  color="currentColor"
                  aria-hidden="true"
                />
                {list.publish}
              </Link>
            }
          />
        ) : (
          <div className="border-t border-line">
            {discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.documentId}
                discussion={discussion}
                locale={locale}
                dict={dict.discussions}
              />
            ))}
          </div>
        )}
        {meta.pagination.pageCount > 1 && (
          <Pagination
            page={meta.pagination.page}
            pageCount={meta.pagination.pageCount}
            hrefFor={(page) => listHref(locale, { ...filters, page })}
            labels={dict.pagination}
          />
        )}
      </section>
    </div>
  );
}
