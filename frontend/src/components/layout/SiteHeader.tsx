import Link from 'next/link';
import { Suspense } from 'react';
import { Add01Icon, News01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { AccountMenu } from './AccountMenu';
import { LocaleLinks } from './LocaleLinks';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';
import { SearchForm } from './SearchForm';
import { SITE_URL, SUBSCRIBE_URL } from './siteLinks';

export async function SiteHeader() {
  const [{ layout }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);

  return (
    <>
      <div className="bg-hero text-on-hero">
        <div className="page-shell flex min-h-9 items-center gap-3 text-xs font-semibold">
          <a
            href={SITE_URL}
            className="inline-flex min-h-9 items-center gap-1.5 opacity-85 hover:opacity-100"
          >
            <HugeiconsIcon
              icon={News01Icon}
              size={14}
              color="currentColor"
              aria-hidden="true"
            />
            {layout.pressBar.site}
          </a>
          <Suspense
            fallback={
              <LocaleLinks
                current={locale}
                labels={layout.locale}
                hrefFor={(target) => localizedHref(target)}
              />
            }
          >
            <LocaleSwitcher current={locale} labels={layout.locale} />
          </Suspense>
          <a
            href={SUBSCRIBE_URL}
            className="inline-flex min-h-7 items-center rounded-lg bg-brand px-3 text-on-brand hover:bg-brand-hover"
          >
            {layout.subscribe}
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-glass-strong backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center gap-3 lg:h-20">
          <Link
            href={localizedHref(locale)}
            aria-label={layout.header.home}
            className="flex min-h-11 items-center gap-3.5"
          >
            <Logo alt="" className="w-[96px] sm:w-[124px]" />
            <span
              aria-hidden="true"
              className="hidden h-8 w-px bg-line-strong sm:block"
            />
            <span className="hidden font-display text-lg font-bold text-heading sm:block">
              {layout.header.section}
            </span>
          </Link>
          <SearchForm
            id="header-search"
            action={localizedHref(locale)}
            labels={layout.search}
            className="ml-auto hidden w-[min(27.5rem,36vw)] lg:flex"
          />
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Suspense
              fallback={
                <span className="size-11 rounded-lg bg-surface-2 lg:w-32" />
              }
            >
              <AccountMenu />
            </Suspense>
            <Link
              href={localizedHref(locale, '/discussions/new')}
              className={buttonStyles({ className: 'max-sm:w-11 max-sm:px-0' })}
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={18}
                color="currentColor"
                aria-hidden="true"
              />
              <span className="max-sm:sr-only">{layout.header.publish}</span>
            </Link>
          </div>
        </div>
        <nav aria-label={layout.header.nav} className="border-t border-line">
          <div className="page-shell flex h-11 items-stretch">
            <Link
              href={localizedHref(locale)}
              className="relative flex items-center text-sm font-semibold text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand"
            >
              {layout.header.discussions}
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
