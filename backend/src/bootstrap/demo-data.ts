export const DEMO_CATEGORIES = [
  {
    slug: 'bourse',
    name: 'Bourse & actions',
    description:
      'Actions, ETF, PEA, compte-titres : stratégies et retours d’expérience.',
    icon: 'chart',
    color: 'blue',
    position: 1,
  },
  {
    slug: 'economie',
    name: 'Économie',
    description:
      'Conjoncture, taux, inflation, emploi : l’actualité économique en France, en Europe et dans le monde.',
    icon: 'globe',
    color: 'slate',
    position: 2,
  },
  {
    slug: 'epargne',
    name: 'Épargne & placements',
    description: 'Livrets, fonds euros, obligations, comptes à terme.',
    icon: 'piggy-bank',
    color: 'green',
    position: 3,
  },
  {
    slug: 'assurance-vie',
    name: 'Assurance-vie',
    description: 'Choisir son contrat, arbitrer, transmettre.',
    icon: 'umbrella',
    color: 'teal',
    position: 4,
  },
  {
    slug: 'immobilier',
    name: 'Immobilier & SCPI',
    description: 'Résidence principale, locatif, SCPI, crédit immobilier.',
    icon: 'building',
    color: 'orange',
    position: 5,
  },
  {
    slug: 'impots',
    name: 'Impôts & fiscalité',
    description: 'Déclaration, niches fiscales, IFI : payer le juste impôt.',
    icon: 'invoice',
    color: 'indigo',
    position: 6,
  },
  {
    slug: 'retraite',
    name: 'Retraite',
    description: 'PER, rachat de trimestres, cumul emploi-retraite.',
    icon: 'sofa',
    color: 'rose',
    position: 7,
  },
  {
    slug: 'transmission',
    name: 'Famille & transmission',
    description: 'Donation, succession, protection du conjoint.',
    icon: 'family',
    color: 'purple',
    position: 8,
  },
  {
    slug: 'alternatifs',
    name: 'Or, cryptos & alternatifs',
    description: 'Or physique, cryptoactifs, forêts, private equity.',
    icon: 'diamond',
    color: 'cyan',
    position: 9,
  },
  {
    slug: 'budget',
    name: 'Budget & conso',
    description: 'Banques, crédits, assurances, bons plans.',
    icon: 'wallet',
    color: 'gray',
    position: 10,
  },
  {
    slug: 'cafe',
    name: 'Le Café du Revenu',
    description: 'Présentations, discussions libres, idées pour la rédaction.',
    icon: 'coffee',
    color: 'sand',
    position: 11,
  },
] as const;

export const DEMO_USERS = [
  { username: 'Thomas', email: 'thomas@demo.lerevenu.test' },
  { username: 'Hugo', email: 'hugo@demo.lerevenu.test' },
  { username: 'Vincent', email: 'vincent@demo.lerevenu.test' },
  { username: 'Camille', email: 'camille@demo.lerevenu.test' },
  { username: 'Odile', email: 'odile@demo.lerevenu.test' },
  { username: 'Nadia', email: 'nadia@demo.lerevenu.test' },
  { username: 'Karim', email: 'karim@demo.lerevenu.test' },
  { username: 'Sophie', email: 'sophie@demo.lerevenu.test' },
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
  {
    slug: 'taux-de-la-bce-quel-impact-sur-vos-placements',
    title: 'Taux de la BCE : quel impact sur vos placements ?',
    content:
      'La Banque centrale européenne a de nouveau ajusté ses taux. Crédits, livrets, fonds euros, obligations : qu’est-ce que cela change concrètement pour vous ?',
    type: 'discussion',
    category: 'economie',
    author: 'Karim',
    replies: [
      {
        author: 'Odile',
        content:
          'Côté obligations, j’en ai profité pour allonger un peu la durée de mon portefeuille. Les livrets suivent avec retard, comme toujours.',
      },
    ],
  },
  {
    slug: 'donation-aux-enfants-maintenant-ou-attendre',
    title: 'Donation aux enfants : faut-il le faire maintenant ou attendre ?',
    content:
      'Nos enfants ont 19, 22 et 25 ans. Nous pensons à leur donner une partie de notre épargne pour les aider à démarrer. Quels pièges éviter ?',
    type: 'question',
    category: 'transmission',
    author: 'Odile',
    replies: [
      {
        author: 'Camille',
        content:
          'L’abattement de 100 000 € par parent et par enfant se renouvelle tous les quinze ans : plus on commence tôt, plus on peut en profiter.',
      },
      {
        author: 'Vincent',
        content:
          'Pensez aussi à garder de quoi vivre confortablement. Un passage chez le notaire permet de cadrer la donation et d’éviter les mauvaises surprises.',
      },
    ],
  },
  {
    slug: 'or-physique-pieces-ou-lingots',
    title: 'Or physique : pièces ou lingots, que privilégier ?',
    content:
      'Je commence à acheter un peu d’or physique pour diversifier. Pièces ou lingots ? Et où les stocker sans trop de frais ?',
    type: 'question',
    category: 'alternatifs',
    author: 'Sophie',
    replies: [
      {
        author: 'Karim',
        content:
          'Les pièces courantes comme le napoléon sont plus faciles à revendre par petites quantités. Le lingot devient intéressant pour de gros montants.',
      },
    ],
  },
  {
    slug: 'changer-de-banque-vos-retours-sur-la-mobilite-bancaire',
    title: 'Changer de banque : vos retours sur la mobilité bancaire ?',
    content:
      'Je veux quitter ma banque traditionnelle pour une banque en ligne. Le service de mobilité fonctionne-t-il vraiment bien ?',
    type: 'discussion',
    category: 'budget',
    author: 'Camille',
    replies: [
      {
        author: 'Hugo',
        content:
          'Très bien de mon côté : prélèvements et virements ont été transférés en trois semaines. Gardez l’ancien compte ouvert un mois, par prudence.',
      },
    ],
  },
  {
    slug: 'location-meublee-micro-bic-ou-regime-reel',
    title: 'Location meublée : micro-BIC ou régime réel ?',
    content:
      'Je loue un studio meublé depuis deux mois. Je ne sais pas quel régime choisir pour ma première déclaration. Comment avez-vous fait votre choix ?',
    type: 'question',
    category: 'impots',
    author: 'Nadia',
    replies: [],
  },
  {
    slug: 'dividendes-sur-un-compte-titres-flat-tax-ou-bareme',
    title: 'Dividendes sur un compte-titres : flat tax ou barème ?',
    content:
      'Je perçois des dividendes sur un compte-titres ordinaire. Flat tax ou barème progressif : qu’avez-vous choisi et pourquoi ?',
    type: 'question',
    category: 'bourse',
    author: 'Karim',
    replies: [],
  },
  {
    slug: 'bienvenue-presentez-vous-ici',
    title: 'Bienvenue dans la communauté ! Présentez-vous ici',
    content:
      'Cet espace est le vôtre : dites-nous qui vous êtes, ce qui vous amène et les sujets d’argent qui vous intéressent le plus.',
    type: 'discussion',
    category: 'cafe',
    author: 'Sophie',
    replies: [
      {
        author: 'Thomas',
        content:
          'Bonjour à tous ! Lecteur du Revenu depuis dix ans, je m’intéresse surtout à la Bourse et à la préparation de la retraite.',
      },
      {
        author: 'Nadia',
        content:
          'Bonjour ! Jeune propriétaire bailleuse, je viens chercher des conseils sur la fiscalité de la location.',
      },
      {
        author: 'Odile',
        content:
          'Bonjour, retraitée et grand-mère : la transmission est mon grand sujet du moment. Ravie de vous lire !',
      },
    ],
  },
] as const;
