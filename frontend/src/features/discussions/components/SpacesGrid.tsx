import Link from 'next/link';
import { connection } from 'next/server';
import { getDictionary, getLocale } from '@/dictionaries';
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
  const plural = new Intl.PluralRules(locale);

  return (
    <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map(
        ({ slug, name, description, icon, color, discussions }) => (
          <li key={slug}>
            <Link
              href={listHref(locale, { category: slug })}
              className="flex h-full flex-col gap-1.5 rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="mb-1.5">
                <SpaceIcon icon={icon} color={color} size="md" />
              </span>
              <span className="font-display text-lg font-bold text-heading">
                {name}
              </span>
              <span className="flex-1 text-sm text-ink-2">{description}</span>
              <span className="text-xs text-ink-3">
                {discussions.count}{' '}
                {
                  spaces.count[
                    plural.select(discussions.count) === 'one' ? 'one' : 'other'
                  ]
                }
              </span>
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
