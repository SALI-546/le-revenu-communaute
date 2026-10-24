export const SITE_URL = 'https://www.lerevenu.com';

export const SUBSCRIBE_URL = `${SITE_URL}/subscription/`;

export const SITE_SECTIONS = [
  { key: 'bourse', path: '/reussir-bourse/' },
  { key: 'placements', path: '/diversifier-placements/' },
  { key: 'immobilier', path: '/investir-immobilier/' },
  { key: 'impots', path: '/reduire-impots/' },
  { key: 'succession', path: '/preparer-succession/' },
] as const;
