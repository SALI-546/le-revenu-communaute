'use server';

import { refresh, updateTag } from 'next/cache';
import * as z from 'zod';
import { DISCUSSIONS_TAG } from '@/features/discussions/queries';
import { documentIdSchema } from '@/features/discussions/schemas';
import { verifySession } from '@/lib/auth/dal';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import { replySchema } from './schemas';
import type { ReplyState } from './types';

export async function createReply(
  _state: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  const { token } = await verifySession();
  const content = String(formData.get('content') ?? '');
  const parsed = replySchema.safeParse({
    content,
    discussion: formData.get('discussion'),
  });
  if (!parsed.success) {
    return {
      status: 'error',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      content,
    };
  }

  try {
    await strapiFetch('/replies', {
      method: 'POST',
      token,
      body: { data: parsed.data },
    });
  } catch (error) {
    const notFound = error instanceof StrapiError && error.status === 404;
    return {
      status: 'error',
      error: notFound ? 'discussionNotFound' : 'unavailable',
      content,
    };
  }

  updateTag(DISCUSSIONS_TAG);
  refresh();
  return { status: 'success' };
}

export async function toggleHelpful(replyId: string) {
  const { token } = await verifySession();
  const id = documentIdSchema.safeParse(replyId);
  if (!id.success) {
    return;
  }
  try {
    await strapiFetch(`/replies/${id.data}/helpful`, {
      method: 'POST',
      token,
    });
  } catch (error) {
    // A refused vote (deleted reply, own reply) only refreshes the page to its real state.
    if (!(error instanceof StrapiError)) {
      throw error;
    }
  }
  updateTag(DISCUSSIONS_TAG);
  refresh();
}
