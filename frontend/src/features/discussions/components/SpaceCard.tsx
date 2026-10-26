import Link from 'next/link';
import {
  Add01Icon,
  ArrowRight01Icon,
  LinkSquare02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  SITE_BAR_SECTIONS,
  SITE_URL,
  SPACE_SECTIONS,
} from '@/components/layout/siteLinks';
import { buttonStyles } from '@/components/ui/buttonStyles';
import type { Dictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';
import { listHref } from '../listHref';
import type { Category } from '../types';
import { SpaceIcon } from './SpaceIcon';

type SpaceCardProps = {
  category: Category;
  locale: Locale;
  labels: Dictionary['discussions']['detail']['rail'];
  siteLink: Dictionary['home']['space']['siteLink'];
  sections: Dictionary['layout']['pressBar']['sections'];
};

export function SpaceCard({
  category,
  locale,
  labels,
  siteLink,
  sections,
}: SpaceCardProps) {
  const { slug, name, description, icon, color } = category;
  const section = SITE_BAR_SECTIONS.find(
    ({ key }) => key === SPACE_SECTIONS[slug],
  );

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <p className="mb-3 text-xs font-bold tracking-widest text-ink-3 uppercase">
        {labels.space}
      </p>
      <div className="flex items-center gap-3">
        <SpaceIcon icon={icon} color={color} size="md" />
        <h2 className="font-display text-lg leading-tight font-bold text-heading">
          {name}
        </h2>
      </div>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{description}</p>
      )}
      <Link
        href={`${localizedHref(locale, '/discussions/new')}?${new URLSearchParams({ category: slug })}`}
        className={buttonStyles({
          variant: 'secondary',
          block: true,
          className: 'mt-4',
        })}
      >
        <HugeiconsIcon
          icon={Add01Icon}
          size={16}
          color="currentColor"
          aria-hidden="true"
        />
        {labels.publishHere}
      </Link>
      <div className="mt-2 grid">
        <Link
          href={listHref(locale, { category: slug })}
          className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-ink-2 hover:text-ink"
        >
          {labels.seeAll}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={14}
            color="currentColor"
            aria-hidden="true"
          />
        </Link>
        {section && (
          <a
            href={`${SITE_URL}${section.path}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-brand-text hover:underline"
          >
            <HugeiconsIcon
              icon={LinkSquare02Icon}
              size={14}
              color="currentColor"
              aria-hidden="true"
            />
            {siteLink.replace('{section}', sections[section.key])}
          </a>
        )}
      </div>
    </section>
  );
}
