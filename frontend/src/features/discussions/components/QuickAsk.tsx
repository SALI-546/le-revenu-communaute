import Form from 'next/form';
import { ArrowRight01Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { inputStyles } from '@/components/ui/inputStyles';
import type { Dictionary } from '@/dictionaries';
import { localizedHref, type Locale } from '@/dictionaries/config';
import { DISCUSSION_TYPES } from '../schemas';
import { TYPE_ICONS } from '../typeIcons';

type QuickAskProps = {
  locale: Locale;
  labels: Dictionary['home']['quickAsk'];
  types: Dictionary['discussions']['types'];
  space?: { slug: string; name: string };
};

export function QuickAsk({ locale, labels, types, space }: QuickAskProps) {
  return (
    <Form
      action={localizedHref(locale, '/discussions/new')}
      className="grid gap-3 rounded-xl border border-line bg-surface p-3 sm:p-4"
    >
      {space && <input type="hidden" name="category" value={space.slug} />}
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 flex-none place-items-center rounded-full bg-brand-soft text-brand"
        >
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            size={19}
            color="currentColor"
          />
        </span>
        <label htmlFor="quick-ask" className="sr-only">
          {labels.label}
        </label>
        <input
          id="quick-ask"
          name="title"
          maxLength={150}
          autoComplete="off"
          placeholder={
            space
              ? labels.placeholderSpace.replace('{space}', space.name)
              : labels.placeholder
          }
          className={inputStyles(false, 'min-w-0 flex-1')}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:pl-14">
        <fieldset className="flex gap-2">
          <legend className="sr-only">{labels.typeLabel}</legend>
          {DISCUSSION_TYPES.map((type) => (
            <label
              key={type}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3.5 text-sm font-semibold text-ink-2 hover:border-line-strong has-checked:border-brand has-checked:bg-surface-tint has-checked:text-brand-text has-focus-visible:ring-3 has-focus-visible:ring-brand-soft"
            >
              <input
                type="radio"
                name="type"
                value={type}
                defaultChecked={type === DISCUSSION_TYPES[0]}
                className="sr-only"
              />
              <HugeiconsIcon
                icon={TYPE_ICONS[type]}
                size={15}
                color="currentColor"
                aria-hidden="true"
              />
              {types[type]}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          className={buttonStyles({ className: 'ml-auto' })}
        >
          {labels.submit}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={16}
            color="currentColor"
            aria-hidden="true"
          />
        </button>
      </div>
    </Form>
  );
}
