import { Avatar } from '@/components/ui/Avatar';
import type { Dictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries/config';
import { formatDate } from '@/lib/formatDate';
import { formatRelative } from '@/lib/formatRelative';
import { pluralize } from '@/lib/plural';
import type { DiscussionDetail } from '../types';

type DiscussionFactsProps = {
  discussion: DiscussionDetail;
  locale: Locale;
  now: number;
  labels: Dictionary['discussions']['detail']['rail'];
};

const MAX_AVATARS = 5;

export function DiscussionFacts({
  discussion,
  locale,
  now,
  labels,
}: DiscussionFactsProps) {
  const { author, replies, publishedAt } = discussion;
  const lastActivity = replies.at(-1)?.publishedAt ?? publishedAt;
  const participants = [
    ...new Set(
      [author, ...replies.map((reply) => reply.author)].flatMap((person) =>
        person ? [person.username] : [],
      ),
    ),
  ];

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="mb-4 text-sm font-bold text-ink">{labels.title}</h2>
      <dl className="grid grid-cols-2 gap-4">
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="text-xs text-ink-3">{labels.replies}</dt>
          <dd className="font-display text-2xl font-bold text-heading tabular-nums">
            {replies.length}
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="text-xs text-ink-3">{labels.lastActivity}</dt>
          <dd className="text-sm font-semibold text-ink">
            <time
              dateTime={lastActivity}
              title={formatDate(locale, lastActivity, {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            >
              {formatRelative(locale, lastActivity, now)}
            </time>
          </dd>
        </div>
        <div className="col-span-2 flex flex-col-reverse gap-2">
          <dt className="text-xs text-ink-3">
            {participants.length}{' '}
            {pluralize(locale, participants.length, labels.participantsCount)}
          </dt>
          <dd className="flex items-center">
            <span className="sr-only">{participants.join(', ')}</span>
            {participants.slice(0, MAX_AVATARS).map((name) => (
              <span
                key={name}
                title={name}
                className="-ml-1.5 rounded-full ring-2 ring-surface first:ml-0"
              >
                <Avatar name={name} size="sm" />
              </span>
            ))}
            {participants.length > MAX_AVATARS && (
              <span
                aria-hidden="true"
                className="ml-1.5 text-xs font-semibold text-ink-3"
              >
                +{participants.length - MAX_AVATARS}
              </span>
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}
