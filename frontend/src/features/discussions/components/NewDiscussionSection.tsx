import { getDictionary, getLocale } from '@/dictionaries';
import { verifySession } from '@/lib/auth/dal';
import { getCategories } from '../queries';
import { DiscussionForm } from './DiscussionForm';

export async function NewDiscussionSection() {
  await verifySession();
  const [categories, { discussions }, locale] = await Promise.all([
    getCategories(),
    getDictionary(),
    getLocale(),
  ]);

  return (
    <DiscussionForm
      categories={categories}
      locale={locale}
      dict={discussions.create.form}
    />
  );
}
