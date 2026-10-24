import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';
import { defaultLocale, hasLocale, locales } from '@/dictionaries/config';
import { SESSION_COOKIE } from '@/lib/auth/session';

const PROTECTED_PATHS = ['/discussions/new'];

const negotiateLocale = (request: NextRequest) => {
  const headers = {
    'accept-language': request.headers.get('accept-language') ?? '',
  };
  const languages = new Negotiator({ headers })
    .languages()
    .filter((tag) => tag !== '*');
  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, locale = '', ...segments] = pathname.split('/');

  if (!hasLocale(locale)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${negotiateLocale(request)}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const path = `/${segments.join('/')}`;
  if (PROTECTED_PATHS.includes(path) && !request.cookies.has(SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.search = new URLSearchParams({
      redirectTo: `${pathname}${request.nextUrl.search}`,
    }).toString();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
