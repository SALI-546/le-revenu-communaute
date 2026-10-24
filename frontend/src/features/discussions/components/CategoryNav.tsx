import Link from 'next/link';
import clsx from 'clsx';
import type { Dictionary } from '@/dictionaries';
import { listHref } from '../listHref';
import type { ListFilters } from '../schemas';
import type { Category } from '../types';
import { SpaceIcon } from './SpaceIcon';

type CategoryNavProps = {
  categories: Category[];
  filters: ListFilters;
  locale: string;
  labels: Dictionary['discussions']['list']['categories'];
};

const chipStyles = (active: boolean, withIcon: boolean) =>
  clsx(
    'flex min-h-11 items-center gap-2 rounded-full border pr-3.5 text-xs font-semibold whitespace-nowrap',
    withIcon ? 'pl-2' : 'pl-3.5',
    active
      ? 'border-brand bg-brand text-on-brand'
      : 'border-line bg-surface text-ink-2',
  );

export function CategoryNav({
  categories,
  filters,
  locale,
  labels,
}: CategoryNavProps) {
  return (
    <nav aria-label={labels.nav}>
      <ul className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
        <li className="flex-none">
          <Link
            href={listHref(locale, {
              ...filters,
              category: undefined,
              page: 1,
            })}
            aria-current={filters.category ? undefined : 'page'}
            className={chipStyles(!filters.category, false)}
          >
            {labels.all}
          </Link>
        </li>
        {categories.map(({ slug, name, icon, color }) => (
          <li key={slug} className="flex-none">
            <Link
              href={listHref(locale, { ...filters, category: slug, page: 1 })}
              aria-current={filters.category === slug ? 'page' : undefined}
              className={chipStyles(filters.category === slug, true)}
            >
              <SpaceIcon icon={icon} color={color} />
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
