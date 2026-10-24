import Link from 'next/link';
import clsx from 'clsx';
import type { Dictionary } from '@/dictionaries';
import { locales, type Locale } from '@/dictionaries/config';

type LocaleLinksProps = {
  current: Locale;
  labels: Dictionary['layout']['locale'];
  hrefFor: (locale: Locale) => string;
};

export function LocaleLinks({ current, labels, hrefFor }: LocaleLinksProps) {
  return (
    <nav aria-label={labels.label} className="max-md:ml-auto">
      <ul className="flex items-center gap-1">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={hrefFor(locale)}
              hrefLang={locale}
              lang={locale}
              aria-current={locale === current ? 'true' : undefined}
              className={clsx(
                'inline-flex min-h-10 items-center rounded px-1.5 uppercase',
                locale === current
                  ? 'font-bold text-ink'
                  : 'text-ink-3 hover:text-ink',
              )}
            >
              <span aria-hidden="true">{locale}</span>
              <span className="sr-only">{labels.names[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
