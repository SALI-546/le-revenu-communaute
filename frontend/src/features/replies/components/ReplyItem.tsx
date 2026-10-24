import { Avatar } from '@/components/ui/Avatar';
import type { Locale } from '@/dictionaries/config';
import type { Reply } from '@/features/discussions/types';
import { formatDate } from '@/lib/formatDate';

type ReplyItemProps = { reply: Reply; locale: Locale };

export function ReplyItem({ reply, locale }: ReplyItemProps) {
  const date = formatDate(locale, reply.publishedAt, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <article className="rounded-xl border border-line bg-glass-strong px-5 py-6 sm:px-8 sm:py-8">
      {reply.author && (
        <div className="flex items-center gap-3">
          <Avatar name={reply.author.username} />
          <div className="grid">
            <strong className="text-sm text-ink">
              {reply.author.username}
            </strong>
            <time dateTime={reply.publishedAt} className="text-xs text-ink-3">
              {date}
            </time>
          </div>
        </div>
      )}
      <p className="mt-5 text-sm leading-7 whitespace-pre-line text-ink-2">
        {reply.content}
      </p>
    </article>
  );
}
