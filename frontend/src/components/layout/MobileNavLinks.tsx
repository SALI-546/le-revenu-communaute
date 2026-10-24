'use client';

import type { ComponentProps } from 'react';
import { usePathname } from 'next/navigation';
import { MobileNavBar } from './MobileNavBar';

type MobileNavLinksProps = Omit<ComponentProps<typeof MobileNavBar>, 'active'>;

export function MobileNavLinks(props: MobileNavLinksProps) {
  const pathname = usePathname();
  const home = `/${props.locale}`;
  const active =
    pathname === home
      ? 'home'
      : pathname === `${home}/spaces`
        ? 'spaces'
        : undefined;

  return <MobileNavBar {...props} active={active} />;
}
