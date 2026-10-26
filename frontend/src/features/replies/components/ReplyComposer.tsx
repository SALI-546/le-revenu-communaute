import Link from 'next/link';
import { LockIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { getCurrentUser } from '@/lib/auth/dal';
import { ReplyForm } from './ReplyForm';

type ReplyComposerProps = { discussionId: string; slug: string };

export async function ReplyComposer({
  discussionId,
  slug,
}: ReplyComposerProps) {
  const [user, { replies }, locale] = await Promise.all([
    // A failing session check must not take down the discussion, which is already cached.
    getCurrentUser().catch(() => null),
    getDictionary(),
    getLocale(),
  ]);

  if (user) {
    return (
      <ReplyForm
        discussionId={discussionId}
        username={user.username}
        dict={replies.form}
      />
    );
  }

  const redirectTo = localizedHref(locale, `/discussions/${slug}`);
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-glass-strong px-5 py-6 sm:flex-nowrap sm:px-8">
      <HugeiconsIcon
        icon={LockIcon}
        size={24}
        color="currentColor"
        aria-hidden="true"
        className="text-brand"
      />
      <div className="flex-1">
        <h3 className="mb-1 font-display text-[17px] font-bold text-heading">
          {replies.login.title}
        </h3>
        <p className="text-sm text-ink-3">{replies.login.description}</p>
      </div>
      <Link
        href={`${localizedHref(locale, '/login')}?${new URLSearchParams({ redirectTo })}`}
        className={buttonStyles({ className: 'max-sm:w-full' })}
      >
        {replies.login.cta}
      </Link>
    </div>
  );
}
