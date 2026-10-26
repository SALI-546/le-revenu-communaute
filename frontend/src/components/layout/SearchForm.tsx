import Form from 'next/form';
import clsx from 'clsx';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Dictionary } from '@/dictionaries';

type SearchFormProps = {
  id: string;
  action: string;
  labels: Dictionary['layout']['search'];
  defaultValue?: string;
  className?: string;
};

export function SearchForm({
  id,
  action,
  labels,
  defaultValue,
  className,
}: SearchFormProps) {
  return (
    <Form
      action={action}
      role="search"
      className={clsx(
        'flex min-h-11 items-center gap-2.5 rounded-xl border border-line bg-surface-2 px-3 text-ink-3 focus-within:border-brand focus-within:bg-surface focus-within:ring-3 focus-within:ring-brand-soft',
        className,
      )}
    >
      <HugeiconsIcon
        icon={Search01Icon}
        size={18}
        color="currentColor"
        aria-hidden="true"
      />
      <label htmlFor={id} className="sr-only">
        {labels.label}
      </label>
      <input
        id={id}
        name="q"
        type="search"
        maxLength={100}
        defaultValue={defaultValue}
        placeholder={labels.placeholder}
        className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-3"
      />
      <button type="submit" className="sr-only">
        {labels.submit}
      </button>
    </Form>
  );
}
