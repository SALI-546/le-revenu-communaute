import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';

type CommunityHeroProps = { hero: Dictionary['home']['hero'] };

export function CommunityHero({ hero }: CommunityHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl bg-linear-to-br from-hero-2 via-hero to-hero px-5 py-8 text-on-hero shadow-lg sm:px-8 lg:py-10">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.11em] text-hero-accent uppercase">
          <HugeiconsIcon
            icon={SparklesIcon}
            size={15}
            color="currentColor"
            aria-hidden="true"
          />
          {hero.eyebrow}
        </p>
        <h1 className="mb-4 max-w-3xl font-display text-4xl leading-[1.03] font-bold tracking-[-0.03em] lg:text-[clamp(2.25rem,3.4vw,3.25rem)]">
          {hero.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-hero-ink lg:text-base">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
