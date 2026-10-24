import clsx from 'clsx';

export const inputStyles = (hasError: boolean, className?: string) =>
  clsx(
    'min-h-12 w-full rounded-lg border px-3.5 text-sm text-ink outline-none focus:border-brand focus:ring-3 focus:ring-brand-soft',
    hasError ? 'border-brand bg-surface-tint' : 'border-line bg-surface',
    className,
  );
