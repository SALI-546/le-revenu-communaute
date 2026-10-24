'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import {
  Book02Icon,
  DashboardSquare01Icon,
  Home01Icon,
  LinkSquare02Icon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { SpaceIcon } from '@/features/discussions/components/SpaceIcon';
import type { CategorySummary } from '@/features/discussions/types';
import { SITE_URL } from './siteLinks';

type SidebarNavProps = {
  locale: string;
  spaces: Omit<CategorySummary, 'documentId'>[];
  labels: Dictionary['layout']['sidebar'];
  trust: Dictionary['discussions']['list']['trust'];
};

const linkStyles = (active: boolean) =>
  clsx(
    'flex min-h-10 items-center gap-3 rounded-lg px-2.5 text-sm',
    active
      ? 'bg-surface font-semibold text-heading shadow-sm'
      : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
  );

export function SidebarNav({ locale, spaces, labels, trust }: SidebarNavProps) {
  const pathname = usePathname();
  const category = useSearchParams().get('category');
  const home = `/${locale}`;
  const main = [
    {
      href: home,
      label: labels.home,
      icon: Home01Icon,
      active: pathname === home && !category,
    },
    {
      href: `${home}/spaces`,
      label: labels.spaces,
      icon: DashboardSquare01Icon,
      active: pathname === `${home}/spaces`,
    },
    {
      href: `${home}/charter`,
      label: labels.charter,
      icon: Book02Icon,
      active: pathname === `${home}/charter`,
    },
  ];

  return (
    <nav aria-label={labels.label} className="grid gap-0.5">
      {main.map(({ href, label, icon, active }) => (
        <Link
          key={href}
          href={href}
          aria-current={active ? 'page' : undefined}
          className={linkStyles(active)}
        >
          <HugeiconsIcon
            icon={icon}
            size={19}
            color="currentColor"
            aria-hidden="true"
          />
          {label}
        </Link>
      ))}
      <p className="px-2.5 pt-5 pb-1.5 text-xs font-semibold text-ink-3">
        {labels.spacesTitle}
      </p>
      {spaces.map(({ slug, name, icon, color }) => {
        const active = category === slug;
        return (
          <Link
            key={slug}
            href={`${home}?${new URLSearchParams({ category: slug })}`}
            aria-current={active ? 'page' : undefined}
            className={linkStyles(active)}
          >
            <SpaceIcon icon={icon} color={color} />
            {name}
          </Link>
        );
      })}
      <a
        href={SITE_URL}
        className="mt-5 flex min-h-10 items-center gap-2 border-t border-line px-2.5 pt-3 text-xs text-ink-3 hover:text-brand-text"
      >
        {labels.backToSite}
        <HugeiconsIcon
          icon={LinkSquare02Icon}
          size={14}
          color="currentColor"
          aria-hidden="true"
          className="ml-auto"
        />
      </a>
      <p className="mt-3 flex gap-2.5 px-2.5 text-xs leading-relaxed text-ink-3">
        <HugeiconsIcon
          icon={SecurityCheckIcon}
          size={18}
          color="currentColor"
          aria-hidden="true"
          className="flex-none text-success"
        />
        <span>
          <strong className="block text-ink-2">{trust.title}</strong>
          {trust.description}
        </span>
      </p>
    </nav>
  );
}
