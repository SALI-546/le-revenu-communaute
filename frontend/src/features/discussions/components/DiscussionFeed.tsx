import Link from 'next/link';
import { Add01Icon, MessageMultiple01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SearchForm } from '@/components/layout/SearchForm';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { Pagination } from '@/components/ui/Pagination';
import { StateCard } from '@/components/ui/StateCard';
import { getDictionary, getLocale } from '@/dictionaries';
import { getCategories, getDiscussions } from '../queries';
import { listHref } from '../listHref';
import { listSearchParamsSchema } from '../schemas';
import { CategoryNav } from './CategoryNav';
import { DiscussionCard } from './DiscussionCard';
import { SortSelect } from './SortSelect';

type DiscussionFeedProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function DiscussionFeed({ searchParams }: DiscussionFeedProps) {
  const filters = listSearchParamsSchema.parse(await searchParams);
  const [{ data: discussions, meta }, categories, dict, locale] =
    await Promise.all([
      getDiscussions(filters),
      getCategories(),
      getDictionary(),
      getLocale(),
    ]);
  const { list } = dict.discussions;
  const { total } = meta.pagination;

  return (
    <div className="grid gap-6 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-7">
      <aside className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 lg:sticky lg:top-6 lg:block lg:self-start">
        <SearchForm
          id="feed-search"
          action={listHref(locale, {})}
          labels={dict.layout.search}
          defaultValue={filters.q}
          className="lg:hidden"
        />
        <CategoryNav
          categories={categories}
          filters={filters}
          locale={locale}
          labels={list.categories}
        />
        <p className="mt-6 hidden border-t border-line p-4 text-[11px] leading-relaxed text-ink-3 lg:block">
          <strong className="mb-0.5 block text-ink-2">
            {list.trust.title}
          </strong>
          {list.trust.description}
        </p>
      </aside>
      <section aria-labelledby="feed-title" className="min-w-0">
        {filters.q && (
          <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
            <span>
              {list.search.results}{' '}
              <strong className="text-ink">
                {list.search.quoteOpen}
                {filters.q}
                {list.search.quoteClose}
              </strong>
            </span>
            <Link
              href={listHref(locale, { ...filters, q: undefined, page: 1 })}
              className="inline-flex min-h-8 items-center text-xs font-bold text-brand-text"
            >
              {list.search.clear}
            </Link>
          </p>
        )}
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-line">
          <p className="text-xs text-ink-3">
            {total}{' '}
            {
              list.count[
                new Intl.PluralRules(locale).select(total) === 'one'
                  ? 'one'
                  : 'other'
              ]
            }
          </p>
          <SortSelect filters={filters} locale={locale} labels={list.sort} />
        </div>
        {discussions.length === 0 ? (
          <StateCard
            icon={MessageMultiple01Icon}
            title={filters.q ? list.search.emptyTitle : list.empty.title}
            description={
              filters.q ? list.search.emptyDescription : list.empty.description
            }
            action={
              <Link
                href={`/${locale}/discussions/new`}
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
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
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
