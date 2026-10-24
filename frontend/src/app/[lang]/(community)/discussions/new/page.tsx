import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { NewDiscussionSection } from '@/features/discussions/components/NewDiscussionSection';

export async function generateMetadata() {
  const { discussions } = await getDictionary();
  return { title: discussions.create.title };
}

export default async function NewDiscussionPage({
  searchParams,
}: PageProps<'/[lang]/discussions/new'>) {
  const [{ discussions }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);
  const { create } = discussions;

  return (
    <main id="content" className="mx-auto max-w-[890px] pt-8 pb-28">
      <Link
        href={localizedHref(locale)}
        className="mb-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-ink-3 hover:text-ink"
      >
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={17}
          color="currentColor"
          aria-hidden="true"
        />
        {create.back}
      </Link>
      <div className="mb-7 text-center">
        <p className="mb-2 text-[10px] font-bold tracking-[0.12em] text-brand-text uppercase">
          {create.label}
        </p>
        <h1 className="mb-2.5 font-display text-[clamp(2rem,5vw,3rem)] leading-tight font-bold text-heading">
          {create.title}
        </h1>
        <p className="text-sm text-ink-3">{create.description}</p>
      </div>
      <Suspense
        fallback={
          <div className="h-[42rem] animate-pulse rounded-xl bg-surface-2" />
        }
      >
        <NewDiscussionSection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
