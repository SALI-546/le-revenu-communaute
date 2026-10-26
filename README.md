# Communauté Le Revenu

Espace communautaire où les lecteurs du Revenu posent des questions et échangent sur leurs placements. Le projet transforme une partie de la maquette HTML en application : un frontend **Next.js** et un backend **Strapi 5** sur **PostgreSQL**.

Fonctionnalités livrées :

- liste des discussions issue de Strapi, avec auteur, catégorie, nombre de réponses et date ; filtre par catégorie, tri par date et pagination côté serveur ;
- recherche dans les titres et les contenus (bonus), combinable avec le filtre et le tri ;
- navigation par espaces comme sur la maquette : colonne latérale avec les 11 espaces et leurs icônes colorées, page « Tous les espaces » avec le nombre de discussions, page « Charte », barre de navigation fixe sur mobile ;
- accueil vivant : hero avec les chiffres réels de la communauté (discussions, réponses, part des questions qui ont reçu une réponse), champ « Posez votre question » qui préremplit le formulaire de création, onglets « Récentes » et « Sans réponse » avec compteur, colonne « À vous de répondre » qui met en avant les questions encore sans réponse, carte d'accueil adaptée au visiteur ou au membre connecté ;
- page d'un espace (`?category=…`) : en-tête avec icône, chiffres de l'espace, lien vers la rubrique correspondante de lerevenu.com et bouton « Publier ici » qui présélectionne l'espace ;
- page d'une discussion enrichie : statut (« En attente de réponse » ou « A reçu une réponse »), boutons « Répondre » et « Copier le lien », badge « Auteur » sur les réponses de l'auteur, carte « Cette discussion » (réponses, dernière activité en temps relatif, participants), carte de l'espace avec « Publier dans cet espace », et « À lire aussi » dans le même espace, ou dans toute la communauté si l'espace n'a pas d'autre discussion ;
- détail d'une discussion sur une URL propre (`/fr/discussions/<slug>`) avec ses réponses, et publication d'une réponse ;
- création d'une discussion (titre de 10 caractères minimum, contenu, catégorie, type) avec erreurs de validation et redirection ;
- connexion avec les utilisateurs de démonstration, publication interdite aux visiteurs, auteur toujours imposé par le serveur ;
- interface en français et en anglais, responsive de 375 à 1440 px ;
- bouton clair/sombre comme sur lerevenu.com (clair par défaut) et vue compacte de la liste, deux préférences mémorisées dans le navigateur ;
- votes « Utile » sur les réponses (un vote par membre, retirable, impossible sur sa propre réponse) et meilleure réponse choisie par l'auteur de la discussion, signalée par « Résolu » dans la liste et mise en avant sur la page ;
- profil public de chaque membre (`/fr/members/<pseudo>`) : chiffres d'activité (discussions, réponses, votes « Utile » reçus, meilleures réponses), dernières discussions et dernières réponses. Les noms d'auteur et le menu du compte y mènent ;
- documentation Swagger de l'API, tests d'API et tests end-to-end.

## Sommaire

1. [Stack](#stack)
2. [Installation et lancement](#installation-et-lancement)
3. [Comptes de démonstration](#comptes-de-démonstration)
4. [Tests](#tests)
5. [Documentation de l'API](#documentation-de-lapi)
6. [Architecture du backend](#architecture-du-backend)
7. [Architecture du frontend](#architecture-du-frontend)
8. [Bibliothèques ajoutées](#bibliothèques-ajoutées)
9. [Limites et évolutions](#limites-et-évolutions)

## Stack

| Couche          | Technologie                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| Frontend        | Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript, Tailwind CSS 4.3 |
| Backend         | Strapi 5.59 (TypeScript), API REST, plugin Users & Permissions                        |
| Base de données | PostgreSQL 17 (Docker)                                                                |
| Tests           | `node:test` pour l'API, Playwright pour les parcours e2e                              |
| Qualité         | ESLint, Prettier, commitlint et husky                                                 |

Les projets ont été créés avec les CLI officielles (`create-next-app`, `create-strapi`). Les versions sont celles qu'elles installent : par exemple React 19.3.0, et Tailwind branché par `@tailwindcss/turbopack` (le montage par défaut de `create-next-app` 16.4).

## Installation et lancement

### Lancement rapide avec Docker (bonus)

Une seule commande construit et démarre PostgreSQL, Strapi et Next, sans Node.js sur la machine. Il faut seulement avoir créé `.env` et `backend/.env` (étape 2 ci-dessous) :

```bash
docker compose up -d --build --wait
```

- Application : http://localhost:3000, API : http://localhost:1337/api.
- Les images tournent en **mode production** : Strapi est compilé, Next utilise sa sortie `standalone`, et les deux processus s'exécutent sous un utilisateur non-root.
- Les secrets ne sont pas copiés dans les images (`.dockerignore`) : ils sont lus au démarrage depuis `.env` et `backend/.env`.
- Les services démarrent dans l'ordre grâce aux healthchecks : PostgreSQL, puis Strapi, puis Next. Le build de Next ne dépend pas de Strapi.
- En production, le plugin Documentation ne régénère pas Swagger : utilisez le mode développement ci-dessous pour y accéder.
- `docker compose down` arrête la stack. Les données restent dans le volume `postgres-data`.

Les étapes suivantes décrivent le **mode développement**, avec rechargement à chaud. N'utilisez pas les deux modes en même temps : ils partagent les ports 1337 et 3000.

### Prérequis

- **Node.js 22** (LTS supportée par Strapi). Un fichier `.nvmrc` est fourni : `nvm use`.
- **Docker** pour PostgreSQL.

### 1. Dépendances

```bash
npm install                 # outillage du dépôt (commitlint, husky, Prettier)
npm install --prefix backend
npm install --prefix frontend
```

### 2. Variables d'environnement

Chaque `.env.example` liste les variables sans secrets. Copiez-les puis remplacez les valeurs `change-me` et `tobemodified` :

```bash
cp .env.example .env                       # PostgreSQL (Docker)
cp backend/.env.example backend/.env       # Strapi
cp frontend/.env.example frontend/.env.local
```

- `DATABASE_PASSWORD` dans `backend/.env` doit être identique à `POSTGRES_PASSWORD` dans `.env`.
- Les secrets de Strapi (`APP_KEYS`, `JWT_SECRET`, etc.) se génèrent avec `openssl rand -base64 32`. `APP_KEYS` attend plusieurs valeurs séparées par des virgules.
- `SEED_USER_PASSWORD` est le mot de passe donné aux comptes de démonstration.
- PostgreSQL est exposé sur le port **5433**, pour ne pas entrer en conflit avec une installation locale sur 5432. Le port se change avec `POSTGRES_PORT` et `DATABASE_PORT`.

### 3. Base de données

```bash
docker compose up -d --wait postgres
```

Cette commande ne démarre que PostgreSQL. Strapi et Next se lancent ensuite avec npm.

### 4. Strapi

```bash
cd backend
npm run develop
```

Au premier démarrage, Strapi crée le schéma, configure les permissions des rôles et, si `SEED_DEMO_DATA=true`, insère les données de démonstration. Le seed est relançable : il ne crée que ce qui manque.

- API : http://localhost:1337/api
- Swagger : http://localhost:1337/documentation/v1.0.0
- Administration : http://localhost:1337/admin (compte administrateur à créer au premier accès)

### 5. Next.js

```bash
cd frontend
npm run dev                 # ou : npm run build && npm run start
```

L'application est servie sur http://localhost:3000. La racine redirige vers `/fr` ou `/en` selon la langue du navigateur.

## Comptes de démonstration

Le seed crée 11 catégories (les espaces), 12 discussions, 12 réponses et ces utilisateurs. Leur mot de passe est la valeur de `SEED_USER_PASSWORD` :

| Utilisateur | E-mail                       |
| ----------- | ---------------------------- |
| Thomas      | `thomas@demo.lerevenu.test`  |
| Hugo        | `hugo@demo.lerevenu.test`    |
| Vincent     | `vincent@demo.lerevenu.test` |
| Camille     | `camille@demo.lerevenu.test` |
| Odile       | `odile@demo.lerevenu.test`   |
| Nadia       | `nadia@demo.lerevenu.test`   |
| Karim       | `karim@demo.lerevenu.test`   |
| Sophie      | `sophie@demo.lerevenu.test`  |

## Tests

### API (backend)

```bash
cd backend
npm test
```

Les 23 tests démarrent un vrai Strapi sur une base `le_revenu_test`, **supprimée et recréée à chaque exécution** (ils refusent de démarrer si le `.env` pointe vers cette base), puis appellent l'API en HTTP. PostgreSQL doit tourner. Les tests couvrent les exigences du sujet :

| Exigence                          | Tests                                                                                                                                                                                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation d'une discussion       | titre de moins de 10 caractères refusé (400), titre de 10 caractères accepté, contenu vide refusé, catégorie inconnue refusée                                                                                                                                          |
| Publication sans authentification | création d'une discussion et d'une réponse refusées (401 ou 403)                                                                                                                                                                                                       |
| Usurpation d'auteur               | un `author` envoyé par le client est ignoré : l'auteur est vérifié **en base**, pour une discussion et pour une réponse ; modifier la discussion d'un autre renvoie 403                                                                                                |
| Affichage des discussions         | titre, auteur, catégorie, nombre de réponses, date, tri ; filtre par catégorie ; recherche ; aucune adresse e-mail exposée ; espaces triés avec icône, couleur et compteur ; discussions sans réponse ; chiffres de la communauté et d'un espace, slug invalide refusé |
| Votes et meilleure réponse        | un vote « Utile » compte une fois et se retire ; vote sur sa propre réponse ou sans connexion refusé (403) ; seul l'auteur choisit la meilleure réponse (403 sinon), qui doit appartenir à la discussion (400 sinon) et peut être retirée                              |
| Profil d'un membre                | chiffres d'activité exacts, aucune adresse e-mail ; 404 pour un membre inconnu, 400 pour un pseudo trop long                                                                                                                                                           |

### Parcours end-to-end (frontend)

```bash
cd frontend
npm run test:e2e
```

Playwright démarre Strapi et Next s'ils ne tournent pas déjà, puis exécute 23 parcours sur desktop et sur mobile : liste, filtre, recherche, onglet « Sans réponse », détail, lectures associées et copie du lien, vote « Utile » puis retrait, meilleure réponse affichée, profil d'un membre, mode sombre et vue compacte mémorisés après rechargement, redirection d'un visiteur vers la connexion (en conservant la question préremplie), préremplissage depuis le champ rapide, création avec erreurs de validation puis publication, réponse, et absence de défilement horizontal sur sept pages, à la taille de l'appareil puis à 375 px. Il utilise le Google Chrome installé sur la machine (`channel: 'chrome'`). Les tests écrivent dans la base de développement des contenus suffixés `[e2e]`. Si le port 3000 est déjà pris par une autre application, lancez `E2E_PORT=3100 npm run test:e2e`.

### Qualité

```bash
npx prettier --check .
npm run lint --prefix frontend
npm run typecheck --prefix frontend
npm run typecheck --prefix backend
```

Les messages de commit sont vérifiés par commitlint (`feat:` ou `fix:`, 40 caractères maximum).

## Documentation de l'API

Le plugin officiel `@strapi/plugin-documentation` publie une interface Swagger sur http://localhost:1337/documentation/v1.0.0. Pour tester une route protégée : appeler `POST /auth/local` avec un compte de démonstration, copier le `jwt`, cliquer sur **Authorize**, puis appeler `POST /discussions`.

La spécification générée automatiquement ne reflétait pas le vrai contrat : elle exigeait `slug`, proposait `author` et omettait la route par slug. Elle est corrigée dans `backend/src/documentation/openapi.ts` (hook `mutateDocumentation`), qui décrit les corps de requête réels, les paramètres de liste supportés et la forme exacte des réponses.

Routes principales :

| Méthode     | Route                                          | Accès                                                                                                                                                                                                                                                |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/api/discussions`                             | public : filtre `filters[category][slug][$eq]`, recherche `$containsi` sur `title` et `content`, discussions sans réponse avec `filters[replies][id][$null]=true`, tri `publishedAt:desc` ou `publishedAt:asc`, pagination de 50 éléments au maximum |
| GET         | `/api/members/:username`                       | public : profil d'un membre (pseudo, date d'inscription, chiffres d'activité, dernières discussions et réponses), sans e-mail                                                                                                                        |
| GET         | `/api/discussions/stats`                       | public : nombre de discussions, de réponses, de questions et de questions ayant reçu une réponse, de discussions sans réponse ; `?category=<slug>` pour un espace                                                                                    |
| GET         | `/api/discussions/slug/:slug`                  | public : discussion avec ses réponses                                                                                                                                                                                                                |
| POST        | `/api/discussions`                             | connecté                                                                                                                                                                                                                                             |
| PUT         | `/api/discussions/:id/best-reply`              | auteur uniquement : `{ data: { reply } }`, `null` pour retirer                                                                                                                                                                                       |
| PUT, DELETE | `/api/discussions/:id`                         | auteur uniquement                                                                                                                                                                                                                                    |
| POST        | `/api/replies`                                 | connecté                                                                                                                                                                                                                                             |
| POST        | `/api/replies/:id/helpful`                     | connecté, sauf sur sa propre réponse : ajoute ou retire le vote « Utile »                                                                                                                                                                            |
| GET         | `/api/replies/helpful?discussion=<documentId>` | connecté : réponses de la discussion que le membre a jugées utiles                                                                                                                                                                                   |
| PUT, DELETE | `/api/replies/:id`                             | auteur uniquement                                                                                                                                                                                                                                    |
| GET         | `/api/categories`                              | public                                                                                                                                                                                                                                               |

## Architecture du backend

```
backend/src/
  api/{category,discussion,reply,vote}/
    content-types/   schémas
    controllers/     validation et assainissement de l'entrée et de la sortie, puis appel du service
    services/        logique métier via le Document Service
    routes/          routes core et routes personnalisées (slug, statistiques, votes, meilleure réponse)
  api/member/        profil public : route, contrôleur et service, sans content type
  policies/          is-authenticated, is-owner (globales)
  bootstrap/         permissions des rôles et seed
  documentation/     contrat OpenAPI
  utils/             exposition publique de l'auteur
backend/tests/       tests d'API
```

### Modèle de données

| Type       | Champs                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Category   | `name` (unique), `slug` (UID unique), `description`, `icon` et `color` (énumérations fermées, traduites en icône Hugeicons et en token de couleur côté Next), `position` (ordre d'affichage), `discussions`     |
| Discussion | `title` (10 à 150 caractères), `content` (requis), `type` (`question` ou `discussion`), `slug` (UID unique), `author` → User, `category` → Category, `replies` → Reply, `bestReply` → Reply (meilleure réponse) |
| Reply      | `content` (requis), `author` → User, `discussion` → Discussion, `helpfulCount` (nombre de votes « Utile »)                                                                                                      |
| Vote       | `reply` → Reply, `voter` → User. Type privé, sans route publique : il garantit un seul vote par membre                                                                                                          |

- **`draftAndPublish` est désactivé** : un message de la communauté est publié immédiatement. De plus, Draft & Publish n'applique pas l'unicité aux brouillons.
- **Index et contraintes.** `name` et les deux `slug` ont un index **UNIQUE en base** grâce à l'option `column: { unique: true }`. L'attribut `unique` seul n'est vérifié que par Strapi. Les relations passent par des tables de liaison que Strapi indexe sur les deux clés étrangères.
- **Pas d'index dédié sur `published_at`.** Strapi l'inclut seulement dans un index composite `(document_id, locale, published_at)`. Ajouter un index par migration n'est pas fiable : les migrations s'exécutent avant la synchronisation du schéma, et cette synchronisation supprime les objets qu'elle ne connaît pas. Au volume d'une démonstration, le tri reste rapide. En production, on l'ajouterait côté base, hors de la synchronisation de Strapi.
- `author` est une relation **unidirectionnelle** vers l'utilisateur du plugin, ce qui évite de modifier son schéma.

### Contrôleurs, services et policies

- **Contrôleurs fins.** Ils valident la requête (`validateQuery`), assainissent l'entrée (`sanitizeInput`) et la sortie (`sanitizeOutput`), puis délèguent au service.
- **Services.** Toute la logique passe par le **Document Service**, avec des `populate` ciblés : seuls les champs utiles de l'auteur et de la catégorie sont chargés.
- **Auteur imposé.** À la création, le service ne lit que les champs autorisés et fixe `author` à partir de `ctx.state.user`. Tout `author` envoyé par le client est ignoré. Le service de mise à jour ne lit pas non plus `author` ni `slug`. Un `PUT` remplace la discussion : il attend tous les champs éditables (`title`, `content`, `type`, `category`).
- **Suppression.** Supprimer une discussion supprime aussi ses réponses, car Strapi ne supprime pas les relations en cascade.
- **Validation métier côté Strapi.** Le Document Service n'applique **pas** les contraintes `minLength` et `required` du schéma : un titre trop court était enregistré. Les services valident donc explicitement le titre (10 à 150 caractères), le contenu non vide, le type, l'existence de la catégorie et celle de la discussion.
- **Slug.** Le Document Service ne génère pas les UID. Le service construit le slug à partir du titre, avec un suffixe aléatoire, et l'index unique protège contre les collisions.
- **Policies.** `is-authenticated` protège les créations. `is-owner` protège les modifications et suppressions : 404 si le document n'existe pas, 403 si l'utilisateur n'en est pas l'auteur.
- **Erreurs HTTP.** 400 pour une validation, 401 pour un utilisateur non connecté, 403 pour un accès interdit, 404 pour une ressource introuvable. Un visiteur reçoit 403 avant même la policy, parce que le rôle Public n'a pas la permission de créer. La policy reste une défense en profondeur.
- **Votes « Utile ».** Chaque vote est un document `Vote`, ce qui permet de savoir qui a voté et de refuser un second vote. Le total est recompté avec `count()` et copié dans `Reply.helpfulCount` : la liste et le détail lisent un simple entier, sans exposer les votants ni charger les votes. Strapi ne sait pas déclarer un index unique sur deux colonnes : l'unicité du couple (réponse, votant) est vérifiée par le service. Supprimer une réponse supprime ses votes.
- **Meilleure réponse.** `PUT /discussions/:id/best-reply` passe par `is-owner`, comme la modification. Le service vérifie que la réponse appartient à la discussion.
- **Query Engine pour deux écritures.** Sans Draft & Publish, chaque `update()` du Document Service remet `publishedAt` à la date du jour (`statusToData` dans `@strapi/core`). Un vote déplacerait la réponse, et le choix d'une meilleure réponse ferait remonter la discussion en tête de liste. Ces deux écritures (`helpfulCount` et `bestReply`) passent donc par `strapi.db.query().update()`, qui ne touche que les colonnes demandées. C'est le cas que la documentation réserve au Query Engine. Un test d'API vérifie que les dates ne bougent pas.
- **Pagination.** 10 éléments par défaut et 50 au maximum (`config/api.ts`). Le tri est limité à `publishedAt` : toute autre valeur renvoie 400.

### Comptage des réponses

La liste affiche le nombre de réponses de chaque discussion. Il est obtenu avec `populate: { replies: { count: true } }`, qui exécute **une seule requête `COUNT` groupée** pour toute la page, sans N+1. Cette option n'apparaît pas dans la documentation de Strapi, mais elle est implémentée dans `@strapi/database` et utilisée par l'administration. Les alternatives documentées chargeaient tous les identifiants des réponses, ou faisaient une requête par discussion.

### Permissions et exposition des données

- Les permissions des rôles Public (lecture) et Authenticated (lecture et écriture) sont **synchronisées à chaque démarrage** dans `src/bootstrap/permissions.ts`, avec le même mécanisme que le plugin Users & Permissions. La configuration est donc reproductible et ne dépend jamais du frontend.
- `sanitizeOutput` retire une relation quand le rôle n'a pas le droit `find` sur le type ciblé. Accorder `users.find` au public rendrait `/api/users` accessible, **avec les e-mails**. Les contrôleurs n'exposent donc que le `username` de l'auteur, déjà sélectionné explicitement. Un test vérifie qu'aucune adresse e-mail ne sort de l'API.
- **Sessions JWT.** Le mode `refresh` de Strapi, avec ses jetons d'accès de 10 minutes, obligerait Next à réécrire le cookie pendant le rendu, ce qui n'est pas permis. Strapi est donc configuré en `legacy-support` avec des JWT de 7 jours.

## Architecture du frontend

```
frontend/src/
  app/[lang]/
    (community)/       accueil, discussions/[slug], discussions/new, spaces, charter, members/[username], 404, chargement, erreur
    (auth)/login/
  features/
    discussions/       queries.ts (lectures), actions.ts (mutations), schemas.ts (Zod), components/
    replies/           même découpage
    members/           profil public
    auth/
  lib/strapi/client.ts fetch typé unique vers Strapi
  lib/auth/            session (cookie), DAL
  components/          layout (header, pied de page), ui (composants génériques)
  dictionaries/        fr.json, en.json
  proxy.ts             langue et redirection optimiste
  styles/globals.css   tokens du design system
```

### Rendu et récupération des données

- **Server Components par défaut.** Seuls les éléments interactifs sont des Client Components : les formulaires (connexion, création, réponse), le sélecteur de tri, le sélecteur de langue, et les navigations latérale et mobile, qui lisent l'URL pour marquer l'élément actif. Elles sont rendues sous `<Suspense>` : la barre mobile a un fallback identique, sans état actif, pour éviter tout décalage.
- **Next ne parle qu'à Strapi**, via `lib/strapi/client.ts`, marqué `server-only`. Il n'accède jamais à PostgreSQL directement.
- **Lire et écrire sont séparés.** Les lectures sont des fonctions `'use cache'` dans `queries.ts`, appelées par des Server Components. Les mutations sont des Server Actions dans `actions.ts`.
- **Cache Components et Partial Prerendering.** Le contenu stable (en-tête, hero, titres) fait partie du shell statique. Ce qui dépend de la requête (paramètres d'URL, session) est streamé sous `<Suspense>`, avec un skeleton. Toutes les pages sont donc partiellement prérendues, et **le build ne dépend pas de Strapi**.
- **Recherche, onglet, tri, filtre et pagination** passent par l'URL (`?q=…&category=…&tab=…&sort=…&page=…`). Les paramètres sont validés par Zod, puis transmis à Strapi. Ils servent aussi de clé de cache. Aucun tri ni filtre n'est fait en JavaScript.
- La **recherche** utilise le composant `<Form>` de Next (`next/form`) : un formulaire GET qui navigue côté client et fonctionne aussi sans JavaScript. Strapi filtre les titres et les contenus avec `$containsi`. Le champ « Posez votre question » suit le même principe : un formulaire GET vers `/discussions/new?title=…&type=…&category=…`, dont les paramètres sont validés par Zod puis utilisés comme valeurs initiales. Un visiteur est envoyé vers la connexion avec ces paramètres dans `redirectTo`, et retrouve sa question après s'être connecté.
- **Votes et meilleure réponse côté Next.** La discussion reste en cache partagé. Ce qui dépend du membre (a-t-il voté ? est-il l'auteur ?) est lu à part, sans cache partagé, dans `ReplyActions` sous `<Suspense>`. Le fallback affiche déjà le compteur. Les votes du membre sont chargés en un seul appel par page grâce à `cache` de React. Les boutons sont des formulaires liés à des Server Actions (`toggleHelpful`, `chooseBestReply`) qui revalident le tag `discussions`. Ils fonctionnent donc sans JavaScript.
- **Mode sombre et vue compacte.** lerevenu.com propose un bouton clair/sombre, clair par défaut. Le mode sombre passe donc de `prefers-color-scheme` à une classe `.dark` sur `<html>`, avec la variante Tailwind documentée `@custom-variant dark`. La vue compacte suit le même principe avec `data-density` et une variante `compact`. Un petit script en `<head>` applique les préférences enregistrées avant le premier rendu, ce qui évite le flash. Les boutons changent d'icône et de libellé en CSS (`dark:`, `compact:`) : aucun état React, donc aucun écart d'hydratation. Ces préférences purement visuelles restent dans `localStorage` et ne passent pas par le serveur, ce qui garde les pages en cache.
- **Profil public.** La route `users` de Strapi exposerait les e-mails. Le profil passe donc par une API dédiée, `api/member`, qui ne renvoie que le pseudo, la date d'inscription, des compteurs (`count()` du Document Service, le total « Utile » étant le nombre de votes reçus) et les dernières publications, champ par champ. Un compte sans aucune publication répond 404 : la route ne permet pas de vérifier qu'un compte existe. Côté Next, les paramètres dynamiques arrivent encore encodés : le pseudo est décodé une seule fois (`decodeUsername`), sinon un pseudo accentué serait encodé deux fois vers Strapi.
- **Heure de la requête.** « Dernière activité » s'affiche en temps relatif (« il y a 2 heures »). Comme le recommande la documentation de Cache Components, `Date.now()` n'est appelé qu'après `connection()`, sous `<Suspense>`, via le petit utilitaire `lib/requestTime.ts`. La date absolue reste dans l'attribut `title`.
- **Chiffres de la communauté.** Un seul appel à `GET /discussions/stats`, qui compte côté Strapi avec `count()` du Document Service, au lieu de quatre requêtes paginées depuis Next. Le filtre « sans réponse » (`$null` sur la relation `replies`) n'est pas illustré dans la documentation de Strapi : son comportement est donc verrouillé par un test d'API. Le nombre de membres n'est pas affiché, car il demanderait d'ouvrir aux visiteurs la route `users/count`.

### Actualisation après une écriture

Les lectures sont étiquetées `cacheTag('discussions')` et durent quelques minutes (`cacheLife('minutes')`). Chaque action suit le même ordre :

1. `verifySession()`, qui revérifie la session auprès de Strapi ;
2. validation Zod ;
3. appel de Strapi avec le JWT ;
4. `updateTag('discussions')`, qui expire immédiatement la liste et les détails ;
5. pour une réponse, `refresh()`, qui met à jour la page courante sans redirection ; pour une discussion, `redirect()` vers la page créée.

L'utilisateur voit donc sa publication immédiatement, et le compteur de réponses de la liste est à jour.

### Authentification

- Le JWT Strapi est stocké dans le cookie `lr_session` (`httpOnly`, `secure`, `sameSite: 'lax'`, 7 jours), posé par une Server Action. JavaScript ne peut pas le lire.
- La DAL (`lib/auth/dal.ts`) fournit `getCurrentUser()`, mis en cache par rendu avec `cache` de React, qui appelle `/users/me` et ne renvoie que `{ id, username }`. Elle fournit aussi `verifySession()`, qui redirige vers la connexion.
- Le **proxy** ne fait aucun appel réseau. Il choisit la langue (`negotiator`, `@formatjs/intl-localematcher`) et redirige un visiteur sans cookie de `/discussions/new` vers la connexion, avec `redirectTo`. La vraie vérification reste dans la page et dans l'action.
- La lecture de session est isolée sous `<Suspense>` dans le header et la zone de réponse, comme le recommande le guide « Authentication with Cache Components ».
- La redirection après connexion n'accepte que des chemins internes. La cible est résolue comme le ferait un navigateur (`new URL`), ce qui bloque aussi les variantes comme `/\evil.com`.
- Si le cookie existe mais que le JWT n'est plus valide, la page de création renvoie vers la connexion dans la bonne langue, avec le retour vers la page demandée.

### États de chargement, d'erreur et vides

Chaque route a son `loading.tsx` (skeleton). Le groupe `(community)` a un `error.tsx` avec un bouton « Réessayer » (`retry()`), un `not-found.tsx` traduit, et une route attrape-tout pour les URL inconnues. La liste vide et une discussion introuvable ont leur propre écran. Si Strapi est injoignable, l'en-tête reste affiché et seule la zone de contenu montre l'erreur.

### Traductions

- Les routes sont sous `app/[lang]`, avec le français par défaut et l'anglais. La langue est lue avec `next/root-params`, sans la passer de composant en composant.
- `fr.json` et `en.json` ont les mêmes clés. Le type du dictionnaire vient de `fr.json`, donc une clé absente de `en.json` provoque une erreur de compilation.
- Aucun texte n'est écrit en dur dans les composants, `aria-label` et messages d'erreur compris. Les Server Actions renvoient des codes d'erreur, que l'interface traduit.
- Le contenu venant de Strapi n'est pas traduit.

### Design system

- L'identité reprend celle du **site réel lerevenu.com**, relevée dans ses feuilles de style : logo officiel, fond crème `#fff3ed`, titres bordeaux `#7c000e`, rouge `#cd1719` pour les boutons et les surtitres, pied de page en dégradé bordeaux, arrondis de 8 et 12 px. La maquette fournit la structure des écrans. Elle s'écartait de la marque sur le logo, la police du texte et la palette.
- La typographie suit les mesures relevées sur lerevenu.com : texte courant et extraits en 16 px, titres d'articles en Playfair de 18 à 22 px, titres de section de 24 à 30 px, signatures en petites capitales de 12 px. Les listes et l'article sont posés sur le fond crème, sans cadre, séparés par des filets, comme sur le site. Le gris-bleu des extraits (`#7e8b92`) et le rose des signatures (`#c2949a`) du site n'atteignent pas le contraste AA sur le fond crème (3,2:1 et 2,4:1) : les tokens `lede` et `meta` gardent leur teinte, assombrie pour dépasser 4,5:1.
- Ces tokens (clairs et sombres), les ombres, les polices et les breakpoints de la maquette sont déclarés une seule fois dans `globals.css`, avec `@theme`.
- **La palette par défaut de Tailwind est désactivée** (`--color-*: initial`). Seuls les tokens existent, ce qui rend impossible une couleur écrite en dur.
- Les polices sont celles du site, servies par `next/font` : Playfair Display pour les titres, Source Sans 3 pour le texte. Les icônes viennent uniquement de Hugeicons.
- Les dates s'affichent à l'heure de Paris (`Europe/Paris`), quel que soit le fuseau du serveur (UTC dans un conteneur).
- Le design est pensé mobile d'abord. Il est vérifié à 375, 768, 1024, 1280 et 1440 px, sans défilement horizontal, avec des zones tactiles de 44 px, un focus visible et le respect de `prefers-reduced-motion`.

## Bibliothèques ajoutées

En plus de ce qu'installent les CLI officielles :

| Paquet                                           | Où             | Pourquoi                                                                                                                                                                                                       |
| ------------------------------------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@strapi/utils`                                  | backend        | Classes d'erreurs (`ValidationError`, `NotFoundError`…) qui produisent les bons codes HTTP. Le paquet était déjà présent en dépendance transitive de Strapi : il est déclaré explicitement, à la même version. |
| `@strapi/plugin-documentation`                   | backend        | Swagger officiel de Strapi, pour tester les routes et partager le contrat avec l'équipe front.                                                                                                                 |
| `@types/pg`                                      | backend (dev)  | Types du driver `pg` déjà utilisé par Strapi, pour que les tests recréent la base de test.                                                                                                                     |
| `zod`                                            | frontend       | Validation des formulaires dans les Server Actions et des paramètres d'URL, avec des types dérivés des schémas.                                                                                                |
| `server-only`                                    | frontend       | Empêche d'importer par erreur le client Strapi ou la DAL dans un composant client.                                                                                                                             |
| `negotiator`, `@formatjs/intl-localematcher`     | frontend       | Choix de la langue selon `Accept-Language`, comme dans le guide i18n de Next.js.                                                                                                                               |
| `@hugeicons/react`, `@hugeicons/core-free-icons` | frontend       | Icônes du design (style Stroke Rounded).                                                                                                                                                                       |
| `clsx`                                           | frontend       | Composition des classes des variantes de composants.                                                                                                                                                           |
| `@playwright/test`                               | frontend (dev) | Tests end-to-end dans un navigateur réel.                                                                                                                                                                      |
| `commitlint`, `husky`, `prettier`                | racine (dev)   | Convention de commits et formatage commun aux deux projets.                                                                                                                                                    |

Les tests d'API utilisent le lanceur intégré à Node.js (`node:test`) et `fetch`, sans bibliothèque de test supplémentaire.

## Limites et évolutions

- **Hors périmètre volontairement** : les vues, « Suivre », « Signaler », le classement et les événements de la maquette, faute de données réelles derrière. Le nombre de membres n'est pas affiché pour ne pas ouvrir la route `users/count` aux visiteurs.
- **Modification et suppression** sont protégées côté API (`is-owner`) mais n'ont pas encore d'interface.
- **Cache.** Toute écriture invalide le tag `discussions`, donc toutes les listes et tous les détails en cache. C'est simple et sans risque à cette échelle. Avec beaucoup de trafic, on ajouterait un tag par discussion pour n'invalider que la page concernée.
- Le détail charge toutes les réponses d'une discussion. Pour de très longs fils, il faudrait les paginer.
- Une page au-delà de la dernière (`?page=99`) affiche l'état vide plutôt qu'une redirection.
- Le changement de langue conserve la page courante, mais pas les paramètres de filtre.
- **Sessions** : il n'y a pas de révocation côté serveur avant l'expiration du JWT. Le passage au mode `refresh` de Strapi demanderait un Route Handler chargé de renouveler le cookie.
- **Swagger** est public en local. En production, il faut activer « Restricted Access » dans l'administration. La documentation de Strapi signale aussi que ce plugin est peu maintenu, mais il fonctionne en 5.59.
- **Production** : servir l'application en HTTPS (cookie `secure`), ajouter un index sur `published_at`, et utiliser un cache partagé (`'use cache: remote'`) si l'application tourne sur plusieurs instances.
