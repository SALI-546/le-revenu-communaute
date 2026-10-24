import type { ReactNode } from 'react';
import clsx from 'clsx';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';

type StateCardProps = {
  icon: IconSvgElement;
  title: string;
  description: string;
  tone?: 'neutral' | 'error';
  action?: ReactNode;
};

export function StateCard({
  icon,
  title,
  description,
  tone = 'neutral',
  action,
}: StateCardProps) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className="flex min-h-[26rem] flex-col items-center justify-center bg-surface p-10 text-center"
    >
      <span
        className={clsx(
          'mb-5 grid size-[62px] place-items-center rounded-full',
          tone === 'error'
            ? 'bg-brand-soft text-brand'
            : 'bg-surface-2 text-ink-3',
        )}
      >
        <HugeiconsIcon
          icon={icon}
          size={28}
          color="currentColor"
          aria-hidden="true"
        />
      </span>
      <h2 className="mb-2 font-display text-[25px] font-bold text-heading">
        {title}
      </h2>
      <p className="mb-6 max-w-md text-sm leading-relaxed text-ink-3">
        {description}
      </p>
      {action}
    </div>
  );
}
