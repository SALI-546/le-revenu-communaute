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
import { memberHref } from '@/features/members/memberHref';
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
    <article className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-line py-6 pr-8 compact:py-4 sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-6 sm:py-7 sm:pr-12 sm:compact:py-5">
      <div
        className={clsx(
          'flex h-[50px] flex-col items-center justify-center rounded-lg border text-xs leading-tight text-ink-3 sm:size-[62px] sm:rounded-xl',
          bestReply
            ? 'border-success/40 bg-success-soft text-success'
            : replies.count === 0
              ? 'border-dashed border-brand/45'
              : 'border-line',
        )}
      >
        <strong
          className={clsx(
            'font-display text-xl sm:text-2xl',
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
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-semibold text-ink-2">
            <HugeiconsIcon
              icon={TYPE_ICONS[type]}
              size={12}
              color="currentColor"
              aria-hidden="true"
            />
            {dict.types[type]}
          </span>
          {bestReply && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
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
        <h3 className="font-display text-lg leading-snug font-bold text-balance text-heading sm:text-[22px]">
          <Link
            href={`/${locale}/discussions/${slug}`}
            className="after:absolute after:inset-0 hover:text-brand-text"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-2 mb-3 line-clamp-2 text-base leading-6 text-lede compact:hidden">
          {content}
        </p>
        <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-meta uppercase compact:mt-1.5">
          {author && (
            <>
              <Avatar name={author.username} size="sm" />
              <span>
                {dict.list.by}{' '}
                <Link
                  href={memberHref(locale, author.username)}
                  className="relative z-10 font-bold text-meta hover:text-brand-text hover:underline"
                >
                  {author.username}
                </Link>
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
