import 'server-only';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'lr_session';

// Matches the 7 days JWT lifetime configured in Strapi.
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export const createSession = async (jwt: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
};

export const getSessionToken = async () =>
  (await cookies()).get(SESSION_COOKIE)?.value;

export const deleteSession = async () => {
  (await cookies()).delete(SESSION_COOKIE);
};
