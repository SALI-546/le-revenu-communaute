import Link from 'next/link';
import clsx from 'clsx';
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import type { Dictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries/config';
import { formatDate } from '@/lib/formatDate';
import { pluralize } from '@/lib/plural';
import { TYPE_ICONS } from '../typeIcons';
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
  const {
    title,
    slug,
    type,
    content,
    publishedAt,
    author,
    category,
    replies,
    bestReply,
  } = discussion;
  const replyLabel = pluralize(locale, replies.count, dict.list.replies);
  const date = formatDate(locale, publishedAt, { dateStyle: 'medium' });

  return (
    <article className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-line py-5 pr-8 pl-3 transition-colors last:border-b-0 hover:bg-surface-2 compact:py-3.5 sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-5 sm:py-6 sm:pr-12 sm:pl-5 sm:compact:py-4">
      <div
        className={clsx(
          'flex h-[50px] flex-col items-center justify-center rounded-lg border text-[9px] leading-tight text-ink-3 sm:size-[62px] sm:rounded-xl',
          bestReply
            ? 'border-success/40 bg-success-soft text-success'
            : replies.count === 0
              ? 'border-dashed border-brand/45'
              : 'border-line',
        )}
      >
        <strong
          className={clsx(
            'font-display text-[17px] sm:text-[21px]',
            bestReply ? 'text-success' : 'text-heading',
          )}
        >
          {replies.count}
        </strong>
        <span>{replyLabel}</span>
      </div>
      <div className="min-w-0">
        <p className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
          {category && (
            <span className="font-bold tracking-[0.12em] text-brand-text uppercase">
              {category.name}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">
            <HugeiconsIcon
              icon={TYPE_ICONS[type]}
              size={12}
              color="currentColor"
              aria-hidden="true"
            />
            {dict.types[type]}
          </span>
          {bestReply && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-success">
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                size={12}
                color="currentColor"
                aria-hidden="true"
              />
              {dict.list.solved}
            </span>
          )}
        </p>
        <h3 className="font-display text-base leading-snug font-bold text-heading sm:text-lg">
          <Link
            href={`/${locale}/discussions/${slug}`}
            className="after:absolute after:inset-0 hover:text-brand-text"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 mb-3 line-clamp-2 text-xs leading-relaxed text-ink-3 compact:hidden">
          {content}
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-ink-3 compact:mt-1.5">
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
