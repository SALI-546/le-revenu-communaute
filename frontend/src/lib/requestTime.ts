import 'server-only';
import { connection } from 'next/server';

export const requestTime = async () => {
  await connection();
  return Date.now();
};
