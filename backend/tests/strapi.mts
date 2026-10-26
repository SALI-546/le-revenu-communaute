import { createRequire } from 'node:module';
import pg from 'pg';
import type { Core } from '@strapi/strapi';

// The ESM build of @strapi/core breaks under native Node ESM (named lodash imports), so load the CommonJS one.
const { compileStrapi, createStrapi } = createRequire(import.meta.url)(
  '@strapi/strapi',
) as typeof import('@strapi/strapi');

const TEST_DATABASE = 'le_revenu_test';
const PORT = 1338;

export const TEST_PASSWORD = 'demo-password-for-tests';
export const API_URL = `http://127.0.0.1:${PORT}/api`;

type Author = { username: string } | null;

export type Discussion = {
  documentId: string;
  title: string;
  slug: string;
  type: string;
  publishedAt: string;
  author: Author;
  category: { documentId: string; name: string; slug: string };
  replies: { count: number };
};

export type Reply = { documentId: string; content: string; author: Author };

type ApiBody<T> = {
  data: T;
  meta?: { pagination: { page: number; pageSize: number; total: number } };
  error?: { status: number; name: string; message: string };
};

type RequestOptions = { method?: string; token?: string; data?: unknown };

const resetDatabase = async () => {
  if (process.env.DATABASE_NAME === TEST_DATABASE) {
    throw new Error(
      `DATABASE_NAME must not be ${TEST_DATABASE}: the tests drop that database.`,
    );
  }
  const client = new pg.Client({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'postgres',
  });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS ${TEST_DATABASE} WITH (FORCE)`);
  await client.query(`CREATE DATABASE ${TEST_DATABASE}`);
  await client.end();
};

export const startStrapi = async (): Promise<Core.Strapi> => {
  await resetDatabase();
  Object.assign(process.env, {
    DATABASE_NAME: TEST_DATABASE,
    HOST: '127.0.0.1',
    PORT: String(PORT),
    SEED_DEMO_DATA: 'true',
    SEED_USER_PASSWORD: TEST_PASSWORD,
  });
  const app = createStrapi({
    ...(await compileStrapi()),
    serveAdminPanel: false,
  });
  await app.start();
  return app;
};

export const request = async <T,>(
  path: string,
  { method = 'GET', token, data }: RequestOptions = {},
) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data === undefined ? undefined : JSON.stringify({ data }),
  });
  const text = await response.text();
  return {
    status: response.status,
    body: (text ? JSON.parse(text) : {}) as ApiBody<T>,
  };
};

export const login = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password: TEST_PASSWORD }),
  });
  const { jwt } = (await response.json()) as { jwt: string };
  return jwt;
};

export const currentUserId = async (token: string) => {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { id } = (await response.json()) as { id: number };
  return id;
};
