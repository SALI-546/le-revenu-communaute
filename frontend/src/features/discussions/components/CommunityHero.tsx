import Link from 'next/link';
import {
  Add01Icon,
  DashboardSquare01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import type { Dictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';
import { pluralize } from '@/lib/plural';
import type { CommunityStats } from '../types';

type CommunityHeroProps = {
  hero: Dictionary['home']['hero'];
  list: Dictionary['discussions']['list'];
  stats: CommunityStats;
  spaces: number;
  locale: Locale;
};

export function CommunityHero({
  hero,
  list,
  stats,
  spaces,
  locale,
}: CommunityHeroProps) {
  const number = new Intl.NumberFormat(locale);
  const answered = stats.questions
    ? stats.answeredQuestions / stats.questions
    : 0;
  const figures = [
    {
      value: number.format(stats.discussions),
      label: pluralize(locale, stats.discussions, list.count),
    },
    {
      value: number.format(stats.replies),
      label: pluralize(locale, stats.replies, list.replies),
    },
    {
      value: new Intl.NumberFormat(locale, { style: 'percent' }).format(
        answered,
      ),
      label: hero.stats.answered,
    },
    {
      value: number.format(spaces),
      label: pluralize(locale, spaces, hero.stats.spaces),
    },
  ];

  return (
    <section className="relative isolate overflow-hidden rounded-xl bg-linear-to-br from-hero-2 via-hero to-hero text-on-hero shadow-lg">
      <div
        aria-hidden="true"
        className="absolute -top-28 -right-20 -z-10 size-80 rounded-full bg-brand/30 blur-3xl"
      />
      <div className="px-5 pt-8 pb-7 sm:px-8 lg:pt-10">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.11em] text-hero-accent uppercase">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={15}
            color="currentColor"
            aria-hidden="true"
          />
          {hero.eyebrow}
        </p>
        <h1 className="mb-4 max-w-3xl font-display text-4xl leading-[1.03] font-bold tracking-[-0.03em] lg:text-[clamp(2.25rem,3.4vw,3.25rem)]">
          {hero.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-hero-ink lg:text-lg">
          {hero.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
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
            {hero.ask}
          </Link>
          <Link
            href={localizedHref(locale, '/spaces')}
            className={buttonStyles({ variant: 'onHero' })}
          >
            <HugeiconsIcon
              icon={DashboardSquare01Icon}
              size={17}
              color="currentColor"
              aria-hidden="true"
            />
            {hero.explore}
          </Link>
        </div>
      </div>
      <dl
        aria-label={hero.stats.label}
        className="grid grid-cols-2 border-t border-on-hero/10 bg-on-hero/5 sm:grid-cols-4"
      >
        {figures.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col-reverse justify-end gap-0.5 border-on-hero/10 px-5 py-4 max-sm:nth-[-n+2]:border-b max-sm:odd:border-r sm:px-8 sm:not-last:border-r"
          >
            <dt className="text-sm leading-snug text-hero-ink">{label}</dt>
            <dd className="font-display text-2xl font-bold tabular-nums sm:text-[28px]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
