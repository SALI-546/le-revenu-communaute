'use client';

import { use, useActionState } from 'react';
import { Alert02Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonStyles } from '@/components/ui/buttonStyles';
import { FormField } from '@/components/ui/FormField';
import { inputStyles } from '@/components/ui/inputStyles';
import type { Dictionary } from '@/dictionaries';
import { login } from '../actions';
import type { LoginState } from '../types';

type LoginFormProps = {
  dict: Dictionary['auth']['login'];
  redirectTo: Promise<string>;
};

type ErrorCode = keyof Dictionary['auth']['login']['errors'];

export function LoginForm({ dict, redirectTo }: LoginFormProps) {
  const target = use(redirectTo);
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );
  const fieldError = (codes?: string[]) =>
    codes && dict.errors[codes[0] as ErrorCode];
  const emailError = fieldError(state.fieldErrors?.email);
  const passwordError = fieldError(state.fieldErrors?.password);

  return (
    <form action={formAction} noValidate className="grid gap-5">
      <input type="hidden" name="redirectTo" value={target} />
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
      <FormField id="email" label={dict.email} error={emailError}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? 'email-error' : undefined}
          className={inputStyles(Boolean(emailError))}
        />
      </FormField>
      <FormField id="password" label={dict.password} error={passwordError}>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(passwordError)}
          aria-describedby={passwordError ? 'password-error' : undefined}
          className={inputStyles(Boolean(passwordError))}
        />
      </FormField>
      <button
        type="submit"
        disabled={pending}
        className={buttonStyles({ block: true })}
      >
        {pending ? dict.submitting : dict.submit}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={17}
          color="currentColor"
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
