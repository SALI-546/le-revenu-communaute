import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { verifySession } from '@/lib/auth/dal';
import { getCategories } from '../queries';
import { discussionPrefillSchema } from '../schemas';
import { DiscussionForm } from './DiscussionForm';

type NewDiscussionSectionProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const toQuery = (values: Record<string, string | undefined>) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value) {
      query.set(key, value);
    }
  }
  return query.size ? `?${query}` : '';
};

export async function NewDiscussionSection({
  searchParams,
}: NewDiscussionSectionProps) {
  const [locale, prefill] = await Promise.all([
    getLocale(),
    searchParams.then((params) => discussionPrefillSchema.parse(params)),
  ]);
  const redirectTo = `${localizedHref(locale, '/discussions/new')}${toQuery(prefill)}`;
  await verifySession(
    `${localizedHref(locale, '/login')}?${new URLSearchParams({ redirectTo })}`,
  );
  const [categories, { discussions }] = await Promise.all([
    getCategories(),
    getDictionary(),
  ]);
  const category = categories.find(({ slug }) => slug === prefill.category);

  return (
    <DiscussionForm
      categories={categories}
      locale={locale}
      dict={discussions.create.form}
      initial={{ ...prefill, category: category?.documentId }}
    />
  );
}
