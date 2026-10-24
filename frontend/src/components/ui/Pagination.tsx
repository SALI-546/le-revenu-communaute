import Link from 'next/link';
import clsx from 'clsx';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';

type PaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  labels: Dictionary['pagination'];
};

const itemStyles =
  'grid min-h-11 min-w-11 place-items-center rounded-lg border border-transparent text-xs font-semibold text-ink-3';

export function Pagination({
  page,
  pageCount,
  hrefFor,
  labels,
}: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const arrow = (
    target: number,
    label: string,
    icon: typeof ArrowLeft01Icon,
  ) =>
    target < 1 || target > pageCount ? (
      <span aria-hidden="true" className={clsx(itemStyles, 'opacity-35')}>
        <HugeiconsIcon icon={icon} size={18} color="currentColor" />
      </span>
    ) : (
      <Link
        href={hrefFor(target)}
        aria-label={label}
        className={clsx(itemStyles, 'hover:border-line hover:bg-surface')}
      >
        <HugeiconsIcon
          icon={icon}
          size={18}
          color="currentColor"
          aria-hidden="true"
        />
      </Link>
    );

  return (
    <nav aria-label={labels.label} className="flex justify-center gap-1 pt-7">
      {arrow(page - 1, labels.previous, ArrowLeft01Icon)}
      {pages.map((target) => (
        <Link
          key={target}
          href={hrefFor(target)}
          aria-label={`${labels.page} ${target}`}
          aria-current={target === page ? 'page' : undefined}
          className={clsx(
            itemStyles,
            target === page
              ? 'bg-ink text-surface'
              : 'hover:border-line hover:bg-surface',
          )}
        >
          {target}
        </Link>
      ))}
      {arrow(page + 1, labels.next, ArrowRight01Icon)}
    </nav>
  );
}
