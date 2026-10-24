import { Suspense } from 'react';
import { getDictionary } from '@/dictionaries';
import { SpacesGrid } from '@/features/discussions/components/SpacesGrid';

export async function generateMetadata() {
  const { spaces } = await getDictionary();
  return { title: spaces.title };
}

export default async function SpacesPage() {
  const { spaces } = await getDictionary();

  return (
    <main id="content" className="pt-8 pb-24">
      <header className="mb-7">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-heading">
          {spaces.title}
        </h1>
        <p className="mt-2 max-w-2xl text-ink-2">{spaces.description}</p>
      </header>
      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-xl bg-surface-2" />
        }
      >
        <SpacesGrid />
      </Suspense>
    </main>
  );
}
