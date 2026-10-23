# Prompt Figma Make

Joindre `maquette-communaute-le-revenu.html` au prompt, puis coller le texte ci-dessous.
Exporter ensuite les écrans dans `docs/design/` (PNG ou PDF par écran et par taille).

---

Tu reçois la maquette HTML d'un espace communautaire pour « Le Revenu », média d'information financière (placements, investissement). Ne la redessine pas : garde la même structure d'écrans, le même contenu et la même identité visuelle. Ton rôle est d'en faire une version haut de gamme, cohérente et parfaitement responsive.

Identité à conserver strictement :
- Couleurs : brand #eb0f0f (hover #d00d0d, soft #ffeceb), ink #1d1d1f / #424245 / #6e6e73, fond #f5f5f7, surfaces #ffffff / #f2f2f4, lignes #e5e5ea / #c7c7cc, succès #1a8a4a, abonné #c9a032, hero #1c1c1e. Couleurs d'avatar #5856d6, #0a7f99, #6e6e73, #c93400, #d30f45.
- Typo : Playfair Display 700/900 pour les titres éditoriaux, Inter 400–700 pour le reste.
- Style : sobre, éditorial, type presse financière premium, avec des effets verre légers (blanc 72–86 % d'opacité).

Écrans à produire, chacun en 3 tailles (mobile 375, tablette 768, desktop 1440) :
1. Accueil communauté : liste des discussions (titre, auteur, catégorie, nombre de réponses, date), filtres par catégorie, tri par date, pagination.
2. Détail d'une discussion : contenu, auteur, date, catégorie, liste des réponses, formulaire de réponse.
3. Création d'une discussion : titre (10 caractères minimum), contenu, catégorie, type Question/Discussion, avec les erreurs de validation affichées.
4. Connexion simple.

Pour chaque écran, produis aussi les états chargement (skeleton), vide et erreur, et l'état « utilisateur non connecté » (le bouton publier invite à se connecter).

Breakpoints : conserve ceux de la maquette (760, 860, 1100, 1180 px). Pas de scroll horizontal. Zones tactiles d'au moins 44 px sur mobile.

Livre une page « Design system » : tokens de couleur et leurs équivalents en mode sombre (la maquette gère prefers-color-scheme: dark), échelle typo, espacements sur une grille de 4/8 px, rayons, ombres. Ajoute la liste des composants réutilisables (DiscussionCard, CategoryChip, Avatar, ReplyItem, ReplyForm, Pagination, EmptyState, Skeleton, Header, Sidebar catégories) avec leurs variantes.

Contraste WCAG AA minimum, focus visible, et respect de prefers-reduced-motion. Les icônes doivent être de style trait arrondi (compatible Hugeicons Stroke Rounded).
