'use client';

import {
  LeftToRightListBulletIcon,
  ListViewIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { DENSITY_KEY, savePreference } from '@/lib/preferences';

type DensityToggleProps = {
  labels: Dictionary['discussions']['list']['density'];
};

export function DensityToggle({ labels }: DensityToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const compact = root.dataset.density !== 'compact';
    if (compact) {
      root.dataset.density = 'compact';
    } else {
      delete root.dataset.density;
    }
    savePreference(DENSITY_KEY, compact ? 'compact' : 'comfortable');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-grid size-11 place-items-center rounded-lg border border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink"
    >
      <span className="contents compact:hidden">
        <HugeiconsIcon
          icon={ListViewIcon}
          size={18}
          color="currentColor"
          aria-hidden="true"
        />
        <span className="sr-only">{labels.toCompact}</span>
      </span>
      <span className="hidden compact:contents">
        <HugeiconsIcon
          icon={LeftToRightListBulletIcon}
          size={18}
          color="currentColor"
          aria-hidden="true"
        />
        <span className="sr-only">{labels.toComfortable}</span>
      </span>
    </button>
  );
}
