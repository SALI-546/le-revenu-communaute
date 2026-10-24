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
