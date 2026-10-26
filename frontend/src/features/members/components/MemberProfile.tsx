import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { DiscussionCard } from '@/features/discussions/components/DiscussionCard';
import { formatDate } from '@/lib/formatDate';
import { pluralize } from '@/lib/plural';
import { decodeUsername } from '../decodeUsername';
import { getMember } from '../queries';

type MemberProfileProps = { params: Promise<{ username: string }> };

const STATS = ['discussions', 'replies', 'helpful', 'bestAnswers'] as const;

export async function MemberProfile({ params }: MemberProfileProps) {
  const username = decodeUsername((await params).username);
  const [member, dict, locale] = await Promise.all([
    username ? getMember(username) : null,
    getDictionary(),
    getLocale(),
  ]);
  if (!member) {
    notFound();
  }
  const { members } = dict;
  const number = new Intl.NumberFormat(locale);

  return (
    <div className="grid gap-10">
      <section className="rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <Avatar name={member.username} size="lg" />
          <div>
            <h1 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-bold text-heading">
              {member.username}
            </h1>
            <p className="text-sm text-ink-3">
              {members.since.replace(
                '{date}',
                formatDate(locale, member.memberSince, {
                  month: 'long',
                  year: 'numeric',
                }),
              )}
            </p>
          </div>
        </div>
        <dl
          aria-label={members.stats.label.replace('{name}', member.username)}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat}
              className="flex flex-col-reverse justify-end gap-0.5 rounded-lg bg-surface-2 p-4"
            >
              <dt className="text-xs leading-snug text-ink-3">
                {pluralize(locale, member.stats[stat], members.stats[stat])}
              </dt>
              <dd className="font-display text-2xl font-bold text-heading tabular-nums">
                {number.format(member.stats[stat])}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="member-discussions">
        <h2
          id="member-discussions"
          className="mb-4 font-display text-[23px] font-bold text-heading"
        >
          {members.discussions.title}
        </h2>
        {member.discussions.length === 0 ? (
          <p className="text-sm text-ink-3">{members.discussions.empty}</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
            {member.discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.documentId}
                discussion={discussion}
                locale={locale}
                dict={dict.discussions}
              />
            ))}
          </div>
        )}
      </section>
      <section aria-labelledby="member-replies">
        <h2
          id="member-replies"
          className="mb-4 font-display text-[23px] font-bold text-heading"
        >
          {members.replies.title}
        </h2>
        {member.replies.length === 0 ? (
          <p className="text-sm text-ink-3">{members.replies.empty}</p>
        ) : (
          <ul className="grid gap-3">
            {member.replies.map((reply) => (
              <li
                key={reply.documentId}
                className="rounded-xl border border-line bg-surface p-5 shadow-sm"
              >
                {reply.discussion && (
                  <p className="mb-2 text-xs text-ink-3">
                    {members.replies.in}{' '}
                    <Link
                      href={`${localizedHref(locale, `/discussions/${reply.discussion.slug}`)}#reply-${reply.documentId}`}
                      className="font-display text-sm font-bold text-heading hover:text-brand-text"
                    >
                      {reply.discussion.title}
                    </Link>
                  </p>
                )}
                <p className="line-clamp-3 text-sm leading-relaxed text-ink-2">
                  {reply.content}
                </p>
                <p className="mt-3 flex items-center gap-3 text-xs text-ink-3">
                  <time dateTime={reply.publishedAt}>
                    {formatDate(locale, reply.publishedAt, {
                      dateStyle: 'medium',
                    })}
                  </time>
                  <span className="inline-flex items-center gap-1">
                    <HugeiconsIcon
                      icon={ThumbsUpIcon}
                      size={14}
                      color="currentColor"
                      aria-hidden="true"
                    />
                    {reply.helpfulCount}{' '}
                    <span className="sr-only">
                      {pluralize(
                        locale,
                        reply.helpfulCount,
                        members.stats.helpful,
                      )}
                    </span>
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
