import Link from 'next/link';
import { Add01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { getCurrentUser } from '@/lib/auth/dal';

export async function AccountCard() {
  const [user, { home }, locale] = await Promise.all([
    getCurrentUser().catch(() => null),
    getDictionary(),
    getLocale(),
  ]);
  const { join, welcome } = home.aside;

  if (user) {
    return (
      <section className="rounded-xl border border-line bg-surface p-5">
        <div className="mb-3 flex items-center gap-3">
          <Avatar name={user.username} />
          <h2 className="font-display text-xl font-bold text-heading">
            {welcome.title.replace('{name}', user.username)}
          </h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-ink-2">
          {welcome.description}
        </p>
        <Link
          href={localizedHref(locale, '/discussions/new')}
          className={buttonStyles({ block: true })}
        >
          <HugeiconsIcon
            icon={Add01Icon}
            size={17}
            color="currentColor"
            aria-hidden="true"
          />
          {welcome.cta}
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-brand/20 bg-linear-to-b from-surface-tint to-surface p-5">
      <h2 className="font-display text-xl font-bold text-heading">
        {join.title}
      </h2>
      <p className="mt-1 mb-4 text-sm text-ink-2">{join.description}</p>
      <ul className="mb-5 grid gap-2.5">
        {join.benefits.map((benefit) => (
          <li key={benefit} className="flex gap-2 text-sm text-ink-2">
            <HugeiconsIcon
              icon={Tick02Icon}
              size={17}
              color="currentColor"
              aria-hidden="true"
              className="mt-0.5 flex-none text-brand"
            />
            {benefit}
          </li>
        ))}
      </ul>
      <Link
        href={localizedHref(locale, '/login')}
        className={buttonStyles({ block: true })}
      >
        {join.cta}
      </Link>
    </section>
  );
}
