import { expect, test, type Page } from '@playwright/test';

const pages = [
  '/fr',
  '/fr?q=pea',
  '/fr?category=bourse',
  '/fr/spaces',
  '/fr/discussions/ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
  '/fr/members/Vincent',
  '/fr/login',
];

const overflowOf = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

for (const path of pages) {
  test(`has no horizontal scroll on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    expect(await overflowOf(page)).toBe(0);

    await page.setViewportSize({ width: 375, height: 812 });
    expect(await overflowOf(page)).toBe(0);
  });
}
