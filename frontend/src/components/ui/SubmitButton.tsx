'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: ReactNode;
  className: string;
  pressed?: boolean;
  title?: string;
};

export function SubmitButton({
  children,
  className,
  pressed,
  title,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={pressed}
      title={title}
      className={className}
    >
      {children}
    </button>
  );
}
