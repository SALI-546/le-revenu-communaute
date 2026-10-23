import Link from 'next/link';
import {
  Add01Icon,
  News01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { Logo } from './Logo';

export async function SiteHeader() {
  const [{ layout }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);

  return (
    <header>
      <div className="bg-hero text-on-hero">
        <div className="page-shell flex h-8 items-center text-[11px] font-semibold">
          <a
            href="https://www.lerevenu.com"
            className="inline-flex min-h-8 items-center gap-1.5 opacity-85 hover:opacity-100"
          >
            <HugeiconsIcon
              icon={News01Icon}
              size={14}
              color="currentColor"
              aria-hidden="true"
            />
            {layout.pressBar.site}
          </a>
        </div>
      </div>
      <div className="border-b border-line bg-glass-strong backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center gap-3 lg:h-20">
          <Link
            href={localizedHref(locale)}
            aria-label={layout.header.home}
            className="flex min-h-11 items-center gap-3.5"
          >
            <Logo />
            <span
              aria-hidden="true"
              className="hidden h-6 w-px bg-line-strong sm:block"
            />
            <span className="hidden text-sm font-semibold text-ink-2 sm:block">
              {layout.header.section}
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href={localizedHref(locale, '/login')}
              className={buttonStyles({
                variant: 'ghost',
                className: 'max-lg:w-11 max-lg:px-0',
              })}
            >
              <HugeiconsIcon
                icon={UserCircleIcon}
                size={20}
                color="currentColor"
                aria-hidden="true"
                className="lg:hidden"
              />
              <span className="max-lg:sr-only">{layout.header.login}</span>
            </Link>
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
              className="relative flex items-center text-xs font-semibold text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand"
            >
              {layout.header.discussions}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
