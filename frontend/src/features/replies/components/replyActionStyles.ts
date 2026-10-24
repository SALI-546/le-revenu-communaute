import clsx from 'clsx';

export const replyActionStyles = (active = false) =>
  clsx(
    'inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors disabled:opacity-60',
    active
      ? 'border-success/40 bg-success-soft text-success'
      : 'border-line text-ink-2 hover:border-line-strong hover:bg-surface-2 hover:text-ink',
  );
