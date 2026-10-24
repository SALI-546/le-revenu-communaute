'use client';

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';
import { THEME_KEY, savePreference } from '@/lib/preferences';

type ThemeToggleProps = { labels: Dictionary['layout']['theme'] };

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle('dark');
    savePreference(THEME_KEY, dark ? 'dark' : 'light');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-grid size-10 place-items-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
    >
      <span className="contents dark:hidden">
        <HugeiconsIcon
          icon={Moon02Icon}
          size={18}
          color="currentColor"
          aria-hidden="true"
        />
        <span className="sr-only">{labels.toDark}</span>
      </span>
      <span className="hidden dark:contents">
        <HugeiconsIcon
          icon={Sun03Icon}
          size={18}
          color="currentColor"
          aria-hidden="true"
        />
        <span className="sr-only">{labels.toLight}</span>
      </span>
    </button>
  );
}
