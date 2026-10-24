import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  Add01Icon,
  DashboardSquare01Icon,
  Home01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { mobileNavItemStyles } from './mobileNavItemStyles';

type MobileNavBarProps = {
  locale: string;
  labels: Dictionary['layout']['mobileNav'];
  account: ReactNode;
  active?: 'home' | 'spaces';
};

export function MobileNavBar({
  locale,
  labels,
  account,
  active,
}: MobileNavBarProps) {
  const home = `/${locale}`;

  return (
    <nav
      aria-label={labels.label}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-glass-strong px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <Link
        href={home}
        aria-current={active === 'home' ? 'page' : undefined}
        className={mobileNavItemStyles(active === 'home')}
      >
        <HugeiconsIcon
          icon={Home01Icon}
          size={22}
          color="currentColor"
          aria-hidden="true"
        />
        {labels.home}
      </Link>
      <Link
        href={`${home}/spaces`}
        aria-current={active === 'spaces' ? 'page' : undefined}
        className={mobileNavItemStyles(active === 'spaces')}
      >
        <HugeiconsIcon
          icon={DashboardSquare01Icon}
          size={22}
          color="currentColor"
          aria-hidden="true"
        />
        {labels.spaces}
      </Link>
      <Link
        href={`${home}/discussions/new`}
        aria-label={labels.publish}
        className="-mt-5 grid size-12 place-items-center rounded-full bg-brand text-on-brand shadow-md hover:bg-brand-hover"
      >
        <HugeiconsIcon
          icon={Add01Icon}
          size={24}
          color="currentColor"
          aria-hidden="true"
        />
      </Link>
      {account}
    </nav>
  );
}
