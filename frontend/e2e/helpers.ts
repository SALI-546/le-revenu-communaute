import type { Page } from '@playwright/test';

export const PEA_TITLE = 'Ouvrir un PEA avec 5 000 € : par où commencer ?';

export const login = async (page: Page, email: string) => {
  await page.goto('/fr/login');
  await page.getByLabel('Adresse e-mail').fill(email);
  await page.getByLabel('Mot de passe').fill(process.env.E2E_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.waitForURL('**/fr');
};

export const uniqueTitle = (prefix: string) => `${prefix} ${Date.now()} [e2e]`;
