import Link from 'next/link';
import { SecurityCheckIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';

type CharterCardProps = {
  labels: Dictionary['home']['aside']['charter'];
  locale: Locale;
};

export function CharterCard({ labels, locale }: CharterCardProps) {
  return (
    <section className="rounded-xl border border-line bg-surface-2 p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
        <HugeiconsIcon
          icon={SecurityCheckIcon}
          size={18}
          color="currentColor"
          aria-hidden="true"
          className="text-success"
        />
        {labels.title}
      </h2>
      <ol className="mt-3 grid gap-2">
        {labels.points.map((point, index) => (
          <li key={point} className="flex gap-2.5 text-xs text-ink-2">
            <span className="grid size-5 flex-none place-items-center rounded-full bg-surface text-[10px] font-bold text-ink">
              {index + 1}
            </span>
            {point}
          </li>
        ))}
      </ol>
      <Link
        href={localizedHref(locale, '/charter')}
        className="mt-2 inline-flex min-h-11 items-center text-xs font-bold text-brand-text hover:underline"
      >
        {labels.link}
      </Link>
    </section>
  );
}
