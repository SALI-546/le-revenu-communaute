export const DEMO_CATEGORIES = [
  {
    slug: 'bourse',
    name: 'Bourse & actions',
    description:
      'Actions, ETF, PEA, compte-titres : stratégies et retours d’expérience.',
  },
  {
    slug: 'epargne',
    name: 'Épargne & placements',
    description:
      'Livrets, fonds, diversification : faire travailler son épargne.',
  },
  {
    slug: 'assurance-vie',
    name: 'Assurance-vie',
    description:
      'Fonds euros, unités de compte, frais et fiscalité des contrats.',
  },
  {
    slug: 'immobilier',
    name: 'Immobilier & SCPI',
    description: 'Résidence principale, locatif, SCPI et crédit immobilier.',
  },
  {
    slug: 'impots',
    name: 'Impôts & fiscalité',
    description:
      'Déclaration, niches fiscales et optimisation dans les règles.',
  },
  {
    slug: 'retraite',
    name: 'Retraite',
    description: 'PER, pensions et préparation financière de la retraite.',
  },
];

export const DEMO_USERS = [
  { username: 'Thomas', email: 'thomas@demo.lerevenu.test' },
  { username: 'Hugo', email: 'hugo@demo.lerevenu.test' },
  { username: 'Vincent', email: 'vincent@demo.lerevenu.test' },
  { username: 'Camille', email: 'camille@demo.lerevenu.test' },
];

export const DEMO_DISCUSSIONS = [
  {
    slug: 'ouvrir-un-pea-avec-5-000-eur-par-ou-commencer',
    title: 'Ouvrir un PEA avec 5 000 € : par où commencer ?',
    content:
      'Bonjour, je viens d’ouvrir un PEA en ligne et j’ai 5 000 € à y placer. Je ne connais pas grand-chose aux actions.\n\nVaut-il mieux tout investir d’un coup ou étaler ? Et sur quoi : des ETF, quelques actions ?',
    type: 'question',
    category: 'bourse',
    author: 'Thomas',
    replies: [
      {
        author: 'Vincent',
        content:
          'Pour débuter, un ETF éligible au PEA qui réplique un indice mondial fait très bien le travail : une seule ligne, des frais faibles, une large diversification.',
      },
      {
        author: 'Camille',
        content:
          'Première chose : vous avez bien une épargne de précaution à côté ? Le PEA, c’est de l’argent qu’on oublie au moins cinq ans.',
      },
    ],
  },
  {
    slug: 'j-ai-25-ans-et-10-000-eur-de-cote-je-fais-quoi',
    title: 'J’ai 25 ans et 10 000 € de côté : je fais quoi ?',
    content:
      'Premier CDI depuis un an, pas de projet immobilier avant quatre ou cinq ans. Je me sens un peu perdu entre PEA, assurance-vie et PER.',
    type: 'question',
    category: 'epargne',
    author: 'Hugo',
    replies: [
      {
        author: 'Thomas',
        content:
          'Commencez par un PEA pour le long terme et gardez une partie sur un livret. Le PER est surtout intéressant si vous êtes fortement imposé.',
      },
    ],
  },
  {
    slug: 'fonds-euros-quelle-part-gardez-vous-dans-votre-contrat',
    title: 'Fonds euros : quelle part gardez-vous dans votre contrat ?',
    content:
      'Suite à l’article du Revenu sur les rendements, je me demande quelle part vous conservez en fonds euros et en unités de compte.',
    type: 'discussion',
    category: 'assurance-vie',
    author: 'Vincent',
    replies: [],
  },
  {
    slug: 'credit-immobilier-renegocier-ou-faire-racheter-son-pret',
    title: 'Crédit immobilier : renégocier ou faire racheter son prêt ?',
    content:
      'Mon taux actuel est plus élevé que les offres du moment. Vaut-il mieux négocier avec ma banque ou passer par un rachat ?',
    type: 'question',
    category: 'immobilier',
    author: 'Camille',
    replies: [],
  },
  {
    slug: 'per-vos-retours-d-experience-apres-quelques-annees',
    title: 'PER : vos retours d’expérience après quelques années ?',
    content:
      'J’ai ouvert un PER il y a trois ans pour la déduction fiscale. Je m’interroge aujourd’hui sur les frais et la sortie.',
    type: 'discussion',
    category: 'retraite',
    author: 'Hugo',
    replies: [
      {
        author: 'Vincent',
        content:
          'Regardez bien les frais sur versements et la gestion pilotée : ce sont eux qui pèsent le plus sur la durée.',
      },
    ],
  },
] as const;
