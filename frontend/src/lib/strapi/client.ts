import 'server-only';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';

export class StrapiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'StrapiError';
    this.status = status;
  }
}

type StrapiRequest = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  query?: URLSearchParams;
  body?: unknown;
};

type StrapiErrorPayload = { error?: { message?: string } } | null;

export const strapiFetch = async <T>(
  path: string,
  { method = 'GET', token, query, body }: StrapiRequest = {},
): Promise<T> => {
  const search = query?.size ? `?${query}` : '';
  const response = await fetch(`${STRAPI_URL}/api${path}${search}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload: unknown =
    response.status === 204 ? null : await response.json();

  if (!response.ok) {
    const message =
      (payload as StrapiErrorPayload)?.error?.message ?? response.statusText;
    throw new StrapiError(response.status, message);
  }
  return payload as T;
};
