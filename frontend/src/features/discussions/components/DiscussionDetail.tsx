import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  ArrowRight01Icon,
  Home01Icon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { ReplyComposer } from '@/features/replies/components/ReplyComposer';
import { ReplyItem } from '@/features/replies/components/ReplyItem';
import { formatDate } from '@/lib/formatDate';
import { pluralize } from '@/lib/plural';
import { listHref } from '../listHref';
import { getDiscussion } from '../queries';

type DiscussionDetailProps = { params: Promise<{ slug: string }> };

const cardStyles = 'rounded-xl border border-line bg-surface p-5 shadow-sm';

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
  const published = detail.publishedAt
    .replace(
      '{date}',
      formatDate(locale, publishedAt, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    )
    .replace(
      '{time}',
      formatDate(locale, publishedAt, { hour: '2-digit', minute: '2-digit' }),
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
                <HugeiconsIcon
                  icon={Home01Icon}
                  size={17}
                  color="currentColor"
                  aria-hidden="true"
                />
                <span className="sr-only">{detail.home}</span>
              </Link>
            </li>
            {category && (
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
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
        <article className="rounded-xl border border-line bg-glass-strong p-[clamp(1.375rem,4vw,2.875rem)] shadow-sm">
          <p className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold">
            {category && (
              <Link
                href={listHref(locale, { category: category.slug })}
                className="inline-flex min-h-8 items-center rounded-full border border-ink-2 px-3 font-semibold text-ink-2 hover:border-brand hover:text-brand-text"
              >
                {category.name}
              </Link>
            )}
            <span className="rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">
              {types[type]}
            </span>
          </p>
          <h1 className="mb-6 max-w-3xl font-display text-[31px] leading-[1.1] font-bold tracking-[-0.02em] text-heading sm:text-[clamp(1.875rem,4vw,2.875rem)]">
            {title}
          </h1>
          {author && (
            <div className="flex items-center gap-3">
              <Avatar name={author.username} size="lg" />
              <div className="grid">
                <strong className="text-sm text-ink">{author.username}</strong>
                <time dateTime={publishedAt} className="text-xs text-ink-3">
                  {published}
                </time>
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
            className="mb-1 font-display text-[23px] font-bold text-heading"
          >
            {replies.length} {pluralize(locale, replies.length, list.replies)}
          </h2>
          {replies.length === 0 && (
            <p className="text-sm text-ink-3">{detail.repliesEmpty}</p>
          )}
          {replies.map((reply) => (
            <ReplyItem key={reply.documentId} reply={reply} locale={locale} />
          ))}
          <Suspense
            fallback={
              <div className="h-48 animate-pulse rounded-xl bg-surface-2" />
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
          <h2 className="mb-3 font-display text-[17px] font-bold text-heading">
            {detail.rail.title}
          </h2>
          <p className="text-xs text-ink-3">
            <strong className="mr-1.5 font-display text-lg text-heading">
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
            <h2 className="mt-1 mb-3 font-display text-[17px] font-bold text-heading">
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
            <h2 className="mb-1 font-display text-[17px] font-bold text-heading">
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
