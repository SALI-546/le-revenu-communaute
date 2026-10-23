import { getDictionary } from '@/dictionaries';
import { CommunityHero } from '@/features/discussions/components/CommunityHero';

export default async function CommunityHomePage() {
  const { home } = await getDictionary();

  return (
    <main id="content">
      <CommunityHero hero={home.hero} />
    </main>
  );
}
