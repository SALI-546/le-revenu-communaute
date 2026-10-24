'use client';

import { useActionState } from 'react';
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  SentIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Avatar } from '@/components/ui/Avatar';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { FormField } from '@/components/ui/FormField';
import { inputStyles } from '@/components/ui/inputStyles';
import type { Dictionary } from '@/dictionaries';
import { createReply } from '../actions';
import type { ReplyState } from '../types';

type ReplyFormProps = {
  discussionId: string;
  username: string;
  dict: Dictionary['replies']['form'];
};

type ErrorCode = keyof Dictionary['replies']['form']['errors'];

export function ReplyForm({ discussionId, username, dict }: ReplyFormProps) {
  const [state, formAction, pending] = useActionState<ReplyState, FormData>(
    createReply,
    {
      status: 'idle',
    },
  );
  const contentCode = state.fieldErrors?.content?.[0] as ErrorCode | undefined;
  const contentError = contentCode && dict.errors[contentCode];

  return (
    <form
      action={formAction}
      noValidate
      className="rounded-xl border border-line bg-glass-strong px-5 py-6 sm:px-8 sm:py-8"
    >
      <input type="hidden" name="discussion" value={discussionId} />
      <div className="mb-5 flex items-center gap-3">
        <Avatar name={username} />
        <p className="grid text-xs text-ink-3">
          {dict.replyingAs}
          <strong className="text-sm text-ink">{username}</strong>
        </p>
      </div>
      {state.status === 'success' && (
        <p
          role="status"
          className="mb-5 flex items-center gap-2 rounded-lg bg-success-soft p-3.5 text-sm font-bold text-success"
        >
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={19}
            color="currentColor"
            aria-hidden="true"
          />
          {dict.success}
        </p>
      )}
      {state.error && (
        <p
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-lg bg-surface-tint p-3 text-xs font-semibold text-brand-text"
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
      <FormField id="reply-content" label={dict.label} error={contentError}>
        <textarea
          id="reply-content"
          name="content"
          rows={6}
          maxLength={5000}
          required
          placeholder={dict.placeholder}
          defaultValue={state.content}
          aria-invalid={Boolean(contentError)}
          aria-describedby={
            contentError ? 'reply-content-error' : 'reply-content-hint'
          }
          className={inputStyles(
            Boolean(contentError),
            'min-h-36 resize-y py-3 leading-relaxed',
          )}
        />
      </FormField>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="reply-content-hint" className="text-xs text-ink-3">
          {dict.hint}
        </p>
        <button
          type="submit"
          disabled={pending}
          className={buttonStyles({ className: 'max-sm:w-full' })}
        >
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
