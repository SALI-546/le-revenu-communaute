import Link from 'next/link';
import { Add01Icon, MessageMultiple01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
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
      <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
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
            title={list.empty.title}
            description={list.empty.description}
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
          <div className="bg-glass">
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
