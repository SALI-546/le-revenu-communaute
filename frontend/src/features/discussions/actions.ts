'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import { defaultLocale, hasLocale } from '@/dictionaries/config';
import { verifySession } from '@/lib/auth/dal';
import { StrapiError, strapiFetch } from '@/lib/strapi/client';
import { DISCUSSIONS_TAG } from './queries';
import { discussionSchema } from './schemas';
import type { DiscussionFormState } from './types';

export async function createDiscussion(
  _state: DiscussionFormState,
  formData: FormData,
): Promise<DiscussionFormState> {
  const { token } = await verifySession();
  const values = {
    type: String(formData.get('type') ?? ''),
    category: String(formData.get('category') ?? ''),
  };
  const parsed = discussionSchema.safeParse({
    ...values,
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  }

  let slug: string;
  try {
    const { data } = await strapiFetch<{ data: { slug: string } }>(
      '/discussions',
      {
        method: 'POST',
        token,
        body: { data: parsed.data },
      },
    );
    slug = data.slug;
  } catch (error) {
    if (
      error instanceof StrapiError &&
      error.status === 400 &&
      error.message.includes('category')
    ) {
      return { fieldErrors: { category: ['categoryInvalid'] }, values };
    }
    return { error: 'unavailable', values };
  }

  updateTag(DISCUSSIONS_TAG);
  const locale = String(formData.get('locale') ?? '');
  redirect(
    `/${hasLocale(locale) ? locale : defaultLocale}/discussions/${slug}`,
  );
}
