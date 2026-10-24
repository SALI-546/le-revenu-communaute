import { expect, test } from '@playwright/test';
import { PEA_TITLE, login, uniqueTitle } from './helpers';

test.describe('discussion list', () => {
  test('shows title, author, category, reply count and date', async ({
    page,
  }) => {
    await page.goto('/fr?sort=oldest');

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

    await expect(
      page.getByRole('link', { name: 'Retraite', exact: true }),
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
    const feed = page.getByRole('region', { name: 'Fil des discussions' });
    await expect(feed.getByText('Résultats pour')).toBeVisible();
    await expect(feed.getByRole('link', { name: PEA_TITLE })).toBeVisible();
    await expect(
      feed.getByRole('link', { name: /Crédit immobilier/ }),
    ).toHaveCount(0);

    await page.getByRole('link', { name: 'Effacer la recherche' }).click();
    await expect(page).toHaveURL(/\/fr$/);
  });

  test('lists the discussions waiting for a reply', async ({ page }) => {
    await page.goto('/fr');
    await page.getByRole('link', { name: /^Sans réponse/ }).click();

    await expect(page).toHaveURL(/\/fr\?tab=unanswered$/);
    const feed = page.getByRole('region', { name: 'Fil des discussions' });
    const cards = await feed.getByRole('article').all();
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      await expect(card.locator('strong').first()).toHaveText('0');
    }
  });

  test('opens a discussion on its own URL with its replies', async ({
    page,
  }) => {
    await page.goto('/fr?sort=oldest');
    await page.getByRole('link', { name: PEA_TITLE }).click();

    await expect(page).toHaveURL(/\/fr\/discussions\/ouvrir-un-pea/);
    await expect(
      page.getByRole('heading', { level: 1, name: PEA_TITLE }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /réponses?$/ }),
    ).toBeVisible();
  });

  test('suggests related discussions and copies the link', async ({
    page,
    context,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(
      '/fr/discussions/ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
    );

    await expect(
      page.getByRole('heading', {
        name: 'À lire aussi dans « Bourse & actions »',
      }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Copier le lien' }).click();
    await expect(
      page.getByRole('button', { name: 'Lien copié' }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      page.url(),
    );
  });
});

test.describe('publishing', () => {
  test('sends anonymous visitors to the login page', async ({ page }) => {
    await page.goto('/fr/discussions/new');

    await expect(page).toHaveURL(
      /\/fr\/login\?redirectTo=%2Ffr%2Fdiscussions%2Fnew/,
    );
  });

  test('keeps a quick question through the login redirect', async ({
    page,
  }) => {
    await page.goto('/fr/discussions/new?title=Bonjour&category=bourse');

    await expect(page).toHaveURL(
      /redirectTo=%2Ffr%2Fdiscussions%2Fnew%3Ftitle%3DBonjour%26category%3Dbourse/,
    );
  });

  test('prefills the form from the quick question field', async ({ page }) => {
    await login(page, 'thomas@demo.lerevenu.test');
    await page.goto('/fr?category=bourse');
    const question = 'Faut-il renforcer son PEA maintenant ?';
    await page.getByLabel('Votre question pour la communauté').fill(question);
    await page.getByRole('button', { name: 'Continuer' }).click();

    await expect(page).toHaveURL(/\/fr\/discussions\/new\?/);
    await expect(page.getByLabel('Titre de la publication')).toHaveValue(
      question,
    );
    await expect(
      page.getByLabel('Catégorie').locator('option:checked'),
    ).toHaveText('Bourse & actions');
    await expect(page.getByRole('radio', { name: /^Question/ })).toBeChecked();
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
    await page.goto('/fr?sort=oldest');
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
