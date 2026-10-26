'use client';

import { useRouter } from 'next/navigation';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { listHref } from '../listHref';
import { SORT_ORDERS, type ListFilters } from '../schemas';

type SortSelectProps = {
  filters: ListFilters;
  locale: string;
  labels: Dictionary['discussions']['list']['sort'];
};

export function SortSelect({ filters, locale, labels }: SortSelectProps) {
  const router = useRouter();

  return (
    <label className="relative flex min-h-11 items-center rounded-lg border border-line bg-surface">
      <span className="sr-only">{labels.label}</span>
      <select
        value={filters.sort}
        onChange={(event) => {
          const sort = SORT_ORDERS.find(
            (order) => order === event.target.value,
          );
          router.push(listHref(locale, { ...filters, sort, page: 1 }));
        }}
        className="h-full appearance-none bg-transparent py-2 pr-8 pl-3 text-sm font-semibold text-ink outline-none"
      >
        {SORT_ORDERS.map((order) => (
          <option key={order} value={order}>
            {labels[order]}
          </option>
        ))}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={15}
        color="currentColor"
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 text-ink-3"
      />
    </label>
  );
}
