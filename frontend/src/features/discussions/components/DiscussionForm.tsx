'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import {
  Alert02Icon,
  ArrowDown01Icon,
  SecurityCheckIcon,
  SentIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { FormField } from '@/components/ui/FormField';
import { inputStyles } from '@/components/ui/inputStyles';
import type { Dictionary } from '@/dictionaries';
import type { Locale } from '@/dictionaries/config';
import { createDiscussion } from '../actions';
import { DISCUSSION_TYPES } from '../schemas';
import { TYPE_ICONS } from '../typeIcons';
import type { Category, DiscussionFormState, DiscussionType } from '../types';

type DiscussionFormProps = {
  categories: Category[];
  locale: Locale;
  dict: Dictionary['discussions']['create']['form'];
  initial: { title?: string; type?: DiscussionType; category?: string };
};

type ErrorCode = keyof Dictionary['discussions']['create']['form']['errors'];

export function DiscussionForm({
  categories,
  locale,
  dict,
  initial,
}: DiscussionFormProps) {
  const [state, formAction, pending] = useActionState<
    DiscussionFormState,
    FormData
  >(createDiscussion, {});
  const [title, setTitle] = useState(initial.title ?? '');
  const [content, setContent] = useState('');
  const selectedType =
    state.values?.type ?? initial.type ?? DISCUSSION_TYPES[0];
  // Remount the uncontrolled fields so React's post-action form reset restores the submitted values.
  const valuesKey = JSON.stringify(state.values ?? {});
  const errorFor = (
    field: keyof NonNullable<DiscussionFormState['fieldErrors']>,
  ) => {
    const code = state.fieldErrors?.[field]?.[0] as ErrorCode | undefined;
    return code && dict.errors[code];
  };
  const errors = {
    type: errorFor('type'),
    title: errorFor('title'),
    category: errorFor('category'),
    content: errorFor('content'),
  };
  const formatCount = (value: number) =>
    new Intl.NumberFormat(locale).format(value);
  const idOf = (field: keyof typeof errors) => `discussion-${field}`;
  const describedBy = (field: keyof typeof errors, hint?: string) =>
    errors[field] ? `${idOf(field)}-error` : hint;

  return (
    <form
      action={formAction}
      noValidate
      className="grid gap-6 rounded-xl border border-line bg-glass-strong p-[clamp(1.25rem,5vw,3.25rem)] shadow-md"
    >
      <input type="hidden" name="locale" value={locale} />
      {state.error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-surface-tint p-3 text-xs font-semibold text-brand-text"
        >
          <HugeiconsIcon
            icon={Alert02Icon}
            size={16}
            color="currentColor"
            aria-hidden="true"
          />
          {dict.errors[state.error]}
        </p>
      )}
      <fieldset
        aria-describedby={describedBy('type')}
        className="grid gap-2.5 sm:grid-cols-2"
      >
        <legend className="mb-2.5 text-xs font-bold text-ink">
          {dict.typeLegend}
        </legend>
        {DISCUSSION_TYPES.map((option) => (
          <label
            key={option}
            className="relative grid min-h-24 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-xl border border-line p-4 hover:border-brand has-checked:border-brand has-checked:bg-surface-tint has-focus-visible:ring-3 has-focus-visible:ring-brand-soft"
          >
            <input
              key={valuesKey}
              type="radio"
              name="type"
              value={option}
              defaultChecked={selectedType === option}
              className="peer sr-only"
            />
            <span className="row-span-2 grid size-[42px] place-items-center rounded-lg bg-surface-2 text-ink-3 peer-checked:bg-brand-soft peer-checked:text-brand">
              <HugeiconsIcon
                icon={TYPE_ICONS[option]}
                size={21}
                color="currentColor"
                aria-hidden="true"
              />
            </span>
            <span className="grid">
              <strong className="text-sm text-ink">
                {dict.types[option].label}
              </strong>
              <small className="text-xs text-ink-3">
                {dict.types[option].hint}
              </small>
            </span>
            <span className="hidden size-[18px] place-items-center rounded-full bg-brand text-on-brand peer-checked:grid">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={13}
                color="currentColor"
                aria-hidden="true"
              />
            </span>
          </label>
        ))}
        {errors.type && (
          <p
            id={`${idOf('type')}-error`}
            className="text-xs font-semibold text-brand-text sm:col-span-2"
          >
            {errors.type}
          </p>
        )}
      </fieldset>
      <FormField id={idOf('title')} label={dict.title} error={errors.title}>
        <input
          id={idOf('title')}
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={150}
          required
          aria-invalid={Boolean(errors.title)}
          aria-describedby={describedBy('title', 'discussion-title-hint')}
          className={inputStyles(Boolean(errors.title))}
        />
        <p
          id="discussion-title-hint"
          className="flex justify-between gap-4 text-xs text-ink-3"
        >
          <span>{dict.titleHint}</span>
          <span aria-hidden="true">
            {title.length}/{formatCount(150)}
          </span>
        </p>
      </FormField>
      <FormField
        id={idOf('category')}
        label={dict.category}
        error={errors.category}
      >
        <div className="relative">
          <select
            id={idOf('category')}
            name="category"
            key={valuesKey}
            defaultValue={state.values?.category ?? initial.category ?? ''}
            required
            aria-invalid={Boolean(errors.category)}
            aria-describedby={describedBy('category')}
            className={inputStyles(
              Boolean(errors.category),
              'appearance-none pr-10',
            )}
          >
            <option value="">{dict.categoryPlaceholder}</option>
            {categories.map(({ documentId, name }) => (
              <option key={documentId} value={documentId}>
                {name}
              </option>
            ))}
          </select>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={17}
            color="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-3"
          />
        </div>
      </FormField>
      <FormField
        id={idOf('content')}
        label={dict.content}
        error={errors.content}
      >
        <textarea
          id={idOf('content')}
          name="content"
          rows={8}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={10000}
          required
          placeholder={dict.contentPlaceholder}
          aria-invalid={Boolean(errors.content)}
          aria-describedby={describedBy('content')}
          className={inputStyles(
            Boolean(errors.content),
            'min-h-48 resize-y py-3 leading-relaxed',
          )}
        />
        <p aria-hidden="true" className="text-right text-xs text-ink-3">
          {content.length}/{formatCount(10000)}
        </p>
      </FormField>
      <div className="flex gap-3 rounded-lg bg-surface-2 p-4">
        <HugeiconsIcon
          icon={SecurityCheckIcon}
          size={20}
          color="currentColor"
          aria-hidden="true"
          className="flex-none text-success"
        />
        <p className="text-xs leading-relaxed text-ink-3">
          <strong className="block text-ink-2">{dict.compliance.title}</strong>
          {dict.compliance.description}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-2.5 border-t border-line pt-5">
        <Link
          href={`/${locale}`}
          className={buttonStyles({ variant: 'ghost' })}
        >
          {dict.cancel}
        </Link>
        <button type="submit" disabled={pending} className={buttonStyles()}>
          <HugeiconsIcon
            icon={SentIcon}
            size={16}
            color="currentColor"
            aria-hidden="true"
          />
          {pending ? dict.submitting : dict.submit}
        </button>
      </div>
    </form>
  );
}
