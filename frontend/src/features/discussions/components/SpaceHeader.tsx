import Link from 'next/link';
import clsx from 'clsx';
import {
  Add01Icon,
  ArrowLeft01Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SITE_URL,
  SITE_BAR_SECTIONS,
  SPACE_SECTIONS,
} from '@/components/layout/siteLinks';
import { buttonStyles } from '@/components/ui/buttonStyles';
import type { Dictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';
import { pluralize } from '@/lib/plural';
import { SPACE_COLORS } from '../spaceColors';
import type { Category, CommunityStats } from '../types';
import { SpaceIcon } from './SpaceIcon';

type SpaceHeaderProps = {
  category: Category;
  stats: CommunityStats;
  locale: Locale;
  labels: Dictionary['home']['space'];
  list: Dictionary['discussions']['list'];
  sections: Dictionary['layout']['pressBar']['sections'];
};

export function SpaceHeader({
  category,
  stats,
  locale,
  labels,
  list,
  sections,
}: SpaceHeaderProps) {
  const { slug, name, description, icon, color } = category;
  const number = new Intl.NumberFormat(locale);
  const sectionKey = SPACE_SECTIONS[slug];
  const section = SITE_BAR_SECTIONS.find(({ key }) => key === sectionKey);
  const figures = [
    `${number.format(stats.discussions)} ${pluralize(locale, stats.discussions, list.count)}`,
    `${number.format(stats.replies)} ${pluralize(locale, stats.replies, list.replies)}`,
    `${number.format(stats.answeredQuestions)}/${number.format(stats.questions)} ${labels.answered}`,
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <div aria-hidden="true" className={clsx('h-1.5', SPACE_COLORS[color])} />
      <div className="p-5 sm:p-7">
        <Link
          href={localizedHref(locale, '/spaces')}
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-ink-3 hover:text-ink"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={15}
            color="currentColor"
            aria-hidden="true"
          />
          {labels.back}
        </Link>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <SpaceIcon icon={icon} color={color} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-bold text-heading">
              {name}
            </h1>
            {description && (
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-2">
                {description}
              </p>
            )}
            <ul className="mt-4 flex flex-wrap gap-2">
              {figures.map((figure) => (
                <li
                  key={figure}
                  className="rounded-full bg-surface-2 px-3 py-1 text-sm font-semibold text-ink-2 tabular-nums"
                >
                  {figure}
                </li>
              ))}
            </ul>
            {section && (
              <a
                href={`${SITE_URL}${section.path}`}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-text hover:underline"
              >
                <HugeiconsIcon
                  icon={LinkSquare02Icon}
                  size={16}
                  color="currentColor"
                  aria-hidden="true"
                />
                {labels.siteLink.replace('{section}', sections[section.key])}
              </a>
            )}
          </div>
          <Link
            href={`${localizedHref(locale, '/discussions/new')}?${new URLSearchParams({ category: slug })}`}
            className={buttonStyles({ className: 'flex-none' })}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={17}
              color="currentColor"
              aria-hidden="true"
            />
            {labels.publish}
          </Link>
        </div>
      </div>
    </section>
  );
}
