import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import clsx from 'clsx';
import {
  ArrowTurnBackwardIcon,
  CheckmarkBadge01Icon,
  Home01Icon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { HelpfulLabel } from '@/features/replies/components/HelpfulLabel';
import { ReplyActions } from '@/features/replies/components/ReplyActions';
import { ReplyComposer } from '@/features/replies/components/ReplyComposer';
import { ReplyItem } from '@/features/replies/components/ReplyItem';
import { replyActionStyles } from '@/features/replies/components/replyActionStyles';
import { memberHref } from '@/features/members/memberHref';
import { formatDate } from '@/lib/formatDate';
import { pluralize } from '@/lib/plural';
import { requestTime } from '@/lib/requestTime';
import { listHref } from '../listHref';
import { getCategories, getDiscussion } from '../queries';
import { TYPE_ICONS } from '../typeIcons';
import { CopyLinkButton } from './CopyLinkButton';
import { DiscussionFacts } from './DiscussionFacts';
import { RelatedDiscussions } from './RelatedDiscussions';
import { SpaceCard } from './SpaceCard';

type DiscussionDetailProps = { params: Promise<{ slug: string }> };

const actionStyles =
  'inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-ink-2 transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-ink';

export async function DiscussionDetail({ params }: DiscussionDetailProps) {
  const { slug } = await params;
  const [discussion, categories, dict, locale, now] = await Promise.all([
    getDiscussion(slug),
    getCategories(),
    getDictionary(),
    getLocale(),
    requestTime(),
  ]);
  if (!discussion) {
    notFound();
  }

  const { list, detail, types } = dict.discussions;
  const {
    title,
    content,
    type,
    publishedAt,
    author,
    category,
    replies,
    bestReply,
  } = discussion;
  const best = replies.find(
    ({ documentId }) => documentId === bestReply?.documentId,
  );
  const space = categories.find(({ slug }) => slug === category?.slug);
  const status = best
    ? 'solved'
    : replies.length === 0
      ? 'waiting'
      : type === 'question'
        ? 'answered'
        : undefined;
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
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
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
        <article className="border-b border-line pb-10">
          <p className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold">
            {category && (
              <Link
                href={listHref(locale, { category: category.slug })}
                className="inline-flex min-h-8 items-center rounded-full border border-ink-2 px-3 font-semibold text-ink-2 hover:border-brand hover:text-brand-text"
              >
                {category.name}
              </Link>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-ink-2">
              <HugeiconsIcon
                icon={TYPE_ICONS[type]}
                size={13}
                color="currentColor"
                aria-hidden="true"
              />
              {types[type]}
            </span>
            {status && (
              <span
                className={clsx(
                  'rounded-full px-2.5 py-1',
                  status === 'waiting'
                    ? 'bg-brand-soft text-brand-text'
                    : 'bg-success-soft text-success',
                )}
              >
                {detail.status[status]}
              </span>
            )}
          </p>
          <h1 className="mb-6 max-w-3xl font-display text-balance text-[31px] leading-[1.1] font-bold tracking-[-0.02em] text-heading sm:text-[clamp(1.875rem,4vw,2.875rem)]">
            {title}
          </h1>
          {author && (
            <div className="flex items-center gap-3">
              <Avatar name={author.username} size="lg" />
              <div className="grid">
                <Link
                  href={memberHref(locale, author.username)}
                  className="text-sm font-bold text-ink hover:text-brand-text hover:underline"
                >
                  {author.username}
                </Link>
                <time dateTime={publishedAt} className="text-sm text-meta">
                  {published}
                </time>
              </div>
            </div>
          )}
          <p className="mt-8 text-base leading-[1.7] whitespace-pre-line text-ink-2 sm:text-[17px]">
            {content}
          </p>
          <div
            role="group"
            aria-label={detail.actions.label}
            className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5"
          >
            <a href="#reply" className={actionStyles}>
              <HugeiconsIcon
                icon={ArrowTurnBackwardIcon}
                size={16}
                color="currentColor"
                aria-hidden="true"
              />
              {detail.actions.reply}
            </a>
            <CopyLinkButton labels={detail.actions} className={actionStyles} />
          </div>
        </article>
        <section aria-labelledby="replies-title" className="mt-10 grid gap-3">
          <h2
            id="replies-title"
            className="mb-1 font-display text-2xl sm:text-[30px] font-bold text-heading"
          >
            {replies.length} {pluralize(locale, replies.length, list.replies)}
          </h2>
          {replies.length === 0 && (
            <p className="text-base text-ink-3">{detail.repliesEmpty}</p>
          )}
          {best?.author && (
            <a
              href={`#reply-${best.documentId}`}
              className="group mb-2 flex gap-3 rounded-xl border border-success/40 bg-success-soft p-4 sm:p-5"
            >
              <HugeiconsIcon
                icon={CheckmarkBadge01Icon}
                size={20}
                color="currentColor"
                aria-hidden="true"
                className="flex-none text-success"
              />
              <span className="grid gap-1">
                <strong className="text-sm text-success">
                  {dict.replies.best.summary.replace(
                    '{name}',
                    best.author.username,
                  )}
                </strong>
                <span className="line-clamp-2 text-base text-ink-2">
                  {best.content}
                </span>
                <span className="text-xs font-bold text-success group-hover:underline">
                  {dict.replies.best.jump}
                </span>
              </span>
            </a>
          )}
          {replies.map((reply) => (
            <ReplyItem
              key={reply.documentId}
              reply={reply}
              locale={locale}
              authorBadge={
                author && reply.author?.username === author.username
                  ? detail.authorBadge
                  : undefined
              }
              bestBadge={reply === best ? dict.replies.best.badge : undefined}
              actions={
                <Suspense
                  fallback={
                    <span className={replyActionStyles()}>
                      <HelpfulLabel
                        label={dict.replies.helpful.label}
                        count={reply.helpfulCount}
                      />
                    </span>
                  }
                >
                  <ReplyActions
                    reply={reply}
                    discussion={{
                      documentId: discussion.documentId,
                      slug: discussion.slug,
                      author,
                      bestReplyId: best?.documentId,
                    }}
                    locale={locale}
                  />
                </Suspense>
              }
            />
          ))}
          <div id="reply" className="scroll-mt-28">
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
          </div>
        </section>
        <RelatedDiscussions slug={discussion.slug} category={category} />
      </div>
      <aside className="grid content-start gap-4 sm:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1 xl:self-start">
        <DiscussionFacts
          discussion={discussion}
          locale={locale}
          now={now}
          labels={detail.rail}
        />
        {space && (
          <SpaceCard
            category={space}
            locale={locale}
            labels={detail.rail}
            siteLink={dict.home.space.siteLink}
            sections={dict.layout.pressBar.sections}
          />
        )}
        <section className="flex gap-3 rounded-xl border border-line bg-surface-2 p-5 sm:col-span-2 xl:col-span-1">
          <HugeiconsIcon
            icon={SecurityCheckIcon}
            size={20}
            color="currentColor"
            aria-hidden="true"
            className="flex-none text-success"
          />
          <div>
            <h2 className="mb-1 text-sm font-bold text-ink">
              {detail.rail.guidelinesTitle}
            </h2>
            <p className="text-sm leading-relaxed text-ink-3">
              {detail.rail.guidelines}
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
}
