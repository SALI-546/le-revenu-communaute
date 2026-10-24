import { getDictionary, getLocale } from '@/dictionaries';
import { localizedHref } from '@/dictionaries/config';
import { verifySession } from '@/lib/auth/dal';
import { getCategories } from '../queries';
import { DiscussionForm } from './DiscussionForm';

export async function NewDiscussionSection() {
  const locale = await getLocale();
  const redirectTo = localizedHref(locale, '/discussions/new');
  await verifySession(
    `${localizedHref(locale, '/login')}?${new URLSearchParams({ redirectTo })}`,
  );
  const [categories, { discussions }] = await Promise.all([
    getCategories(),
    getDictionary(),
  ]);

  return (
    <DiscussionForm
      categories={categories}
      locale={locale}
      dict={discussions.create.form}
    />
  );
}
