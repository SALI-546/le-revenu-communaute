import { connection } from 'next/server';
import { getDictionary, getLocale } from '@/dictionaries';
import { getCategories } from '@/features/discussions/queries';
import { SidebarNav } from './SidebarNav';

export async function CommunitySidebar() {
  await connection();
  const [categories, { layout, discussions }, locale] = await Promise.all([
    // The sidebar lives above the error boundary: an unreachable API only hides the spaces.
    getCategories().catch(() => []),
    getDictionary(),
    getLocale(),
  ]);
  const spaces = categories.map(({ slug, name, icon, color }) => ({
    slug,
    name,
    icon,
    color,
  }));

  return (
    <SidebarNav
      locale={locale}
      spaces={spaces}
      labels={layout.sidebar}
      trust={discussions.list.trust}
    />
  );
}
