import { expect, test } from '@playwright/test';

test.describe('reading preferences', () => {
  test('starts in light mode and remembers the dark theme', async ({
    page,
  }) => {
    await page.goto('/fr');
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/\bdark\b/);

    await page.getByRole('button', { name: 'Activer le mode sombre' }).click();
    await expect(html).toHaveClass(/\bdark\b/);
    await page.reload();

    await expect(html).toHaveClass(/\bdark\b/);
    await expect(
      page.getByRole('button', { name: 'Activer le mode clair' }),
    ).toBeVisible();
  });

  test('hides excerpts in the compact view and remembers it', async ({
    page,
  }) => {
    await page.goto('/fr');
    const feed = page.getByRole('region', { name: 'Fil des discussions' });
    const excerpt = feed.getByText(/Cet espace est le vôtre/);
    await expect(excerpt).toBeVisible();

    await page.getByRole('button', { name: 'Vue compacte' }).click();
    await expect(excerpt).toBeHidden();
    await page.reload();

    await expect(excerpt).toBeHidden();
    await page.getByRole('button', { name: 'Vue détaillée' }).click();
    await expect(excerpt).toBeVisible();
  });
});
