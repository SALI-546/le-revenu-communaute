import { expect, test } from '@playwright/test';

const pages = [
  '/fr',
  '/fr?q=pea',
  '/fr/discussions/ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
  '/fr/login',
];

for (const path of pages) {
  test(`has no horizontal scroll on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}
