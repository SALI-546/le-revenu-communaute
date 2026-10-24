import Link from 'next/link';
import clsx from 'clsx';
import { ArrowRight01Icon, Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import type { Dictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries/config';
import type { DiscussionSummary } from '../types';

type DiscussionCardProps = {
  discussion: DiscussionSummary;
  locale: Locale;
  dict: Dictionary['discussions'];
};

export function DiscussionCard({
  discussion,
  locale,
  dict,
}: DiscussionCardProps) {
  const { title, slug, type, content, publishedAt, author, category, replies } =
    discussion;
  const replyLabel =
    dict.list.replies[
      new Intl.PluralRules(locale).select(replies.count) === 'one'
        ? 'one'
        : 'other'
    ];
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
    new Date(publishedAt),
  );

  return (
    <article className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-line py-5 pr-8 pl-3 transition-colors hover:bg-surface sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-5 sm:py-6 sm:pr-12 sm:pl-5">
      <div
        className={clsx(
          'flex h-[50px] flex-col items-center justify-center rounded-[9px] border text-[9px] leading-tight text-ink-3 sm:size-[62px] sm:rounded-xl',
          replies.count === 0 ? 'border-dashed border-brand/45' : 'border-line',
        )}
      >
        <strong className="font-display text-[17px] text-ink sm:text-[21px]">
          {replies.count}
        </strong>
        <span>{replyLabel}</span>
      </div>
      <div className="min-w-0">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] text-ink-3">
          {category && (
            <span className="font-bold text-brand-text">{category.name}</span>
          )}
          <span aria-hidden="true">·</span>
          <span>{dict.types[type]}</span>
        </p>
        <h3 className="font-display text-base leading-snug font-bold text-ink sm:text-lg">
          <Link
            href={`/${locale}/discussions/${slug}`}
            className="after:absolute after:inset-0 hover:text-brand-text"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 mb-3 line-clamp-2 text-xs leading-relaxed text-ink-3">
          {content}
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-ink-3">
          {author && (
            <>
              <Avatar name={author.username} size="sm" />
              <span>
                {dict.list.by}{' '}
                <strong className="font-semibold text-ink-2">
                  {author.username}
                </strong>
              </span>
              <span aria-hidden="true" className="mx-1 h-3 w-px bg-line" />
            </>
          )}
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={14}
            color="currentColor"
            aria-hidden="true"
          />
          <time dateTime={publishedAt}>{date}</time>
        </p>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={20}
        color="currentColor"
        aria-hidden="true"
        className="absolute top-1/2 right-2 -translate-y-1/2 text-line-strong sm:right-4"
      />
    </article>
  );
}
