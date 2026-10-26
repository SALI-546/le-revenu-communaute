import Link from 'next/link';
import { connection } from 'next/server';
import { DashboardSquare01Icon } from '@hugeicons/core-free-icons';
import { StateCard } from '@/components/ui/StateCard';
import { getDictionary, getLocale } from '@/dictionaries';
import { pluralize } from '@/lib/plural';
import { listHref } from '../listHref';
import { getCategories } from '../queries';
import { SpaceIcon } from './SpaceIcon';

export async function SpacesGrid() {
  await connection();
  const [categories, { spaces }, locale] = await Promise.all([
    getCategories(),
    getDictionary(),
    getLocale(),
  ]);

  if (categories.length === 0) {
    return (
      <StateCard
        icon={DashboardSquare01Icon}
        title={spaces.empty.title}
        description={spaces.empty.description}
      />
    );
  }

  return (
    <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map(
        ({ slug, name, description, icon, color, discussions }) => (
          <li key={slug}>
            <Link
              href={listHref(locale, { category: slug })}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="mb-1.5">
                <SpaceIcon icon={icon} color={color} size="md" />
              </span>
              <span className="font-display text-lg font-bold text-heading">
                {name}
              </span>
              <span className="flex-1 text-[15px] leading-relaxed text-ink-2">
                {description}
              </span>
              <span className="text-sm text-ink-3">
                {discussions.count}{' '}
                {pluralize(locale, discussions.count, spaces.count)}
              </span>
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
