import { Suspense } from 'react';
import { CommunitySidebar } from '@/components/layout/CommunitySidebar';
import { MobileNavAccount } from '@/components/layout/MobileNavAccount';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { MobileNavLinks } from '@/components/layout/MobileNavLinks';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getDictionary, getLocale } from '@/dictionaries';

export default async function CommunityLayout({
  children,
}: LayoutProps<'/[lang]'>) {
  const [{ layout }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);
  const account = (
    <Suspense fallback={<span className="size-14" />}>
      <MobileNavAccount />
    </Suspense>
  );

  return (
    <>
      <SiteHeader />
      <div className="page-shell flex-1 lg:grid lg:grid-cols-[212px_minmax(0,1fr)] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 py-8">
            <Suspense
              fallback={
                <div className="h-[36rem] animate-pulse rounded-xl bg-surface-2" />
              }
            >
              <CommunitySidebar />
            </Suspense>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
      <SiteFooter />
      <Suspense
        fallback={
          <MobileNavBar
            locale={locale}
            labels={layout.mobileNav}
            account={account}
          />
        }
      >
        <MobileNavLinks
          locale={locale}
          labels={layout.mobileNav}
          account={account}
        />
      </Suspense>
    </>
  );
}
