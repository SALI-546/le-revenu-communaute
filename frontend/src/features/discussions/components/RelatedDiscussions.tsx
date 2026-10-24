import { getDictionary, getLocale } from '@/dictionaries';
import { getRelatedDiscussions } from '../queries';
import type { CategorySummary } from '../types';
import { DiscussionCard } from './DiscussionCard';

type RelatedDiscussionsProps = {
  slug: string;
  category: CategorySummary | null;
};

export async function RelatedDiscussions({
  slug,
  category,
}: RelatedDiscussionsProps) {
  const [inSpace, dict, locale] = await Promise.all([
    category ? getRelatedDiscussions(slug, category.slug) : [],
    getDictionary(),
    getLocale(),
  ]);
  const discussions = inSpace.length
    ? inSpace
    : await getRelatedDiscussions(slug);
  if (discussions.length === 0) {
    return null;
  }
  const { related } = dict.discussions.detail;

  return (
    <section aria-labelledby="related-title" className="mt-12">
      <h2
        id="related-title"
        className="mb-4 font-display text-[23px] font-bold text-heading"
      >
        {category && inSpace.length
          ? related.title.replace('{space}', category.name)
          : related.titleAll}
      </h2>
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        {discussions.map((discussion) => (
          <DiscussionCard
            key={discussion.documentId}
            discussion={discussion}
            locale={locale}
            dict={dict.discussions}
          />
        ))}
      </div>
    </section>
  );
}
