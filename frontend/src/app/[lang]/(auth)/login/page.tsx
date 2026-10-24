import Link from 'next/link';
import { Suspense } from 'react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Logo } from '@/components/layout/Logo';
import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { LoginForm } from '@/features/auth/components/LoginForm';

export async function generateMetadata() {
  const { auth } = await getDictionary();
  return { title: auth.login.title };
}

export default async function LoginPage({
  searchParams,
}: PageProps<'/[lang]/login'>) {
  const [{ auth, layout }, locale] = await Promise.all([
    getDictionary(),
    getLocale(),
  ]);
  const home = localizedHref(locale);
  const redirectTo = searchParams.then(({ redirectTo: target }) =>
    typeof target === 'string' ? target : home,
  );

  return (
    <main
      id="content"
      className="min-h-dvh bg-surface md:grid md:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.15fr)]"
    >
      <section className="hidden flex-col justify-between bg-linear-to-br from-hero to-hero-2 p-[clamp(2.25rem,6vw,5.375rem)] text-on-hero md:flex">
        <Link href={home} className="flex items-center gap-3.5 self-start">
          <Logo alt={layout.logoAlt} withTagline={false} className="w-28" />
          <span className="border-l border-hero-2 pl-3.5 text-[13px] font-semibold">
            {layout.header.section}
          </span>
        </Link>
        <div className="max-w-xl">
          <p className="mb-4 text-[11px] font-bold tracking-[0.11em] text-hero-accent uppercase">
            {auth.login.story.eyebrow}
          </p>
          <h2 className="mb-5 font-display text-[clamp(2.625rem,5vw,4.125rem)] leading-[1.03] font-bold tracking-[-0.03em]">
            {auth.login.story.title}
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-hero-ink">
            {auth.login.story.description}
          </p>
        </div>
        <blockquote className="max-w-md border-l-2 border-brand pl-4 font-display text-sm text-hero-ink italic">
          {auth.login.story.quote}
        </blockquote>
      </section>
      <section className="relative grid min-h-dvh place-items-center px-5 py-12">
        <Link
          href={home}
          aria-label={auth.login.close}
          className="absolute top-6 right-6 grid size-11 place-items-center rounded-full border border-line bg-surface text-ink"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={20}
            color="currentColor"
            aria-hidden="true"
          />
        </Link>
        <div className="w-full max-w-[420px]">
          <span className="mb-10 inline-flex md:hidden">
            <Logo alt={layout.logoAlt} className="w-36" />
          </span>
          <h1 className="mb-2 font-display text-[31px] font-bold text-heading lg:text-[37px]">
            {auth.login.title}
          </h1>
          <p className="mb-8 text-sm text-ink-3">{auth.login.description}</p>
          <Suspense fallback={<div className="h-72" />}>
            <LoginForm dict={auth.login} redirectTo={redirectTo} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
