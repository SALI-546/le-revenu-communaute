import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-brand text-on-brand shadow-sm hover:bg-brand-hover',
  secondary:
    'border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-2',
  ghost:
    'border-line bg-glass text-ink hover:border-line-strong hover:bg-surface-2',
};

type ButtonStyleOptions = {
  variant?: ButtonVariant;
  block?: boolean;
  className?: string;
};

export const buttonStyles = ({
  variant = 'primary',
  block = false,
  className,
}: ButtonStyleOptions = {}) =>
  clsx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-[13px] font-bold transition duration-200 hover:-translate-y-px',
    variants[variant],
    block && 'w-full',
    className,
  );
