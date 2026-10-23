import type { ReactNode } from 'react';
import { AlertCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-xs font-bold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-text"
        >
          <HugeiconsIcon
            icon={AlertCircleIcon}
            size={15}
            color="currentColor"
            aria-hidden="true"
          />
          {error}
        </p>
      )}
    </div>
  );
}
