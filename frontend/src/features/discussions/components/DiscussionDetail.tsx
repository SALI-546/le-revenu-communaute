import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  ArrowRight01Icon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { ReplyComposer } from '@/features/replies/components/ReplyComposer';
import { ReplyItem } from '@/features/replies/components/ReplyItem';
import { listHref } from '../listHref';
import { getDiscussion } from '../queries';

type DiscussionDetailProps = { params: Promise<{ slug: string }> };

const cardStyles =
  'rounded-[14px] border border-line bg-glass-strong p-5 shadow-sm';

export async function DiscussionDetail({ params }: DiscussionDetailProps) {
  const { slug } = await params;
  const [discussion, dict, locale] = await Promise.all([
    getDiscussion(slug),
    getDictionary(),
    getLocale(),
  ]);
  if (!discussion) {
    notFound();
  }

  const { list, detail, types } = dict.discussions;
  const { title, content, type, publishedAt, author, category, replies } =
    discussion;
  const plural =
    new Intl.PluralRules(locale).select(replies.length) === 'one'
      ? 'one'
      : 'other';
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
    new Date(publishedAt),
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_286px]">
      <div className="min-w-0">
        <nav aria-label={detail.breadcrumb} className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-3">
            <li>
              <Link
                href={localizedHref(locale)}
                className="inline-flex min-h-8 items-center hover:text-ink"
              >
                {detail.home}
              </Link>
            </li>
            {category && (
              <li className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  color="currentColor"
                  aria-hidden="true"
                />
                <Link
                  href={listHref(locale, { category: category.slug })}
                  className="inline-flex min-h-8 items-center hover:text-ink"
                >
                  {category.name}
                </Link>
              </li>
            )}
          </ol>
        </nav>
        <article className="rounded-2xl border border-line bg-glass-strong p-[clamp(1.375rem,4vw,2.875rem)] shadow-sm">
          <p className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold">
            {category && (
              <span className="text-brand-text">{category.name}</span>
            )}
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-ink-2">
              {types[type]}
            </span>
          </p>
          <h1 className="mb-6 max-w-3xl font-display text-[31px] leading-[1.1] font-bold tracking-[-0.02em] text-ink sm:text-[clamp(1.875rem,4vw,2.875rem)]">
            {title}
          </h1>
          {author && (
            <div className="flex items-center gap-3">
              <Avatar name={author.username} size="lg" />
              <div className="grid">
                <strong className="text-sm text-ink">{author.username}</strong>
                <span className="text-xs text-ink-3">
                  {detail.publishedOn}{' '}
                  <time dateTime={publishedAt}>{date}</time>
                </span>
              </div>
            </div>
          )}
          <p className="mt-8 text-[15px] leading-[1.8] whitespace-pre-line text-ink-2">
            {content}
          </p>
        </article>
        <section aria-labelledby="replies-title" className="mt-10 grid gap-3">
          <h2
            id="replies-title"
            className="mb-1 font-display text-[23px] font-bold text-ink"
          >
            {replies.length} {list.replies[plural]}
          </h2>
          {replies.length === 0 && (
            <p className="text-sm text-ink-3">{detail.repliesEmpty}</p>
          )}
          {replies.map((reply) => (
            <ReplyItem key={reply.documentId} reply={reply} locale={locale} />
          ))}
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-[13px] bg-surface-2" />
            }
          >
            <ReplyComposer
              discussionId={discussion.documentId}
              slug={discussion.slug}
            />
          </Suspense>
        </section>
      </div>
      <aside className="grid gap-3.5 self-start md:grid-cols-2 xl:sticky xl:top-6 xl:grid-cols-1">
        <section className={cardStyles}>
          <h2 className="mb-3 font-display text-[17px] font-bold text-ink">
            {detail.rail.title}
          </h2>
          <p className="text-xs text-ink-3">
            <strong className="mr-1.5 font-display text-lg text-ink">
              {replies.length}
            </strong>
            {detail.rail.replies}
          </p>
        </section>
        {category && (
          <section className={cardStyles}>
            <p className="text-[10px] tracking-widest text-ink-3 uppercase">
              {detail.rail.category}
            </p>
            <h2 className="mt-1 mb-3 font-display text-[17px] font-bold text-ink">
              {category.name}
            </h2>
            <Link
              href={listHref(locale, { category: category.slug })}
              className="inline-flex min-h-8 items-center gap-1.5 text-xs font-bold text-brand-text"
            >
              {detail.rail.seeAll}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={15}
                color="currentColor"
                aria-hidden="true"
              />
            </Link>
          </section>
        )}
        <section
          className={`${cardStyles} flex gap-3 md:col-span-2 xl:col-span-1`}
        >
          <HugeiconsIcon
            icon={SecurityCheckIcon}
            size={20}
            color="currentColor"
            aria-hidden="true"
            className="flex-none text-success"
          />
          <div>
            <h2 className="mb-1 font-display text-[17px] font-bold text-ink">
              {detail.rail.guidelinesTitle}
            </h2>
            <p className="text-xs leading-relaxed text-ink-3">
              {detail.rail.guidelines}
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
}
