import { useState } from "react";

type IslandId = "francais" | "maths" | "monde" | "arts";

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
}

const INITIAL_PROGRESS: Progress = {
  avatar: null,
  stars: 0,
  badges: [],
  francais: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  maths: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  monde: { level: 1, unlocked: [1], stars: [0, 0, 0] },
  arts: { level: 1, unlocked: [1], stars: [0, 0, 0] },
};

const AVATARS: Avatar[] = [
  { id: "dino", emoji: "🦖", name: "Rex le Dino" },
  { id: "astro", emoji: "👨‍🚀", name: "Astro" },
  { id: "explorer", emoji: "🧭", name: "Luna l'Exploratrice" },
];

const ISLANDS = [
  {
    id: "francais" as const,
    name: "Île Dino-Lettres",
    emoji: "🏝️",
    color: "bg-green-500",
    desc: "Français",
  },
  {
    id: "maths" as const,
    name: "Île Volcan-Nombres",
    emoji: "🌋",
    color: "bg-orange-500",
    desc: "Mathématiques",
  },
  {
    id: "monde" as const,
    name: "Île Spatiale",
    emoji: "🚀",
    color: "bg-blue-500",
    desc: "Questionner le monde",
  },
  {
    id: "arts" as const,
    name: "Île Créative",
    emoji: "🎨",
    color: "bg-purple-500",
    desc: "Arts & Logique",
  },
];

interface Exercise {
  type: string;
  q: string;
  options: string[];
  answer: string;
  img: string;
}

const EXERCISES: Record<IslandId, Record<number, Exercise[]>> = {
  francais: {
    1: [
      {
        type: "qcm",
        q: 'Combien de syllabes dans "DINOSAURE" ?',
        options: ["2", "3", "4"],
        answer: "4",
        img: "🦕",
      },
      {
        type: "qcm",
        q: 'Quelle syllabe entends-tu au début de "VOLCAN" ?',
        options: ["CAN", "VOL", "LAN"],
        answer: "VOL",
        img: "🌋",
      },
      {
        type: "qcm",
        q: 'Combien de syllabes dans "ÉTOILE" ?',
        options: ["2", "3", "4"],
        answer: "3",
        img: "⭐",
      },
      {
        type: "qcm",
        q: 'Quelle syllabe est à la fin de "PLANÈTE" ?',
        options: ["PLA", "NÈ", "TE"],
        answer: "TE",
        img: "🪐",
      },
      {
        type: "qcm",
        q: "Quel mot a 2 syllabes ?",
        options: ["LAVE", "DINOSAURE", "MÉTÉORITE"],
        answer: "LAVE",
        img: "🔥",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Comment s'écrit le bébé dinosaure ?",
        options: ["un euf", "un œuf", "un oef"],
        answer: "un œuf",
        img: "🥒",
      },
      {
        type: "qcm",
        q: 'Quel mot veut dire "très grand" ?',
        options: ["petit", "géant", "rapide"],
        answer: "géant",
        img: "🦖",
      },
      {
        type: "qcm",
        q: "Le T-Rex est un dinosaure...",
        options: ["carnivore", "herbivore", "poisson"],
        answer: "carnivore",
        img: "🦴",
      },
      {
        type: "qcm",
        q: "Trouve le mot bien écrit :",
        options: ["fusée", "fusé", "fuzée"],
        answer: "fusée",
        img: "🚀",
      },
      {
        type: "qcm",
        q: "La lave sort du...",
        options: ["volcan", "volquan", "volcant"],
        answer: "volcan",
        img: "🌋",
      },
    ],
    3: [
      {
        type: "qcm",
        q: '"Le dinosaure mange des feuilles." Que mange-t-il ?',
        options: ["de la viande", "des feuilles", "du poisson"],
        answer: "des feuilles",
        img: "🌿",
      },
      {
        type: "qcm",
        q: '"La fusée décolle vers la Lune." Où va la fusée ?',
        options: ["vers le Soleil", "vers la Lune", "vers Mars"],
        answer: "vers la Lune",
        img: "🌙",
      },
      {
        type: "qcm",
        q: '"Le volcan est en éruption, la lave coule." La lave...',
        options: ["vole", "coule", "dort"],
        answer: "coule",
        img: "🌋",
      },
      {
        type: "qcm",
        q: 'Complète : "L\'astronaute porte une..."',
        options: ["combinaison", "robe", "écharpe"],
        answer: "combinaison",
        img: "👨‍🚀",
      },
      {
        type: "qcm",
        q: '"Les dinosaures ont disparu il y a très longtemps." Vrai ou Faux ?',
        options: ["Vrai", "Faux"],
        answer: "Vrai",
        img: "🦕",
      },
    ],
  },
  maths: {
    1: [
      {
        type: "qcm",
        q: "Compte les dinosaures : 🦕🦕🦕🦕🦕",
        options: ["4", "5", "6"],
        answer: "5",
        img: "🦕",
      },
      {
        type: "qcm",
        q: "Compte les étoiles : ⭐⭐⭐⭐⭐⭐⭐",
        options: ["6", "7", "8"],
        answer: "7",
        img: "⭐",
      },
      {
        type: "qcm",
        q: "Quel nombre vient après 15 ?",
        options: ["14", "16", "17"],
        answer: "16",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "Quel nombre vient avant 20 ?",
        options: ["19", "21", "18"],
        answer: "19",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "Compte les volcans : 🌋🌋🌋🌋🌋🌋🌋🌋🌋",
        options: ["8", "9", "10"],
        answer: "9",
        img: "🌋",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "🦕🦕🦕 + 🦕🦕 = ?",
        options: ["4", "5", "6"],
        answer: "5",
        img: "➕",
      },
      {
        type: "qcm",
        q: "7 + 5 = ?",
        options: ["11", "12", "13"],
        answer: "12",
        img: "🥚",
      },
      {
        type: "qcm",
        q: "🌋 Un volcan a 8 roches. Il en reçoit 4. Combien en a-t-il ?",
        options: ["10", "11", "12"],
        answer: "12",
        img: "🪨",
      },
      {
        type: "qcm",
        q: "15 + 6 = ?",
        options: ["20", "21", "22"],
        answer: "21",
        img: "⭐",
      },
      {
        type: "qcm",
        q: "🚀 9 + 9 = ?",
        options: ["17", "18", "19"],
        answer: "18",
        img: "🚀",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "🦖 Le T-Rex a 12 dents. Il en perd 4. Combien lui en reste-t-il ?",
        options: ["7", "8", "9"],
        answer: "8",
        img: "🦷",
      },
      {
        type: "qcm",
        q: "45 est plus grand que...",
        options: ["50", "42", "48"],
        answer: "42",
        img: "📊",
      },
      {
        type: "qcm",
        q: "🌋 20 - 7 = ?",
        options: ["12", "13", "14"],
        answer: "13",
        img: "🌋",
      },
      {
        type: "qcm",
        q: "Range du plus petit au plus grand : 34, 28, 41",
        options: ["28, 34, 41", "34, 28, 41", "41, 34, 28"],
        answer: "28, 34, 41",
        img: "📈",
      },
      {
        type: "qcm",
        q: "🚀 La fusée a 56 passagers. 10 descendent. Combien restent ?",
        options: ["45", "46", "66"],
        answer: "46",
        img: "👨‍🚀",
      },
    ],
  },
  monde: {
    1: [
      {
        type: "qcm",
        q: "Quel jour vient après LUNDI ?",
        options: ["Mercredi", "Mardi", "Dimanche"],
        answer: "Mardi",
        img: "📅",
      },
      {
        type: "qcm",
        q: "En quelle saison fait-il très froid ?",
        options: ["Été", "Hiver", "Printemps"],
        answer: "Hiver",
        img: "❄️",
      },
      {
        type: "qcm",
        q: "Combien y a-t-il de jours dans une semaine ?",
        options: ["5", "6", "7"],
        answer: "7",
        img: "📆",
      },
      {
        type: "qcm",
        q: "Quelle saison vient après le printemps ?",
        options: ["Hiver", "Automne", "Été"],
        answer: "Été",
        img: "☀️",
      },
      {
        type: "qcm",
        q: "Quel est le premier mois de l'année ?",
        options: ["Mars", "Janvier", "Décembre"],
        answer: "Janvier",
        img: "🎉",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "Quelle est la planète la plus proche du Soleil ?",
        options: ["Terre", "Mars", "Mercure"],
        answer: "Mercure",
        img: "☀️",
      },
      {
        type: "qcm",
        q: "Un dinosaure est-il vivant ou non-vivant ?",
        options: ["Vivant (autrefois)", "Non-vivant", "Robot"],
        answer: "Vivant (autrefois)",
        img: "🦕",
      },
      {
        type: "qcm",
        q: "La Terre est une...",
        options: ["Étoile", "Planète", "Lune"],
        answer: "Planète",
        img: "🌍",
      },
      {
        type: "qcm",
        q: "Un volcan est fait de...",
        options: ["Glace", "Roche", "Papier"],
        answer: "Roche",
        img: "🌋",
      },
      {
        type: "qcm",
        q: "Les plantes ont besoin de... pour vivre",
        options: ["Eau et lumière", "Chocolat", "Jouets"],
        answer: "Eau et lumière",
        img: "🌱",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "Avec quoi respire-t-on ?",
        options: ["Les poumons", "Le cœur", "L'estomac"],
        answer: "Les poumons",
        img: "🫁",
      },
      {
        type: "qcm",
        q: "Que devient la chenille ?",
        options: ["Un oiseau", "Un papillon", "Un poisson"],
        answer: "Un papillon",
        img: "🦋",
      },
      {
        type: "qcm",
        q: "Les dinosaures ont disparu à cause...",
        options: ["d'une météorite", "d'un rhume", "de la pluie"],
        answer: "d'une météorite",
        img: "☄️",
      },
      {
        type: "qcm",
        q: "Le cœur sert à...",
        options: ["digérer", "pomper le sang", "respirer"],
        answer: "pomper le sang",
        img: "❤️",
      },
      {
        type: "qcm",
        q: "Un herbivore mange...",
        options: ["de la viande", "des plantes", "du plastique"],
        answer: "des plantes",
        img: "🥬",
      },
    ],
  },
  arts: {
    1: [
      {
        type: "qcm",
        q: "Quelle forme a 3 côtés ?",
        options: ["Carré", "Triangle", "Cercle"],
        answer: "Triangle",
        img: "🔺",
      },
      {
        type: "qcm",
        q: "De quelle couleur est le Soleil ?",
        options: ["Bleu", "Jaune", "Vert"],
        answer: "Jaune",
        img: "☀️",
      },
      {
        type: "qcm",
        q: "Quelle forme a 4 côtés égaux ?",
        options: ["Triangle", "Carré", "Cercle"],
        answer: "Carré",
        img: "🟧",
      },
      {
        type: "qcm",
        q: "Bleu + Jaune = ?",
        options: ["Rouge", "Vert", "Orange"],
        answer: "Vert",
        img: "🎨",
      },
      {
        type: "qcm",
        q: "Quelle forme n'a pas de côté ?",
        options: ["Rectangle", "Triangle", "Cercle"],
        answer: "Cercle",
        img: "⭕",
      },
    ],
    2: [
      {
        type: "qcm",
        q: "🦕 Le dino regarde vers la droite. Où est sa queue ?",
        options: ["À droite", "À gauche", "En haut"],
        answer: "À gauche",
        img: "🦕",
      },
      {
        type: "qcm",
        q: "Que vois-tu au-dessus des nuages ?",
        options: ["La mer", "Le ciel/espace", "La terre"],
        answer: "Le ciel/espace",
        img: "☁️",
      },
      {
        type: "qcm",
        q: "Rouge + Bleu = ?",
        options: ["Vert", "Violet", "Orange"],
        answer: "Violet",
        img: "🎨",
      },
      {
        type: "qcm",
        q: "Combien de triangles ? 🔺🔺🔺🔺",
        options: ["3", "4", "5"],
        answer: "4",
        img: "🔺",
      },
      {
        type: "qcm",
        q: "La fusée décolle vers...",
        options: ["le bas", "la gauche", "le haut"],
        answer: "le haut",
        img: "🚀",
      },
    ],
    3: [
      {
        type: "qcm",
        q: "Quelle suite est correcte ? 🔴🔵🔴🔵...",
        options: ["🔴", "🔵", "🟢"],
        answer: "🔴",
        img: "🔴",
      },
      {
        type: "qcm",
        q: "Continue : 2, 4, 6, 8, ...",
        options: ["9", "10", "11"],
        answer: "10",
        img: "🔢",
      },
      {
        type: "qcm",
        q: "🦕🌋🦕🌋🦕... Que vient ensuite ?",
        options: ["🦕", "🌋", "🚀"],
        answer: "🌋",
        img: "❓",
      },
      {
        type: "qcm",
        q: "Trouve l'intrus : 🔵🔵🔵🟢🔵",
        options: ["🔵", "🟢"],
        answer: "🟢",
        img: "👀",
      },
      {
        type: "qcm",
        q: "Continue : ⭐⭐🌙⭐⭐🌙⭐⭐...",
        options: ["⭐", "🌙", "☀️"],
        answer: "🌙",
        img: "✨",
      },
    ],
  },
};

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
    setLevelComplete(false);
    setScreen("exercise");
  };

  const checkAnswer = (answer: string) => {
    if (!currentIsland) return;
    const exercises = EXERCISES[currentIsland][currentLevel];
    const correct = exercises[exerciseIndex].answer === answer;

    if (correct) {
      setProgress((p) => {
        const newStars = [...p[currentIsland].stars];
        newStars[currentLevel - 1] += 1;
        return {
          ...p,
          stars: p.stars + 1,
          [currentIsland]: { ...p[currentIsland], stars: newStars },
        };
      });
    }

    setFeedback(correct ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
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

  const resetGame = () => {
    setProgress(INITIAL_PROGRESS);
    setScreen("avatar");
  };

  // Avatar Selection Screen
  if (screen === "avatar") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🦕 L'Aventure des Explorateurs 🚀
          </h1>
          <p className="text-purple-200">Choisis ton avatar pour commencer !</p>
        </div>
        <div className="flex gap-4 flex-wrap justify-center">
          {AVATARS.map((av) => (
            <button
              key={av.id}
              onClick={() => selectAvatar(av)}
              className="bg-white/20 hover:bg-white/30 rounded-2xl p-6 transition-all hover:scale-110 backdrop-blur"
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
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white/90 rounded-2xl p-4 mb-6 flex items-center justify-between backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{progress.avatar?.emoji}</span>
              <div>
                <div className="font-bold text-gray-800">
                  {progress.avatar?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Explorateur en herbe
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-yellow-700">
                {progress.stars}
              </span>
            </div>
          </div>

          <h2 className="text-center text-white text-xl font-bold mb-6 drop-shadow-lg">
            🗺️ Choisis une île à explorer !
          </h2>

          {/* Islands */}
          <div className="grid grid-cols-2 gap-4">
            {ISLANDS.map((island) => {
              const islandProgress = progress[island.id];
              const totalStars = islandProgress.stars.reduce(
                (a: number, b: number) => a + b,
                0,
              );
              return (
                <button
                  key={island.id}
                  onClick={() => enterIsland(island.id)}
                  className={`${island.color} hover:opacity-90 rounded-2xl p-4 text-white transition-all hover:scale-105 shadow-lg`}
                >
                  <div className="text-4xl mb-2">{island.emoji}</div>
                  <div className="font-bold text-lg">{island.name}</div>
                  <div className="text-sm opacity-90">{island.desc}</div>
                  <div className="mt-2 flex justify-center gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <span
                        key={lvl}
                        className={`text-lg ${islandProgress.unlocked.includes(lvl) ? "" : "opacity-40"}`}
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
            className="mt-6 mx-auto block text-white/70 hover:text-white text-sm underline"
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
      <div className={`min-h-screen ${island.color} bg-opacity-80 p-4`}>
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setScreen("map")}
            className="mb-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur"
          >
            ← Retour à la carte
          </button>

          <div className="bg-white/90 rounded-2xl p-6 backdrop-blur text-center mb-6">
            <div className="text-5xl mb-2">{island.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800">{island.name}</h2>
            <p className="text-gray-600">{island.desc}</p>
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
                  className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                    unlocked
                      ? "bg-white hover:bg-white/90 shadow-lg hover:scale-102"
                      : "bg-white/30 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{unlocked ? "🎯" : "🔒"}</span>
                    <div className="text-left">
                      <div
                        className={`font-bold ${unlocked ? "text-gray-800" : "text-gray-500"}`}
                      >
                        Niveau {level}
                      </div>
                      <div className="text-sm text-gray-500">
                        {level === 1 && "Facile"}
                        {level === 2 && "Moyen"}
                        {level === 3 && "Difficile"}
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

          <div className="mt-6 bg-white/80 rounded-xl p-4 text-center backdrop-blur">
            <p className="text-sm text-gray-600">
              🔓 Gagne <strong>3 étoiles</strong> pour débloquer le niveau
              suivant !
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Exercise Screen
  if (screen === "exercise" && currentIsland) {
    const exercises = EXERCISES[currentIsland][currentLevel];
    const exercise = exercises[exerciseIndex];
    const island = ISLANDS.find((i) => i.id === currentIsland);
    if (!island) return null;

    if (levelComplete) {
      const stars = progress[currentIsland].stars[currentLevel - 1];
      const unlocked = stars >= 3 && currentLevel < 3;

      return (
        <div
          className={`min-h-screen ${island.color} flex items-center justify-center p-4`}
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Niveau terminé !
            </h2>
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
            <p className="text-gray-600 mb-4">
              Tu as gagné {stars} étoile{stars > 1 ? "s" : ""} !
            </p>

            {unlocked && (
              <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4">
                🔓 Niveau {currentLevel + 1} débloqué !
              </div>
            )}

            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => {
                  setExerciseIndex(0);
                  setLevelComplete(false);
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
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium"
              >
                🔄 Rejouer
              </button>
              <button
                onClick={() => setScreen("island")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium"
              >
                📋 Niveaux
              </button>
              <button
                onClick={() => setScreen("map")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium"
              >
                🗺️ Carte
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`min-h-screen ${island.color} p-4`}>
        <div className="max-w-md mx-auto">
          {/* Progress bar */}
          <div className="bg-white/20 rounded-full h-3 mb-4 backdrop-blur">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{
                width: `${((exerciseIndex + 1) / exercises.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-white text-sm mb-4">
            <span>
              Question {exerciseIndex + 1}/{exercises.length}
            </span>
            <span>⭐ {progress[currentIsland].stars[currentLevel - 1]}</span>
          </div>

          {/* Question Card */}
          <div
            className={`bg-white rounded-3xl p-6 shadow-2xl transition-all ${
              feedback === "correct"
                ? "ring-4 ring-green-400"
                : feedback === "incorrect"
                  ? "ring-4 ring-red-400"
                  : ""
            }`}
          >
            <div className="text-6xl text-center mb-4">{exercise.img}</div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
              {exercise.q}
            </h3>

            <div className="space-y-3">
              {exercise.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => !feedback && checkAnswer(opt)}
                  disabled={!!feedback}
                  className={`w-full p-4 rounded-xl text-lg font-medium transition-all ${
                    feedback && opt === exercise.answer
                      ? "bg-green-500 text-white"
                      : feedback && opt !== exercise.answer
                        ? "bg-gray-200 text-gray-400"
                        : "bg-gray-100 hover:bg-blue-100 text-gray-800 hover:scale-102"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback && (
              <div
                className={`mt-4 p-4 rounded-xl text-center text-lg font-bold ${
                  feedback === "correct"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {feedback === "correct"
                  ? "✅ Bravo !"
                  : `❌ La réponse était : ${exercise.answer}`}
              </div>
            )}
          </div>

          <button
            onClick={() => setScreen("island")}
            className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl backdrop-blur"
          >
            ← Quitter l'exercice
          </button>
        </div>
      </div>
    );
  }

  return null;
}
