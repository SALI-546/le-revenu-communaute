import Link from 'next/link';
import { connection } from 'next/server';
import { ArrowRight01Icon, HelpCircleIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { listHref } from '../listHref';
import { getAwaitingQuestions } from '../queries';

export async function AwaitingQuestions() {
  await connection();
  const [questions, { home }, locale] = await Promise.all([
    getAwaitingQuestions(),
    getDictionary(),
    getLocale(),
  ]);
  const { awaiting } = home.aside;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
        <HugeiconsIcon
          icon={HelpCircleIcon}
          size={18}
          color="currentColor"
          aria-hidden="true"
          className="text-brand"
        />
        {awaiting.title}
      </h2>
      <p className="mt-1 mb-3 text-xs text-ink-3">{awaiting.description}</p>
      {questions.length === 0 ? (
        <p className="rounded-lg bg-success-soft p-3 text-xs font-semibold text-success">
          {awaiting.empty}
        </p>
      ) : (
        <ul className="grid">
          {questions.map(({ documentId, slug, title, category }) => (
            <li
              key={documentId}
              className="border-t border-line first:border-t-0"
            >
              <Link
                href={localizedHref(locale, `/discussions/${slug}`)}
                className="group grid min-h-11 gap-0.5 py-3"
              >
                {category && (
                  <span className="text-[10px] font-bold tracking-[0.1em] text-brand-text uppercase">
                    {category.name}
                  </span>
                )}
                <span className="font-display text-[15px] leading-snug font-bold text-heading group-hover:text-brand-text">
                  {title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Link
        href={listHref(locale, { tab: 'unanswered' })}
        className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-bold text-brand-text hover:underline"
      >
        {awaiting.all}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          color="currentColor"
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}
