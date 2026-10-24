import { connection } from 'next/server';
import { getDictionary, getLocale } from '@/dictionaries';
import { getCategories, getCommunityStats } from '../queries';
import { listSearchParamsSchema } from '../schemas';
import { CommunityHero } from './CommunityHero';
import { QuickAsk } from './QuickAsk';
import { SpaceHeader } from './SpaceHeader';

type CommunityIntroProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function CommunityIntro({ searchParams }: CommunityIntroProps) {
  await connection();
  const { category: slug } = listSearchParamsSchema.parse(await searchParams);
  const [categories, scopedStats, { home, discussions, layout }, locale] =
    await Promise.all([
      getCategories(),
      getCommunityStats(slug),
      getDictionary(),
      getLocale(),
    ]);
  const category = categories.find((space) => space.slug === slug);
  const stats = slug && !category ? await getCommunityStats() : scopedStats;

  return (
    <div className="grid gap-6">
      {category ? (
        <SpaceHeader
          category={category}
          stats={stats}
          locale={locale}
          labels={home.space}
          list={discussions.list}
          sections={layout.pressBar.sections}
        />
      ) : (
        <CommunityHero
          hero={home.hero}
          list={discussions.list}
          stats={stats}
          spaces={categories.length}
          locale={locale}
        />
      )}
      <QuickAsk
        locale={locale}
        labels={home.quickAsk}
        types={discussions.types}
        space={category && { slug: category.slug, name: category.name }}
      />
    </div>
  );
}
