import Link from 'next/link';
import { Logout03Icon, UserCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { logout } from '@/features/auth/actions';
import { getCurrentUser } from '@/lib/auth/dal';
import { mobileNavItemStyles } from './mobileNavItemStyles';

export async function MobileNavAccount() {
  const [user, { layout }, locale] = await Promise.all([
    getCurrentUser().catch(() => null),
    getDictionary(),
    getLocale(),
  ]);

  if (!user) {
    return (
      <Link
        href={localizedHref(locale, '/login')}
        className={mobileNavItemStyles(false)}
      >
        <HugeiconsIcon
          icon={UserCircleIcon}
          size={22}
          color="currentColor"
          aria-hidden="true"
        />
        {layout.mobileNav.login}
      </Link>
    );
  }
  return (
    <form action={logout}>
      <input type="hidden" name="redirectTo" value={localizedHref(locale)} />
      <button type="submit" className={mobileNavItemStyles(false)}>
        <HugeiconsIcon
          icon={Logout03Icon}
          size={22}
          color="currentColor"
          aria-hidden="true"
        />
        {layout.mobileNav.logout}
      </button>
    </form>
  );
}
