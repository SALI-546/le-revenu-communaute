import Link from 'next/link';
import clsx from 'clsx';
import { Clock01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { listHref } from '../listHref';
import { LIST_TABS, type ListFilters } from '../schemas';

type FeedTabsProps = {
  filters: ListFilters;
  locale: string;
  labels: Dictionary['home']['tabs'];
  unanswered?: number;
};

const TAB_ICONS = { recent: Clock01Icon, unanswered: HelpCircleIcon };

export function FeedTabs({
  filters,
  locale,
  labels,
  unanswered,
}: FeedTabsProps) {
  return (
    <nav aria-label={labels.label}>
      <ul className="inline-flex gap-1 rounded-lg bg-surface-2 p-1">
        {LIST_TABS.map((tab) => {
          const active = filters.tab === tab;
          return (
            <li key={tab}>
              <Link
                href={listHref(locale, { ...filters, tab, page: 1 })}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors sm:px-3.5',
                  active
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-ink-3 hover:text-ink',
                )}
              >
                <HugeiconsIcon
                  icon={TAB_ICONS[tab]}
                  size={15}
                  color="currentColor"
                  aria-hidden="true"
                />
                {labels[tab]}
                {tab === 'unanswered' && unanswered !== undefined && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-brand-soft px-1.5 text-xs font-bold text-brand-text tabular-nums">
                    {unanswered}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
