import { Suspense } from 'react';
import { getDictionary, getLocale } from '@/dictionaries';
import { AccountCard } from './AccountCard';
import { AwaitingQuestions } from './AwaitingQuestions';
import { CharterCard } from './CharterCard';

const cardFallback = (height: string) => (
  <div className={`${height} animate-pulse rounded-xl bg-surface-2`} />
);

export async function CommunityAside() {
  const [{ home }, locale] = await Promise.all([getDictionary(), getLocale()]);

  return (
    <aside
      aria-label={home.aside.label}
      className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-1"
    >
      <Suspense fallback={cardFallback('h-72')}>
        <AccountCard />
      </Suspense>
      <Suspense fallback={cardFallback('h-80')}>
        <AwaitingQuestions />
      </Suspense>
      <CharterCard labels={home.aside.charter} locale={locale} />
    </aside>
  );
}
