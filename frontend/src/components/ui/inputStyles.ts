import clsx from 'clsx';

export const inputStyles = (hasError: boolean) =>
  clsx(
    'min-h-12 w-full rounded-[9px] border px-3.5 text-sm text-ink outline-none focus:border-brand focus:ring-3 focus:ring-brand-soft',
    hasError ? 'border-brand bg-surface-tint' : 'border-line bg-surface',
  );
