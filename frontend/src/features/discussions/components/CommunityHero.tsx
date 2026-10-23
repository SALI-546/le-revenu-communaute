import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';

type CommunityHeroProps = { hero: Dictionary['home']['hero'] };

export function CommunityHero({ hero }: CommunityHeroProps) {
  return (
    <section className="bg-hero px-3 py-9 text-on-hero lg:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.11em] text-hero-accent uppercase">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={15}
            color="currentColor"
            aria-hidden="true"
          />
          {hero.eyebrow}
        </p>
        <h1 className="mb-4 max-w-3xl font-display text-4xl leading-[1.03] font-bold tracking-[-0.03em] lg:text-[clamp(2.375rem,4.1vw,3.75rem)]">
          {hero.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-hero-ink lg:text-base">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
