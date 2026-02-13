import { useState, useEffect, useRef } from "react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type IslandId =
  | "francais"
  | "maths"
  | "monde"
  | "arts"
  | "histoire"
  | "geo"
  | "orthographe"
  | "blagues";

interface Avatar {
  id: string;
  emoji: string;
  name: string;
}

interface IslandProgress {
  level: number;
  unlocked: number[];
  stars: number[];
}

interface Progress {
  avatar: Avatar | null;
  stars: number;
  badges: string[];
  francais: IslandProgress;
  maths: IslandProgress;
  monde: IslandProgress;
  arts: IslandProgress;
  histoire: IslandProgress;
  geo: IslandProgress;
  orthographe: IslandProgress;
  blagues: IslandProgress;
}

const INITIAL_PROGRESS: Progress = {
  avatar: null,
  stars: 0,
  badges: [],
  francais: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  maths: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  monde: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  arts: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  histoire: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  geo: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  orthographe: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  blagues: { level: 1, unlocked: [1], stars: [0, 0, 0] },
};

const AVATARS: Avatar[] = [
  { id: "fox", emoji: "🦊", name: "Rusé le Renard" },
  { id: "dragon", emoji: "🐉", name: "Flamme le Dragon" },
  { id: "lion", emoji: "🦁", name: "Roi le Lion" },
  { id: "unicorn", emoji: "🦄", name: "Étoile la Licorne" },
];

const ISLANDS = [
  {
    id: "francais" as const,
    name: "Île Dino-Lettres",
    emoji: "🏝️",
    color: "bg-emerald-600",
    desc: "Français",
  },
  {
    id: "maths" as const,
    name: "Île Volcan-Nombres",
    emoji: "🌋",
    color: "bg-red-500",
    desc: "Mathématiques",
  },
  {
    id: "monde" as const,
    name: "Île Spatiale",
    emoji: "🚀",
    color: "bg-indigo-500",
    desc: "Questionner le monde",
  },
  {
    id: "arts" as const,
    name: "Île Créative",
    emoji: "🎨",
    color: "bg-fuchsia-500",
    desc: "Arts & Logique",
  },
  {
    id: "histoire" as const,
    name: "Île du Temps",
    emoji: "⏳",
    color: "bg-amber-700",
    desc: "Histoire",
  },
  {
    id: "geo" as const,
    name: "Île de France",
    emoji: "🗼",
    color: "bg-rose-600",
    desc: "Géographie France",
  },
  {
    id: "orthographe" as const,
    name: "Île des Mots",
    emoji: "✏️",
    color: "bg-cyan-600",
    desc: "Orthographe",
  },
  {
    id: "blagues" as const,
    name: "Île Rigolote",
    emoji: "😂",
    color: "bg-yellow-500",
    desc: "Blagues",
  },
];

interface Exercise {
  type: string;
  q: string;
  options: string[];
  answer: string;
  img: string;
}

const TIMER_QCM: Record<number, number> = { 1: 25, 2: 20, 3: 15 };
const TIMER_COMPLETION: Record<number, number> = { 1: 35, 2: 30, 3: 25 };

const EXERCISES: Record<IslandId, Record<number, Exercise[]>> = {
  francais: {
    1: [
      {
        type: "qcm",
        q: 'Combien de syllabes dans "CROCODILE" ?',
        options: ["2", "3", "4", "5"],
        answer: "3",
        img: "🐊",
      },
      {
        type: "qcm",
        q: 'Quel son entends-tu à la fin de "KANGOUROU" ?',
        options: ["KAN", "GOU", "ROU", "KOU"],
        answer: "ROU",
        img: "🦘",
      },
      {
        type: "qcm",
        q: 'Combien de syllabes dans "ORDINATEUR" ?',
        options: ["2", "3", "4", "5"],
        answer: "4",
        img: "💻",
      },
      {
        type: "qcm",
        q: 'Quel mot commence par le même son que "CHAPEAU" ?',
        options: ["SAPIN", "CHEVAL", "PAPA", "CAMION"],
        answer: "CHEVAL",
        img: "🎩",
      },
      {
        type: "qcm",
        q: 'Combien de syllabes dans "PARACHUTE" ?',
        options: ["2", "3", "4", "5"],
        answer: "3",
        img: "🪂",
      },
    ],
    2: [
      {
        type: "qcm",
        q: 'Quel est le contraire de "MONTER" ?',
        options: ["COURIR", "DESCENDRE", "SAUTER", "VOLER"],
        answer: "DESCENDRE",
        img: "⬇️",
      },
      {
        type: "qcm",
        q: "Trouve le mot bien écrit :",
        options: ["ÉLÉFANT", "ÉLÉPHANT", "ÉLEPHANT", "ELÉFANT"],
        answer: "ÉLÉPHANT",
        img: "🐘",
      },
      {
        type: "qcm",
        q: 'Quel est le féminin de "UN PRINCE" ?',
        options: ["UNE PRINCE", "UNE PRINCESSE", "UNE PRINSE", "UNE PRINSESSE"],
        answer: "UNE PRINCESSE",
        img: "👸",
      },
      {
        type: "qcm",
        q: "Trouve le mot bien écrit :",
        options: ["TOUJOUR", "TOUJOURS", "TOUJORS", "TOUJOURE"],
        answer: "TOUJOURS",
        img: "🕐",
      },
      {
        type: "qcm",
        q: "Quel animal peut voler et vit la nuit ?",
        options: ["LA TORTUE", "LE SERPENT", "LA CHAUVE-SOURIS", "LE CRABE"],
        answer: "LA CHAUVE-SOURIS",
        img: "🦇",
      },
    ],
    3: [
      {
        type: "qcm",
        q: '"Le chat grimpe dans l\'arbre car le chien le poursuit." Pourquoi le chat grimpe-t-il ?',
        options: [
          "Il a faim",
          "Le chien le poursuit",
          "Il veut dormir",
          "Il cherche un oiseau",
        ],
        answer: "Le chien le poursuit",
        img: "🐱",
      },
      {
        type: "qcm",
        q: '"Pierre a oublié son parapluie. En sortant, il est tout mouillé." Pourquoi est-il mouillé ?',
        options: [
          "Il a pris un bain",
          "Il pleut dehors",
          "Il a nagé",
          "Il a bu de l'eau",
        ],
        answer: "Il pleut dehors",
        img: "🌧️",
      },
      {
        type: "qcm",
        q: '"Marie lit tous les soirs avant de dormir." Marie aime...',
        options: ["dormir", "manger", "lire", "courir"],
        answer: "lire",
        img: "📖",
      },
      {
        type: "qcm",
        q: '"Le boulanger se lève très tôt pour préparer le pain." Quand se lève-t-il ?',
        options: ["À midi", "Très tôt le matin", "Le soir", "L'après-midi"],
        answer: "Très tôt le matin",
        img: "🥖",
      },
      {
        type: "qcm",
        q: '"Les hirondelles partent en automne et reviennent au printemps." Ces oiseaux sont...',
        options: ["nocturnes", "migrateurs", "marins", "domestiques"],
        answer: "migrateurs",
        img: "🐦",
      },
    ],
  },
  maths: {
    1: [
      {
        type: "qcm",
        q: "Quel nombre vient juste après 39 ?",
        options: ["38", "40", "41", "49"],
        answer: "40",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "Compte les fusées : 🚀🚀🚀🚀🚀🚀🚀🚀",
        options: ["6", "7", "8", "9"],
        answer: "8",
        img: "🚀",
      },
      {
        type: "qcm",
        q: "Quel nombre vient juste avant 50 ?",
        options: ["48", "49", "51", "40"],
        answer: "49",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "Quel nombre est entre 36 et 38 ?",
        options: ["35", "37", "39", "36"],
        answer: "37",
        img: "🎯",
      },
      {
        type: "qcm",
        q: "Compte de 5 en 5 : 15, 20, 25, ...",
        options: ["26", "28", "30", "35"],
        answer: "30",
        img: "📊",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "14 + 9 = ?",
        options: ["21", "22", "23", "25"],
        answer: "23",
        img: "➕",
      },
      {
        type: "qcm",
        q: "25 - 8 = ?",
        options: ["15", "17", "18", "33"],
        answer: "17",
        img: "➖",
      },
      {
        type: "qcm",
        q: "🎒 Un sac contient 18 billes. J'en ajoute 7. Combien y en a-t-il ?",
        options: ["23", "24", "25", "26"],
        answer: "25",
        img: "🔵",
      },
      {
        type: "qcm",
        q: "32 - 15 = ?",
        options: ["13", "17", "19", "23"],
        answer: "17",
        img: "➖",
      },
      {
        type: "qcm",
        q: "19 + 14 = ?",
        options: ["31", "33", "35", "23"],
        answer: "33",
        img: "➕",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "🧁 Papa a 42 gâteaux. Il en donne 16 le matin et 5 l'après-midi. Combien lui en reste-t-il ?",
        options: ["19", "21", "23", "26"],
        answer: "21",
        img: "🧁",
      },
      {
        type: "qcm",
        q: "56 - 29 = ?",
        options: ["25", "27", "33", "37"],
        answer: "27",
        img: "🧮",
      },
      {
        type: "qcm",
        q: "👧👦 Dans la classe, il y a 13 filles et 15 garçons. Combien d'élèves en tout ?",
        options: ["26", "27", "28", "30"],
        answer: "28",
        img: "🏫",
      },
      {
        type: "qcm",
        q: "Quel est le double de 17 ?",
        options: ["27", "34", "37", "24"],
        answer: "34",
        img: "✖️",
      },
      {
        type: "qcm",
        q: "48 + 25 = ?",
        options: ["63", "71", "73", "75"],
        answer: "73",
        img: "🚀",
      },
    ],
  },
  monde: {
    1: [
      {
        type: "qcm",
        q: "Quel jour vient après MERCREDI ?",
        options: ["MARDI", "JEUDI", "VENDREDI", "LUNDI"],
        answer: "JEUDI",
        img: "📅",
      },
      {
        type: "qcm",
        q: "Combien y a-t-il de mois dans une année ?",
        options: ["10", "11", "12", "13"],
        answer: "12",
        img: "📆",
      },
      {
        type: "qcm",
        q: "Quelle saison vient après l'été ?",
        options: ["Le printemps", "L'automne", "L'hiver", "L'été"],
        answer: "L'automne",
        img: "🍂",
      },
      {
        type: "qcm",
        q: "Quel mois vient après JUIN ?",
        options: ["MAI", "JUILLET", "AOÛT", "MARS"],
        answer: "JUILLET",
        img: "☀️",
      },
      {
        type: "qcm",
        q: "Quel jour est entre MARDI et JEUDI ?",
        options: ["LUNDI", "MERCREDI", "VENDREDI", "SAMEDI"],
        answer: "MERCREDI",
        img: "📅",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Combien de pattes a une araignée ?",
        options: ["6", "8", "10", "12"],
        answer: "8",
        img: "🕷️",
      },
      {
        type: "qcm",
        q: 'Quelle planète est surnommée "la planète rouge" ?',
        options: ["Vénus", "Mars", "Jupiter", "Saturne"],
        answer: "Mars",
        img: "🔴",
      },
      {
        type: "qcm",
        q: "Que fabrique une abeille ?",
        options: ["Du lait", "Du miel", "De la confiture", "Du sucre"],
        answer: "Du miel",
        img: "🐝",
      },
      {
        type: "qcm",
        q: "Que produit un pommier ?",
        options: ["Des poires", "Des pommes", "Des cerises", "Des noix"],
        answer: "Des pommes",
        img: "🍎",
      },
      {
        type: "qcm",
        q: "Comment s'appelle le bébé de la vache ?",
        options: ["Le poulain", "Le veau", "L'agneau", "Le porcelet"],
        answer: "Le veau",
        img: "🐮",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "Quel organe pompe le sang dans le corps ?",
        options: ["Le cerveau", "Le cœur", "Les poumons", "L'estomac"],
        answer: "Le cœur",
        img: "❤️",
      },
      {
        type: "qcm",
        q: "Quand l'eau gèle, elle se transforme en...",
        options: ["Vapeur", "Glace", "Pluie", "Boue"],
        answer: "Glace",
        img: "🧊",
      },
      {
        type: "qcm",
        q: "Quel animal pond des œufs et a des plumes ?",
        options: ["Le chat", "La poule", "Le lapin", "Le chien"],
        answer: "La poule",
        img: "🐔",
      },
      {
        type: "qcm",
        q: "La Lune tourne autour de...",
        options: ["Le Soleil", "La Terre", "Mars", "Jupiter"],
        answer: "La Terre",
        img: "🌙",
      },
      {
        type: "qcm",
        q: "La grenouille vit dans l'eau et sur terre. On dit qu'elle est...",
        options: ["Un mammifère", "Un amphibien", "Un reptile", "Un insecte"],
        answer: "Un amphibien",
        img: "🐸",
      },
    ],
  },
  arts: {
    1: [
      {
        type: "qcm",
        q: "Combien de côtés a un rectangle ?",
        options: ["3", "4", "5", "6"],
        answer: "4",
        img: "🟦",
      },
      {
        type: "qcm",
        q: "Rouge + Jaune = ?",
        options: ["Vert", "Violet", "Orange", "Marron"],
        answer: "Orange",
        img: "🎨",
      },
      {
        type: "qcm",
        q: "Quelle forme ressemble à un ballon ?",
        options: ["Le carré", "Le cercle", "Le triangle", "Le rectangle"],
        answer: "Le cercle",
        img: "⚽",
      },
      {
        type: "qcm",
        q: "Bleu + Rouge = ?",
        options: ["Vert", "Orange", "Violet", "Marron"],
        answer: "Violet",
        img: "🎨",
      },
      {
        type: "qcm",
        q: "Combien de triangles faut-il pour faire un carré ?",
        options: ["1", "2", "3", "4"],
        answer: "2",
        img: "📐",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Si tu te retournes, ta gauche devient...",
        options: ["Ta droite", "Ta gauche", "Le haut", "Le bas"],
        answer: "Ta droite",
        img: "🔄",
      },
      {
        type: "qcm",
        q: "Jaune + Bleu + Rouge = ?",
        options: ["Noir", "Blanc", "Marron", "Gris"],
        answer: "Marron",
        img: "🎨",
      },
      {
        type: "qcm",
        q: "Combien de faces a un dé ?",
        options: ["4", "5", "6", "8"],
        answer: "6",
        img: "🎲",
      },
      {
        type: "qcm",
        q: "Quel objet a la forme d'une sphère ?",
        options: ["Un livre", "Un ballon", "Une boîte", "Une feuille"],
        answer: "Un ballon",
        img: "🏀",
      },
      {
        type: "qcm",
        q: "Combien y a-t-il de couleurs dans l'arc-en-ciel ?",
        options: ["5", "6", "7", "8"],
        answer: "7",
        img: "🌈",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "Continue la suite : 3, 6, 9, 12, ...",
        options: ["13", "14", "15", "16"],
        answer: "15",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "🔴🔵🟢🔴🔵🟢🔴... Que vient ensuite ?",
        options: ["🔴", "🔵", "🟢", "🟡"],
        answer: "🔵",
        img: "❓",
      },
      {
        type: "qcm",
        q: "Trouve l'intrus : 🐱🐶🐰🌳🐹",
        options: ["🐱", "🐶", "🌳", "🐹"],
        answer: "🌳",
        img: "👀",
      },
      {
        type: "qcm",
        q: "Continue : 1, 3, 5, 7, ...",
        options: ["8", "9", "10", "11"],
        answer: "9",
        img: "📊",
      },
      {
        type: "qcm",
        q: "🔺🔺🔻🔺🔺🔻🔺🔺... Que vient ensuite ?",
        options: ["🔺", "🔻", "🔵", "🟢"],
        answer: "🔻",
        img: "✨",
      },
    ],
  },
  histoire: {
    1: [
      {
        type: "qcm",
        q: "Qui vivait il y a très longtemps, avant les villes ?",
        options: [
          "Les robots",
          "Les hommes préhistoriques",
          "Les astronautes",
          "Les chevaliers",
        ],
        answer: "Les hommes préhistoriques",
        img: "🏔️",
      },
      {
        type: "qcm",
        q: "Comment les hommes préhistoriques gardaient-ils la chaleur ?",
        options: [
          "Avec un radiateur",
          "Avec le feu",
          "Avec l'électricité",
          "Avec la clim",
        ],
        answer: "Avec le feu",
        img: "🔥",
      },
      {
        type: "qcm",
        q: "Quel animal disparu avait de très longues défenses ?",
        options: ["Le lion", "Le mammouth", "L'ours", "Le loup"],
        answer: "Le mammouth",
        img: "🦣",
      },
      {
        type: "qcm",
        q: "Les chevaliers vivaient-ils avant ou après les hommes préhistoriques ?",
        options: ["Avant", "Après", "En même temps", "On ne sait pas"],
        answer: "Après",
        img: "⚔️",
      },
      {
        type: "qcm",
        q: "Où les hommes préhistoriques dessinaient-ils des animaux ?",
        options: [
          "Dans des cahiers",
          "Sur les murs des grottes",
          "Sur du papier",
          "Sur des tableaux",
        ],
        answer: "Sur les murs des grottes",
        img: "🎨",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Qui a fait construire le château de Versailles ?",
        options: ["Napoléon", "Louis XIV", "Charlemagne", "Henri IV"],
        answer: "Louis XIV",
        img: "👑",
      },
      {
        type: "qcm",
        q: "Qui était la grande guerrière qui a aidé la France ?",
        options: [
          "Marie-Antoinette",
          "Jeanne d'Arc",
          "Cléopâtre",
          "Blanche-Neige",
        ],
        answer: "Jeanne d'Arc",
        img: "⚔️",
      },
      {
        type: "qcm",
        q: "Quel peuple a construit les pyramides ?",
        options: ["Les Romains", "Les Égyptiens", "Les Gaulois", "Les Vikings"],
        answer: "Les Égyptiens",
        img: "🏛️",
      },
      {
        type: "qcm",
        q: "Comment s'appelle le grand guerrier gaulois ?",
        options: ["Astérix", "Vercingétorix", "Obélix", "Jules César"],
        answer: "Vercingétorix",
        img: "🛡️",
      },
      {
        type: "qcm",
        q: "Qui a découvert l'Amérique en 1492 ?",
        options: ["Marco Polo", "Christophe Colomb", "Magellan", "Napoléon"],
        answer: "Christophe Colomb",
        img: "🚢",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "En quelle année la Tour Eiffel a-t-elle été construite ?",
        options: ["1789", "1889", "1914", "1969"],
        answer: "1889",
        img: "🗼",
      },
      {
        type: "qcm",
        q: "Quel événement a commencé le 14 juillet 1789 ?",
        options: [
          "La Première Guerre",
          "La Révolution française",
          "La fête de la musique",
          "Les Jeux Olympiques",
        ],
        answer: "La Révolution française",
        img: "🇫🇷",
      },
      {
        type: "qcm",
        q: "Quel célèbre Français était un empereur ?",
        options: [
          "Louis XIV",
          "Napoléon Bonaparte",
          "Charlemagne",
          "Vercingétorix",
        ],
        answer: "Napoléon Bonaparte",
        img: "👑",
      },
      {
        type: "qcm",
        q: "Quand la Première Guerre mondiale a-t-elle commencé ?",
        options: ["1789", "1889", "1914", "1945"],
        answer: "1914",
        img: "📜",
      },
      {
        type: "qcm",
        q: "La fête nationale française est le...",
        options: ["1er janvier", "14 juillet", "25 décembre", "11 novembre"],
        answer: "14 juillet",
        img: "🎆",
      },
    ],
  },
  geo: {
    1: [
      {
        type: "qcm",
        q: "Quelle est la capitale de la France ?",
        options: ["Lyon", "Paris", "Marseille", "Bordeaux"],
        answer: "Paris",
        img: "🗼",
      },
      {
        type: "qcm",
        q: "Sur quel continent se trouve la France ?",
        options: ["L'Asie", "L'Europe", "L'Afrique", "L'Amérique"],
        answer: "L'Europe",
        img: "🌍",
      },
      {
        type: "qcm",
        q: "De quelles couleurs est le drapeau français ?",
        options: [
          "Bleu, blanc, rouge",
          "Vert, blanc, rouge",
          "Bleu, jaune, rouge",
          "Noir, blanc, rouge",
        ],
        answer: "Bleu, blanc, rouge",
        img: "🇫🇷",
      },
      {
        type: "qcm",
        q: "Comment appelle-t-on la forme de la France ?",
        options: ["Le triangle", "L'hexagone", "Le carré", "Le rectangle"],
        answer: "L'hexagone",
        img: "🗺️",
      },
      {
        type: "qcm",
        q: "Quel monument est le symbole de Paris ?",
        options: [
          "La Tour Eiffel",
          "Big Ben",
          "La Statue de la Liberté",
          "Le Colisée",
        ],
        answer: "La Tour Eiffel",
        img: "🗼",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Quel est le plus long fleuve de France ?",
        options: ["La Seine", "La Loire", "Le Rhône", "La Garonne"],
        answer: "La Loire",
        img: "🏞️",
      },
      {
        type: "qcm",
        q: "Quelle est la plus haute montagne de France ?",
        options: [
          "Le Mont Blanc",
          "Le Puy de Dôme",
          "Le Mont Ventoux",
          "Les Vosges",
        ],
        answer: "Le Mont Blanc",
        img: "🏔️",
      },
      {
        type: "qcm",
        q: "Quelle mer se trouve au sud de la France ?",
        options: [
          "La mer du Nord",
          "La Méditerranée",
          "La Manche",
          "L'océan Pacifique",
        ],
        answer: "La Méditerranée",
        img: "🌊",
      },
      {
        type: "qcm",
        q: "Quel pays est au nord de la France ?",
        options: ["L'Espagne", "La Belgique", "L'Italie", "Le Portugal"],
        answer: "La Belgique",
        img: "🗺️",
      },
      {
        type: "qcm",
        q: "Quel fleuve traverse Paris ?",
        options: ["La Loire", "La Seine", "Le Rhône", "La Garonne"],
        answer: "La Seine",
        img: "🌉",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "Quelle île française est dans l'océan Indien ?",
        options: ["La Guadeloupe", "La Réunion", "La Corse", "La Martinique"],
        answer: "La Réunion",
        img: "🏝️",
      },
      {
        type: "qcm",
        q: "Combien de pays partagent une frontière avec la France ?",
        options: ["5", "6", "8", "10"],
        answer: "8",
        img: "🗺️",
      },
      {
        type: "qcm",
        q: "Quelle chaîne de montagnes sépare la France de l'Italie ?",
        options: ["Les Alpes", "Les Pyrénées", "Le Jura", "Les Vosges"],
        answer: "Les Alpes",
        img: "⛰️",
      },
      {
        type: "qcm",
        q: "Quel océan borde la côte ouest de la France ?",
        options: [
          "L'océan Pacifique",
          "L'océan Atlantique",
          "L'océan Indien",
          "L'océan Arctique",
        ],
        answer: "L'océan Atlantique",
        img: "🌊",
      },
      {
        type: "qcm",
        q: "La Corse se trouve dans quelle mer ?",
        options: [
          "La mer du Nord",
          "La Méditerranée",
          "La Manche",
          "L'océan Atlantique",
        ],
        answer: "La Méditerranée",
        img: "🏝️",
      },
    ],
  },
  orthographe: {
    1: [
      {
        type: "completion",
        q: "écu_euil",
        options: [],
        answer: "r",
        img: "🐿️",
      },
      {
        type: "completion",
        q: "gi_afe",
        options: [],
        answer: "r",
        img: "🦒",
      },
      {
        type: "completion",
        q: "tor_ue",
        options: [],
        answer: "t",
        img: "🐢",
      },
      {
        type: "completion",
        q: "co_uille",
        options: [],
        answer: "q",
        img: "🐚",
      },
      {
        type: "completion",
        q: "p_rroquet",
        options: [],
        answer: "e",
        img: "🦜",
      },
    ],
    2: [
      {
        type: "completion",
        q: "ch__ette",
        options: [],
        answer: "ou",
        img: "🦉",
      },
      {
        type: "completion",
        q: "p_p_llon",
        options: [],
        answer: "ai",
        img: "🦋",
      },
      {
        type: "completion",
        q: "c_c_nelle",
        options: [],
        answer: "oi",
        img: "🐞",
      },
      {
        type: "completion",
        q: "h_r_sson",
        options: [],
        answer: "éi",
        img: "🦔",
      },
      {
        type: "completion",
        q: "t_ur_esol",
        options: [],
        answer: "on",
        img: "🌻",
      },
    ],
    3: [
      {
        type: "completion",
        q: "rhin_céros",
        options: [],
        answer: "o",
        img: "🦏",
      },
      {
        type: "completion",
        q: "ch_mp_gnon",
        options: [],
        answer: "ai",
        img: "🍄",
      },
      {
        type: "completion",
        q: "b_cycl_tte",
        options: [],
        answer: "ie",
        img: "🚲",
      },
      {
        type: "completion",
        q: "mar_uerit_",
        options: [],
        answer: "ge",
        img: "🌼",
      },
      {
        type: "completion",
        q: "s_uter_lle",
        options: [],
        answer: "ae",
        img: "🦗",
      },
    ],
  },
  blagues: {
    1: [
      {
        type: "blague",
        q: "Que dit un escargot sur le dos d'une tortue ?",
        options: [],
        answer: "Youhou, ça décoiffe !",
        img: "🐌",
      },
      {
        type: "blague",
        q: "Pourquoi les girafes ont-elles un long cou ?",
        options: [],
        answer: "Parce que leurs pieds sentent mauvais !",
        img: "🦒",
      },
      {
        type: "blague",
        q: "Que dit une maman tomate à un bébé tomate qui traîne ?",
        options: [],
        answer: "Allez, ketchup !",
        img: "🍅",
      },
      {
        type: "blague",
        q: "Pourquoi les vaches ferment-elles les yeux en donnant du lait ?",
        options: [],
        answer: "Pour faire du lait concentré !",
        img: "🐄",
      },
      {
        type: "blague",
        q: "Qu'est-ce qu'un crocodile qui surveille la cour d'école ?",
        options: [],
        answer: "Un sur-veillant !",
        img: "🐊",
      },
    ],
    2: [
      {
        type: "blague",
        q: "Que dit un zéro à un huit ?",
        options: [],
        answer: "Jolie ceinture !",
        img: "🔢",
      },
      {
        type: "blague",
        q: "Comment appelle-t-on un boomerang qui ne revient pas ?",
        options: [],
        answer: "Un bout de bois !",
        img: "🪃",
      },
      {
        type: "blague",
        q: "Pourquoi les éléphants ne font-ils pas d'ordinateur ?",
        options: [],
        answer: "Parce qu'ils ont peur de la souris !",
        img: "🐘",
      },
      {
        type: "blague",
        q: "Quel est le fruit le plus explosif ?",
        options: [],
        answer: "La grenade !",
        img: "💥",
      },
      {
        type: "blague",
        q: "Quel est le sport préféré des insectes ?",
        options: [],
        answer: "Le cricket !",
        img: "🦗",
      },
    ],
    3: [
      {
        type: "blague",
        q: "Pourquoi le robot va-t-il chez le docteur ?",
        options: [],
        answer: "Parce qu'il a un virus !",
        img: "🤖",
      },
      {
        type: "blague",
        q: "Quel est le comble pour un astronaute ?",
        options: [],
        answer: "D'en avoir plein le dos de la Lune !",
        img: "🧑‍🚀",
      },
      {
        type: "blague",
        q: "Que dit un citron qui fait un hold-up ?",
        options: [],
        answer: "Plus un zeste !",
        img: "🍋",
      },
      {
        type: "blague",
        q: "Pourquoi les montres sont-elles mauvaises au foot ?",
        options: [],
        answer: "Parce qu'elles jouent les prolongations !",
        img: "⏰",
      },
      {
        type: "blague",
        q: "Comment appelle-t-on un chat qui fait de la musique ?",
        options: [],
        answer: "Un chat-nteur !",
        img: "🎵",
      },
    ],
  },
};

const CONFETTI_EMOJIS = ["⭐", "🎉", "✨", "🌟", "💫", "🎊"];

export default function App() {
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS);
  const [screen, setScreen] = useState("avatar");
  const [currentIsland, setCurrentIsland] = useState<IslandId | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [levelComplete, setLevelComplete] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [jokeRevealed, setJokeRevealed] = useState(false);

  // New UX state
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [shuffledOpts, setShuffledOpts] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  const streakRef = useRef(0);
  const feedbackRef = useRef<"correct" | "incorrect" | null>(null);

  // Get real exercise index from shuffled order
  const getRealIndex = (idx: number) =>
    questionOrder.length > 0 ? questionOrder[idx] : idx;

  // Shuffle options when question changes
  useEffect(() => {
    if (screen === "exercise" && currentIsland) {
      const exercises = EXERCISES[currentIsland][currentLevel];
      const realIdx = getRealIndex(exerciseIndex);
      const exercise = exercises[realIdx];
      if (exercise && exercise.options.length > 0) {
        setShuffledOpts(shuffle(exercise.options));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, exerciseIndex, currentIsland, currentLevel, questionOrder]);

  // Reset timer when question changes
  useEffect(() => {
    if (screen !== "exercise" || !currentIsland) return;
    const exercises = EXERCISES[currentIsland][currentLevel];
    const realIdx = getRealIndex(exerciseIndex);
    if (!exercises[realIdx]) return;
    const exercise = exercises[realIdx];

    if (exercise.type === "blague") {
      setTimeLeft(-1);
    } else if (exercise.type === "completion") {
      setTimeLeft(TIMER_COMPLETION[currentLevel] || 30);
    } else {
      setTimeLeft(TIMER_QCM[currentLevel] || 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseIndex, screen, currentIsland, currentLevel]);

  // Countdown
  useEffect(() => {
    if (
      timeLeft <= 0 ||
      feedbackRef.current ||
      levelComplete ||
      screen !== "exercise"
    )
      return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, levelComplete, screen]);

  // Handle time up
  useEffect(() => {
    if (
      timeLeft === 0 &&
      screen === "exercise" &&
      !feedbackRef.current &&
      !levelComplete
    ) {
      addStarAndAdvance(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const selectAvatar = (avatar: Avatar) => {
    setProgress((p) => ({ ...p, avatar }));
    setScreen("map");
  };

  const enterIsland = (island: IslandId) => {
    setCurrentIsland(island);
    setScreen("island");
  };

  const startLevel = (level: number) => {
    if (!currentIsland) return;
    if (!progress[currentIsland].unlocked.includes(level)) return;
    setCurrentLevel(level);
    setExerciseIndex(0);
    setFeedback(null);
    feedbackRef.current = null;
    setLevelComplete(false);
    setTextInput("");
    setJokeRevealed(false);
    setStreak(0);
    streakRef.current = 0;
    setBestStreak(0);
    setCorrectCount(0);
    setShowConfetti(false);

    const exercises = EXERCISES[currentIsland][level];
    setQuestionOrder(
      shuffle(Array.from({ length: exercises.length }, (_, i) => i)),
    );
    setScreen("exercise");
  };

  const addStarAndAdvance = (correct: boolean) => {
    if (!currentIsland) return;
    if (feedbackRef.current) return;

    const exercises = EXERCISES[currentIsland][currentLevel];

    if (correct) {
      streakRef.current += 1;
      setStreak(streakRef.current);
      setBestStreak((b) => Math.max(b, streakRef.current));
      setCorrectCount((c) => c + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);

      setProgress((p) => {
        const newStars = [...p[currentIsland].stars];
        newStars[currentLevel - 1] += 1;
        return {
          ...p,
          stars: p.stars + 1,
          [currentIsland]: { ...p[currentIsland], stars: newStars },
        };
      });
    } else {
      streakRef.current = 0;
      setStreak(0);
    }

    setFeedback(correct ? "correct" : "incorrect");
    feedbackRef.current = correct ? "correct" : "incorrect";

    setTimeout(() => {
      setFeedback(null);
      feedbackRef.current = null;
      setTextInput("");
      if (exerciseIndex < exercises.length - 1) {
        setExerciseIndex((i) => i + 1);
      } else {
        const earnedStars =
          progress[currentIsland].stars[currentLevel - 1] + (correct ? 1 : 0);
        if (earnedStars >= 3 && currentLevel < 3) {
          setProgress((p) => ({
            ...p,
            [currentIsland]: {
              ...p[currentIsland],
              unlocked: [
                ...new Set([...p[currentIsland].unlocked, currentLevel + 1]),
              ],
            },
          }));
        }
        setLevelComplete(true);
      }
    }, 1500);
  };

  const checkAnswer = (answer: string) => {
    if (!currentIsland) return;
    const exercises = EXERCISES[currentIsland][currentLevel];
    const realIdx = getRealIndex(exerciseIndex);
    const correct = exercises[realIdx].answer === answer;
    addStarAndAdvance(correct);
  };

  const checkCompletion = () => {
    if (!currentIsland) return;
    const exercises = EXERCISES[currentIsland][currentLevel];
    const realIdx = getRealIndex(exerciseIndex);
    const correct =
      textInput.toLowerCase() === exercises[realIdx].answer.toLowerCase();
    addStarAndAdvance(correct);
  };

  const handleJokeNext = () => {
    if (!currentIsland) return;
    const exercises = EXERCISES[currentIsland][currentLevel];

    setProgress((p) => {
      const newStars = [...p[currentIsland].stars];
      newStars[currentLevel - 1] += 1;
      return {
        ...p,
        stars: p.stars + 1,
        [currentIsland]: { ...p[currentIsland], stars: newStars },
      };
    });

    setJokeRevealed(false);
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex((i) => i + 1);
    } else {
      const earnedStars = progress[currentIsland].stars[currentLevel - 1] + 1;
      if (earnedStars >= 3 && currentLevel < 3) {
        setProgress((p) => ({
          ...p,
          [currentIsland]: {
            ...p[currentIsland],
            unlocked: [
              ...new Set([...p[currentIsland].unlocked, currentLevel + 1]),
            ],
          },
        }));
      }
      setLevelComplete(true);
    }
  };

  const resetGame = () => {
    setProgress(INITIAL_PROGRESS);
    setScreen("avatar");
  };

  // === RENDER ===

  // Avatar Selection Screen
  if (screen === "avatar") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-950 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 animate-slide-in">
          <h1 className="text-3xl font-bold text-white mb-2">
            🦊 L'Aventure des Explorateurs 🐉
          </h1>
          <p className="text-indigo-300">
            Choisis ton compagnon pour commencer !
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
          {AVATARS.map((av, i) => (
            <button
              key={av.id}
              onClick={() => selectAvatar(av)}
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-all hover:scale-110 backdrop-blur border border-white/10 hover:border-white/30 animate-slide-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-6xl mb-2">{av.emoji}</div>
              <div className="text-white font-medium">{av.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Map Screen
  if (screen === "map") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-sky-900 to-emerald-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between backdrop-blur border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{progress.avatar?.emoji}</span>
              <div>
                <div className="font-bold text-white">
                  {progress.avatar?.name}
                </div>
                <div className="text-sm text-indigo-300">
                  Explorateur intrépide
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-yellow-300">
                {progress.stars}
              </span>
            </div>
          </div>

          <h2 className="text-center text-white text-xl font-bold mb-6 drop-shadow-lg">
            🗺️ Choisis une île à explorer !
          </h2>

          {/* Islands */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {ISLANDS.map((island, i) => {
              const islandProgress = progress[island.id];
              const totalStars = islandProgress.stars.reduce(
                (a: number, b: number) => a + b,
                0,
              );
              return (
                <button
                  key={island.id}
                  onClick={() => enterIsland(island.id)}
                  className={`${island.color} hover:opacity-90 rounded-2xl p-4 text-white transition-all hover:scale-105 shadow-lg animate-slide-in border border-white/10`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="text-4xl mb-2">{island.emoji}</div>
                  <div className="font-bold text-sm">{island.name}</div>
                  <div className="text-xs opacity-90">{island.desc}</div>
                  <div className="mt-2 flex justify-center gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <span
                        key={lvl}
                        className={`text-sm ${islandProgress.unlocked.includes(lvl) ? "" : "opacity-40"}`}
                      >
                        {islandProgress.unlocked.includes(lvl) ? "🔓" : "🔒"}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    ⭐ {totalStars}/15
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={resetGame}
            className="mt-6 mx-auto block text-white/50 hover:text-white text-sm underline"
          >
            Recommencer l'aventure
          </button>
        </div>
      </div>
    );
  }

  // Island Screen (Level Selection)
  if (screen === "island" && currentIsland) {
    const island = ISLANDS.find((i) => i.id === currentIsland);
    if (!island) return null;
    const islandProgress = progress[currentIsland];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setScreen("map")}
            className="mb-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur border border-white/10"
          >
            ← Retour à la carte
          </button>

          <div
            className={`${island.color} rounded-2xl p-6 text-center mb-6 border border-white/10`}
          >
            <div className="text-5xl mb-2">{island.emoji}</div>
            <h2 className="text-2xl font-bold text-white">{island.name}</h2>
            <p className="text-white/80">{island.desc}</p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((level) => {
              const unlocked = islandProgress.unlocked.includes(level);
              const stars = islandProgress.stars[level - 1];
              return (
                <button
                  key={level}
                  onClick={() => startLevel(level)}
                  disabled={!unlocked}
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all animate-slide-in ${
                    unlocked
                      ? "bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30"
                      : "bg-white/5 cursor-not-allowed border border-white/5"
                  }`}
                  style={{ animationDelay: `${level * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{unlocked ? "🎯" : "🔒"}</span>
                    <div className="text-left">
                      <div
                        className={`font-bold ${unlocked ? "text-white" : "text-gray-500"}`}
                      >
                        Niveau {level}
                      </div>
                      <div className="text-sm text-gray-400">
                        {level === 1 && "⏱️ 25s par question"}
                        {level === 2 && "⏱️ 20s par question"}
                        {level === 3 && "⏱️ 15s par question"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={`text-xl ${s <= stars ? "opacity-100" : "opacity-30"}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-white/10 rounded-xl p-4 text-center backdrop-blur border border-white/10">
            <p className="text-sm text-gray-300">
              🔓 Gagne <strong className="text-yellow-300">3 étoiles</strong>{" "}
              pour débloquer le niveau suivant !
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Screen
  if (screen === "exercise" && currentIsland) {
    const exercises = EXERCISES[currentIsland][currentLevel];
    const realIdx = getRealIndex(exerciseIndex);
    const exercise = exercises[realIdx];
    const island = ISLANDS.find((i) => i.id === currentIsland);
    if (!island || !exercise) return null;

    // Timer calculations
    const maxTime =
      exercise.type === "completion"
        ? TIMER_COMPLETION[currentLevel] || 30
        : TIMER_QCM[currentLevel] || 20;
    const timerPercent = timeLeft >= 0 ? (timeLeft / maxTime) * 100 : 100;
    const timerColor =
      timerPercent > 60
        ? "bg-green-400"
        : timerPercent > 30
          ? "bg-yellow-400"
          : "bg-red-400";

    if (levelComplete) {
      const stars = progress[currentIsland].stars[currentLevel - 1];
      const unlocked = stars >= 3 && currentLevel < 3;

      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/10 animate-slide-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Niveau terminé !
            </h2>

            <div className="bg-white/10 rounded-xl p-3 mb-4">
              <p className="text-lg text-white">
                Score :{" "}
                <span className="font-bold text-yellow-300">
                  {correctCount}/{exercises.length}
                </span>
              </p>
            </div>

            <div className="flex justify-center gap-2 my-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={`text-3xl ${s <= stars ? "animate-pulse" : "opacity-30"}`}
                >
                  ⭐
                </span>
              ))}
            </div>

            {bestStreak >= 2 && (
              <div className="bg-orange-500/20 text-orange-300 p-3 rounded-xl mb-4 border border-orange-500/30">
                🔥 Meilleur combo : {bestStreak} de suite !
              </div>
            )}

            {unlocked && (
              <div className="bg-green-500/20 text-green-300 p-3 rounded-xl mb-4 border border-green-500/30 animate-pulse-glow">
                🔓 Niveau {currentLevel + 1} débloqué !
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => {
                  setExerciseIndex(0);
                  setLevelComplete(false);
                  setCorrectCount(0);
                  setStreak(0);
                  streakRef.current = 0;
                  setBestStreak(0);
                  setShowConfetti(false);
                  setQuestionOrder(
                    shuffle(
                      Array.from({ length: exercises.length }, (_, i) => i),
                    ),
                  );
                  setProgress((p) => ({
                    ...p,
                    [currentIsland]: {
                      ...p[currentIsland],
                      stars: p[currentIsland].stars.map(
                        (s: number, i: number) =>
                          i === currentLevel - 1 ? 0 : s,
                      ),
                    },
                  }));
                }}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                🔄 Rejouer
              </button>
              <button
                onClick={() => setScreen("island")}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium border border-white/10 transition-all"
              >
                📋 Niveaux
              </button>
              <button
                onClick={() => setScreen("map")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                🗺️ Carte
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto">
          {/* Timer bar */}
          {timeLeft >= 0 && exercise.type !== "blague" && (
            <div className="bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`${timerColor} h-2 rounded-full`}
                style={{
                  width: `${timerPercent}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
          )}

          {/* Progress bar */}
          <div className="bg-white/10 rounded-full h-3 mb-3">
            <div
              className="bg-white/60 h-3 rounded-full transition-all"
              style={{
                width: `${((exerciseIndex + 1) / exercises.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-white text-sm mb-4 items-center">
            <span className="opacity-70">
              Question {exerciseIndex + 1}/{exercises.length}
            </span>
            <div className="flex items-center gap-3">
              {streak >= 2 && (
                <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs font-bold border border-orange-500/30">
                  🔥 x{streak}
                </span>
              )}
              {timeLeft >= 0 && exercise.type !== "blague" && (
                <span
                  className={`font-mono text-sm font-bold ${timeLeft <= 5 ? "text-red-400" : "text-white/70"}`}
                >
                  {timeLeft}s
                </span>
              )}
              <span>⭐ {progress[currentIsland].stars[currentLevel - 1]}</span>
            </div>
          </div>

          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-2xl animate-confetti"
                  style={{
                    left: `${10 + Math.random() * 80}%`,
                    top: "50%",
                    animationDelay: `${Math.random() * 0.3}s`,
                  }}
                >
                  {CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length]}
                </div>
              ))}
            </div>
          )}

          {/* Question Card */}
          <div
            className={`bg-white/10 backdrop-blur rounded-3xl p-6 shadow-2xl border transition-all animate-slide-in ${
              feedback === "correct"
                ? "border-green-400 bg-green-500/10"
                : feedback === "incorrect"
                  ? "border-red-400 bg-red-500/10 animate-shake"
                  : "border-white/10"
            }`}
            key={exerciseIndex}
          >
            <div className="text-6xl text-center mb-4">{exercise.img}</div>
            <h3 className="text-xl font-bold text-white text-center mb-6">
              {exercise.q}
            </h3>

            {/* QCM type */}
            {exercise.type === "qcm" && (
              <div className="space-y-3">
                {shuffledOpts.map((opt: string, i: number) => (
                  <button
                    key={`${exerciseIndex}-${i}`}
                    onClick={() => !feedback && checkAnswer(opt)}
                    disabled={!!feedback}
                    className={`w-full p-4 rounded-xl text-lg font-medium transition-all ${
                      feedback && opt === exercise.answer
                        ? "bg-green-500 text-white scale-105"
                        : feedback && opt !== exercise.answer
                          ? "bg-white/5 text-gray-500"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30 hover:scale-[1.02]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* Completion type */}
            {exercise.type === "completion" && (
              <div className="space-y-4">
                <p className="text-center text-gray-400 text-sm">
                  Tape les lettres manquantes :
                </p>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={!!feedback}
                  autoFocus
                  className="w-full p-4 rounded-xl text-lg font-medium text-center bg-white/10 border-2 border-white/20 focus:border-indigo-400 focus:outline-none text-white placeholder-gray-500"
                  placeholder="..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !feedback && textInput) {
                      checkCompletion();
                    }
                  }}
                />
                <button
                  onClick={() => checkCompletion()}
                  disabled={!!feedback || !textInput}
                  className="w-full p-4 rounded-xl text-lg font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Valider
                </button>
              </div>
            )}

            {/* Blague type */}
            {exercise.type === "blague" && (
              <div className="space-y-4">
                {!jokeRevealed ? (
                  <button
                    onClick={() => setJokeRevealed(true)}
                    className="w-full p-4 rounded-xl text-lg font-medium bg-yellow-500 hover:bg-yellow-400 text-yellow-900 transition-all hover:scale-[1.02]"
                  >
                    Voir la réponse !
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/20 border border-yellow-500/30 p-4 rounded-xl text-center">
                      <p className="text-lg font-bold text-yellow-300">
                        {exercise.answer}
                      </p>
                    </div>
                    <div className="flex justify-center gap-1 text-2xl">⭐</div>
                    <button
                      onClick={() => handleJokeNext()}
                      className="w-full p-4 rounded-xl text-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                    >
                      Blague suivante
                    </button>
                  </div>
                )}
              </div>
            )}

            {feedback && exercise.type !== "blague" && (
              <div
                className={`mt-4 p-4 rounded-xl text-center text-lg font-bold ${
                  feedback === "correct"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {feedback === "correct"
                  ? streak >= 3
                    ? `🔥 Incroyable ! Combo x${streak} !`
                    : streak >= 2
                      ? "⭐ Super, continue !"
                      : "✅ Bravo !"
                  : `❌ La réponse était : ${exercise.answer}`}
              </div>
            )}
          </div>

          <button
            onClick={() => setScreen("island")}
            className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl backdrop-blur border border-white/10"
          >
            ← Quitter l'exercice
          </button>
        </div>
      </div>
    );
  }

  return null;
}
