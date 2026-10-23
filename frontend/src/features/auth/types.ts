import type { LoginInput } from './schemas';

export type LoginState = {
  fieldErrors?: { [Field in keyof LoginInput]?: string[] };
  error?: 'invalidCredentials' | 'unavailable';
  email?: string;
};
