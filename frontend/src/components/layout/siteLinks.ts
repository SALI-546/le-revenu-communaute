export const SITE_URL = 'https://www.lerevenu.com';

export const SUBSCRIBE_URL = `${SITE_URL}/subscription/`;

export const MAGAZINE_URL = `${SITE_URL}/kiosque/`;

export const SITE_SECTIONS = [
  { key: 'bourse', path: '/reussir-bourse/' },
  { key: 'placements', path: '/diversifier-placements/' },
  { key: 'immobilier', path: '/investir-immobilier/' },
  { key: 'impots', path: '/reduire-impots/' },
  { key: 'succession', path: '/preparer-succession/' },
] as const;

export const SITE_BAR_SECTIONS = [
  ...SITE_SECTIONS,
  { key: 'viePratique', path: '/vie-pratique/' },
] as const;

type SiteSectionKey = (typeof SITE_BAR_SECTIONS)[number]['key'];

export const SPACE_SECTIONS: Partial<Record<string, SiteSectionKey>> = {
  bourse: 'bourse',
  epargne: 'placements',
  'assurance-vie': 'placements',
  immobilier: 'immobilier',
  impots: 'impots',
  transmission: 'succession',
  budget: 'viePratique',
};
