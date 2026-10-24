import Link from 'next/link';
import clsx from 'clsx';
import type { Dictionary } from '@/dictionaries';
import { listHref } from '../listHref';
import type { ListFilters } from '../schemas';
import type { Category } from '../types';

type CategoryNavProps = {
  categories: Category[];
  filters: ListFilters;
  locale: string;
  labels: Dictionary['discussions']['list']['categories'];
};

export function CategoryNav({
  categories,
  filters,
  locale,
  labels,
}: CategoryNavProps) {
  const items = [
    { slug: undefined, name: labels.all },
    ...categories.map(({ slug, name }) => ({ slug, name })),
  ];

  return (
    <nav aria-label={labels.nav}>
      <p className="mb-3 hidden px-2 text-[10px] font-bold tracking-widest text-ink-3 uppercase lg:block">
        {labels.title}
      </p>
      <ul className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:mx-0 lg:grid lg:gap-1 lg:overflow-visible lg:px-0">
        {items.map(({ slug, name }) => {
          const active = filters.category === slug;
          return (
            <li key={slug ?? 'all'} className="flex-none">
              <Link
                href={listHref(locale, { ...filters, category: slug, page: 1 })}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex min-h-11 items-center rounded-full border px-3.5 text-xs font-semibold whitespace-nowrap lg:rounded-lg lg:border-transparent lg:px-2.5',
                  active
                    ? 'border-brand bg-brand text-on-brand lg:border-transparent lg:bg-surface lg:font-bold lg:text-heading lg:shadow-sm'
                    : 'border-line bg-surface text-ink-2 lg:bg-transparent lg:hover:bg-glass',
                )}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
