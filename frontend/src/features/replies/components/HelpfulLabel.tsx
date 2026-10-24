import { ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type HelpfulLabelProps = { label: string; count: number };

export function HelpfulLabel({ label, count }: HelpfulLabelProps) {
  return (
    <>
      <HugeiconsIcon
        icon={ThumbsUpIcon}
        size={16}
        color="currentColor"
        aria-hidden="true"
      />
      {label}
      <span className="tabular-nums">{count}</span>
    </>
  );
}
