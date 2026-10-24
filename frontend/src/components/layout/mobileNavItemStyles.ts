import clsx from 'clsx';

export const mobileNavItemStyles = (active: boolean) =>
  clsx(
    'flex min-h-14 min-w-16 flex-col items-center justify-center gap-0.5 text-[11px]',
    active ? 'font-semibold text-brand-text' : 'text-ink-3',
  );
