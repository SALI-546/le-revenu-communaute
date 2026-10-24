import { expect, test } from '@playwright/test';
import { PEA_TITLE, login, uniqueTitle } from './helpers';

test.describe('discussion list', () => {
  test('shows title, author, category, reply count and date', async ({
    page,
  }) => {
    await page.goto('/fr');

    const card = page.getByRole('article').filter({ hasText: PEA_TITLE });
    await expect(card.getByRole('link', { name: PEA_TITLE })).toBeVisible();
    await expect(card).toContainText('Thomas');
    await expect(card).toContainText('Bourse & actions');
    await expect(card).toContainText(/\d+\s*réponses?/);
    await expect(card.locator('time')).toHaveAttribute(
      'datetime',
      /^\d{4}-\d{2}-\d{2}T/,
    );
  });

  test('filters by category through the URL', async ({ page }) => {
    await page.goto('/fr?category=retraite');

    const categories = page.getByRole('navigation', { name: 'Catégories' });
    await expect(
      categories.getByRole('link', { name: 'Retraite' }),
    ).toHaveAttribute('aria-current', 'page');
    for (const card of await page.getByRole('article').all()) {
      await expect(card).toContainText('Retraite');
    }
  });

  test('searches discussions and clears the search', async ({ page }) => {
    await page.goto('/fr');
    const search = page.getByRole('searchbox', {
      name: 'Rechercher dans la communauté',
    });
    await search.fill('pea');
    await search.press('Enter');

    await expect(page).toHaveURL(/\/fr\?q=pea$/);
    await expect(page.getByText('Résultats pour')).toBeVisible();
    await expect(page.getByRole('link', { name: PEA_TITLE })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Crédit immobilier/ }),
    ).toHaveCount(0);

    await page.getByRole('link', { name: 'Effacer la recherche' }).click();
    await expect(page).toHaveURL(/\/fr$/);
  });

  test('opens a discussion on its own URL with its replies', async ({
    page,
  }) => {
    await page.goto('/fr');
    await page.getByRole('link', { name: PEA_TITLE }).click();

    await expect(page).toHaveURL(/\/fr\/discussions\/ouvrir-un-pea/);
    await expect(
      page.getByRole('heading', { level: 1, name: PEA_TITLE }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /réponses?$/ }),
    ).toBeVisible();
  });
});

test.describe('publishing', () => {
  test('sends anonymous visitors to the login page', async ({ page }) => {
    await page.goto('/fr/discussions/new');

    await expect(page).toHaveURL(
      /\/fr\/login\?redirectTo=%2Ffr%2Fdiscussions%2Fnew/,
    );
  });

  test('shows validation errors, then publishes a discussion', async ({
    page,
  }) => {
    await login(page, 'thomas@demo.lerevenu.test');
    await page.goto('/fr/discussions/new');

    await page.getByLabel('Titre de la publication').fill('Trop bref');
    await page.getByRole('button', { name: 'Publier', exact: true }).click();
    await expect(
      page.getByText('Le titre doit contenir au moins 10 caractères.'),
    ).toBeVisible();
    await expect(page.getByText('Sélectionnez une catégorie.')).toBeVisible();
    await expect(page.getByText('Le message est obligatoire.')).toBeVisible();

    const title = uniqueTitle('Faut-il garder une épargne de précaution ?');
    await page.getByLabel('Titre de la publication').fill(title);
    await page
      .getByLabel('Catégorie')
      .selectOption({ label: 'Épargne & placements' });
    await page
      .getByLabel('Votre message')
      .fill('Combien de mois de dépenses conseillez-vous ?');
    await page.getByRole('button', { name: 'Publier', exact: true }).click();

    await expect(
      page.getByRole('heading', { level: 1, name: title }),
    ).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Thomas');
  });

  test('posts a reply on a discussion', async ({ page }) => {
    await login(page, 'hugo@demo.lerevenu.test');
    await page.goto('/fr');
    await page.getByRole('link', { name: PEA_TITLE }).click();

    const reply = uniqueTitle('Pensez à comparer les frais de courtage.');
    await page.getByLabel('Votre réponse').fill(reply);
    await page.getByRole('button', { name: 'Publier ma réponse' }).click();

    await expect(
      page.getByText('Votre réponse a bien été publiée.'),
    ).toBeVisible();
    await expect(page.getByText(reply)).toBeVisible();
  });
});
