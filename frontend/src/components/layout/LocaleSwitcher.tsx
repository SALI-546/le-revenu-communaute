'use client';

import { usePathname } from 'next/navigation';
import type { Dictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries/config';
import { LocaleLinks } from './LocaleLinks';

type LocaleSwitcherProps = {
  current: Locale;
  labels: Dictionary['layout']['locale'];
};

export function LocaleSwitcher({ current, labels }: LocaleSwitcherProps) {
  const pathname = usePathname();

  return (
    <LocaleLinks
      current={current}
      labels={labels}
      hrefFor={(locale) => pathname.replace(/^\/[^/]+/, `/${locale}`)}
    />
  );
}
