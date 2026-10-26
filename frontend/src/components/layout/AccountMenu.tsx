import Link from 'next/link';
import { Logout03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { logout } from '@/features/auth/actions';
import { memberHref } from '@/features/members/memberHref';
import { getCurrentUser } from '@/lib/auth/dal';
import { LoginLink } from './LoginLink';

export async function AccountMenu() {
  const [user, { layout }, locale] = await Promise.all([
    // The header lives above the error boundary, so an unreachable API must not break the page.
    getCurrentUser().catch(() => null),
    getDictionary(),
    getLocale(),
  ]);

  if (!user) {
    return (
      <LoginLink
        href={localizedHref(locale, '/login')}
        label={layout.header.login}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={memberHref(locale, user.username)}
        className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface p-1 text-[13px] font-semibold hover:border-line-strong lg:pr-3"
      >
        <Avatar name={user.username} size="sm" />
        <span className="max-lg:sr-only">{user.username}</span>
      </Link>
      <form action={logout}>
        <input type="hidden" name="redirectTo" value={localizedHref(locale)} />
        <button
          type="submit"
          className={buttonStyles({
            variant: 'ghost',
            className: 'max-lg:w-11 max-lg:px-0',
          })}
        >
          <HugeiconsIcon
            icon={Logout03Icon}
            size={18}
            color="currentColor"
            aria-hidden="true"
          />
          <span className="max-lg:sr-only">{layout.header.logout}</span>
        </button>
      </form>
    </div>
  );
}
