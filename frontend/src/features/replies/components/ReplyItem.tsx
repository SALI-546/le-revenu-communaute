import type { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import type { Locale } from '@/dictionaries/config';
import type { Reply } from '@/features/discussions/types';
import { memberHref } from '@/features/members/memberHref';
import { formatDate } from '@/lib/formatDate';

type ReplyItemProps = {
  reply: Reply;
  locale: Locale;
  authorBadge?: string;
  bestBadge?: string;
  actions?: ReactNode;
};

export function ReplyItem({
  reply,
  locale,
  authorBadge,
  bestBadge,
  actions,
}: ReplyItemProps) {
  const date = formatDate(locale, reply.publishedAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <article
      id={`reply-${reply.documentId}`}
      className={clsx(
        'scroll-mt-28 rounded-xl border bg-glass-strong px-5 py-6 sm:px-8 sm:py-8',
        bestBadge ? 'border-success/60 ring-1 ring-success/30' : 'border-line',
      )}
    >
      {bestBadge && (
        <p className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-success">
          <HugeiconsIcon
            icon={CheckmarkBadge01Icon}
            size={16}
            color="currentColor"
            aria-hidden="true"
          />
          {bestBadge}
        </p>
      )}
      {reply.author && (
        <div className="flex items-center gap-3">
          <Avatar name={reply.author.username} />
          <div className="grid">
            <p className="flex items-center gap-2">
              <Link
                href={memberHref(locale, reply.author.username)}
                className="text-sm font-bold text-ink hover:text-brand-text hover:underline"
              >
                {reply.author.username}
              </Link>
              {authorBadge && (
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand-text">
                  {authorBadge}
                </span>
              )}
            </p>
            <time dateTime={reply.publishedAt} className="text-xs text-ink-3">
              {date}
            </time>
          </div>
        </div>
      )}
      <p className="mt-5 text-sm leading-7 whitespace-pre-line text-ink-2">
        {reply.content}
      </p>
      {actions && <div className="mt-5">{actions}</div>}
    </article>
  );
}
