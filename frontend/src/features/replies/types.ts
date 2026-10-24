import type { ReplyInput } from './schemas';

export type ReplyState = {
  status: 'idle' | 'success' | 'error';
  fieldErrors?: { [Field in keyof ReplyInput]?: string[] };
  error?: 'discussionNotFound' | 'unavailable';
  content?: string;
};
