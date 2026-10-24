'use client';

import { useState } from 'react';
import { Link01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';

type CopyLinkButtonProps = {
  labels: Dictionary['discussions']['detail']['actions'];
  className: string;
};

type CopyStatus = 'idle' | 'copied' | 'failed';

export function CopyLinkButton({ labels, className }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <button type="button" onClick={copy} className={className}>
      <HugeiconsIcon
        icon={status === 'copied' ? Tick02Icon : Link01Icon}
        size={16}
        color="currentColor"
        aria-hidden="true"
      />
      <span aria-live="polite">
        {status === 'copied'
          ? labels.copied
          : status === 'failed'
            ? labels.copyFailed
            : labels.copy}
      </span>
    </button>
  );
}
