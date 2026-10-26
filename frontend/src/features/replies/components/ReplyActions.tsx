import Link from 'next/link';
import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { getDictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';
import { chooseBestReply } from '@/features/discussions/actions';
import type { Author, Reply } from '@/features/discussions/types';
import { getCurrentUser } from '@/lib/auth/dal';
import { toggleHelpful } from '../actions';
import { getMyHelpfulVotes } from '../queries';
import { HelpfulLabel } from './HelpfulLabel';
import { replyActionStyles } from './replyActionStyles';

type ReplyActionsProps = {
  reply: Reply;
  discussion: {
    documentId: string;
    slug: string;
    author: Author;
    bestReplyId?: string;
  };
  locale: Locale;
};

export async function ReplyActions({
  reply,
  discussion,
  locale,
}: ReplyActionsProps) {
  const [session, { replies: dict }] = await Promise.all([
    Promise.all([
      getCurrentUser(),
      getMyHelpfulVotes(discussion.documentId),
    ]).catch(() => null),
    getDictionary(),
  ]);
  const helpful = (
    <HelpfulLabel label={dict.helpful.label} count={reply.helpfulCount} />
  );

  // Strapi is unreachable: show the count without asking a signed-in member to log in.
  if (!session) {
    return <span className={replyActionStyles()}>{helpful}</span>;
  }

  const [user, votes] = session;
  const voted = votes.includes(reply.documentId);
  const isBest = discussion.bestReplyId === reply.documentId;

  if (!user) {
    const redirectTo = localizedHref(locale, `/discussions/${discussion.slug}`);
    return (
      <Link
        href={`${localizedHref(locale, '/login')}?${new URLSearchParams({ redirectTo })}`}
        title={dict.helpful.login}
        className={replyActionStyles()}
      >
        {helpful}
      </Link>
    );
  }

  const ownReply = reply.author?.username === user.username;
  const ownDiscussion = discussion.author?.username === user.username;

  return (
    <div className="flex flex-wrap gap-2">
      {ownReply ? (
        <span className={replyActionStyles()}>{helpful}</span>
      ) : (
        <form action={toggleHelpful.bind(null, reply.documentId)}>
          <SubmitButton pressed={voted} className={replyActionStyles(voted)}>
            {helpful}
          </SubmitButton>
        </form>
      )}
      {ownDiscussion && (
        <form
          action={chooseBestReply.bind(
            null,
            discussion.documentId,
            isBest ? null : reply.documentId,
          )}
        >
          <SubmitButton className={replyActionStyles(isBest)}>
            <HugeiconsIcon
              icon={CheckmarkBadge01Icon}
              size={16}
              color="currentColor"
              aria-hidden="true"
            />
            {isBest ? dict.best.clear : dict.best.choose}
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
