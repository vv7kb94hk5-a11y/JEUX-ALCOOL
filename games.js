/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 04.0
   Architecture :
   GAME → PHASES → ROLES → SCREENS → ACTIONS
   ============================================================ */

const GAMES = [

  /* ==========================================================
     VOTE
     ========================================================== */

  {
    id: "G001",
    name: "Qui pourrait ?",
    family: "VOTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 30,
    intensity: 1,
    cooldown: 6,
    targetType: "ONE",
    contentPool: "VOTE",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["vote", "personne", "groupe", "rapide"]
  },

  {
    id: "G002",
    name: "Majorité",
    family: "VOTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 35,
    intensity: 1,
    cooldown: 6,
    targetType: "ONE",
    contentPool: "MAJORITY",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["vote", "majorite", "groupe"]
  },

  {
    id: "G003",
    name: "Cible du groupe",
    family: "VOTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 35,
    intensity: 1,
    cooldown: 7,
    targetType: "ONE",
    contentPool: "TARGET",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["vote", "cible", "groupe"]
  },

  {
    id: "G004",
    name: "Qui me connaît ?",
    family: "VOTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 1,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "KNOWLEDGE",
    roles: {
      target: true,
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["vote", "connaissance", "personnel"]
  },

  {
    id: "G005",
    name: "Le plus suspect",
    family: "VOTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 35,
    intensity: 2,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "SUSPECT",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["vote", "suspect", "accusation"]
  },


  /* ==========================================================
     RAPIDITÉ
     ========================================================== */

  {
    id: "G006",
    name: "Catégorie express",
    family: "RAPIDITE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 7,
    targetType: "ROTATION",
    contentPool: "CATEGORY",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["rapidite", "categorie", "rotation"]
  },

  {
    id: "G007",
    name: "Association",
    family: "RAPIDITE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 40,
    intensity: 2,
    cooldown: 7,
    targetType: "ROTATION",
    contentPool: "WORD",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["rapidite", "association", "mots"]
  },

  {
    id: "G008",
    name: "Mot interdit",
    family: "RAPIDITE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "FORBIDDEN_WORD",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["mot", "secret", "piege", "rapidite"]
  },

  {
    id: "G009",
    name: "Le mot suivant",
    family: "RAPIDITE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 7,
    targetType: "ROTATION",
    contentPool: "WORD",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["mot", "chaine", "rapidite"]
  },

  {
    id: "G010",
    name: "Piège à mot",
    family: "RAPIDITE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 50,
    intensity: 2,
    cooldown: 9,
    targetType: "ONE",
    contentPool: "TRAP_WORD",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["mot", "piege", "secret"]
  },


  /* ==========================================================
     BLUFF
     ========================================================== */

  {
    id: "G011",
    name: "Deux vérités, un mensonge",
    family: "BLUFF",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 10,
    targetType: "ONE",
    contentPool: "STATEMENTS",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["bluff", "mensonge", "vote"]
  },

  {
    id: "G012",
    name: "Bluff total",
    family: "BLUFF",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 10,
    targetType: "ONE",
    contentPool: "BLUFF",
    roles: {
      player: true,
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["bluff", "mensonge", "strategie"]
  },

  {
    id: "G013",
    name: "Qui ment ?",
    family: "BLUFF",
    minPlayers: 4,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 10,
    targetType: "TWO_PLAYERS",
    contentPool: "BLUFF",
    roles: {
      player: true,
      opponent: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "VOTE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["bluff", "duel", "vote"]
  },

  {
    id: "G014",
    name: "Le piège",
    family: "BLUFF",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 55,
    intensity: 2,
    cooldown: 10,
    targetType: "ONE",
    contentPool: "TRAP_PROMPT",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["bluff", "piege", "secret"]
  },

  {
    id: "G015",
    name: "Mission secrète",
    family: "BLUFF",
    minPlayers: 4,
    maxPlayers: 12,
    duration: 90,
    intensity: 2,
    cooldown: 12,
    targetType: "ONE",
    contentPool: "MISSION",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["secret", "mission", "bluff"]
  },


  /* ==========================================================
     DEVINETTE
     ========================================================== */

  {
    id: "G016",
    name: "Devine mon mot",
    family: "DEVINETTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 50,
    intensity: 2,
    cooldown: 9,
    targetType: "ONE",
    contentPool: "GUESS_WORD",
    roles: {
      player: true,
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["devinette", "mot", "secret"]
  },

  {
    id: "G017",
    name: "Description impossible",
    family: "DEVINETTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 9,
    targetType: "ONE",
    contentPool: "DESCRIPTION",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_PLAYER",
      visibility: "PLAYER_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["devinette", "description", "secret"]
  },

  {
    id: "G018",
    name: "Mime express",
    family: "DEVINETTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "MIME",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_PLAYER",
      visibility: "PLAYER_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["mime", "devinette", "secret"]
  },

  {
    id: "G019",
    name: "L'expression",
    family: "DEVINETTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 50,
    intensity: 2,
    cooldown: 9,
    targetType: "ONE",
    contentPool: "EXPRESSION",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_PLAYER",
      visibility: "PLAYER_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["expression", "devinette", "secret"]
  },

  {
    id: "G020",
    name: "Impro impossible",
    family: "DEVINETTE",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 60,
    intensity: 3,
    cooldown: 10,
    targetType: "ONE",
    contentPool: "IMPRO",
    roles: {
      player: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_PLAYER",
      visibility: "PLAYER_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["impro", "chaos", "secret"]
  },


  /* ==========================================================
     PERSONNEL
     ========================================================== */

  {
    id: "G021",
    name: "Question hot",
    family: "PERSONNEL",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 3,
    cooldown: 10,
    targetType: "ONE",
    contentPool: "HOT",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "CHOICE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["hot", "personnel", "question"]
  },

  {
    id: "G022",
    name: "Aveu ou pénalité",
    family: "PERSONNEL",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 9,
    targetType: "ONE",
    contentPool: "HOT",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "CHOICE",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["aveu", "choix", "penalite"]
  },

  {
    id: "G023",
    name: "Tu préfères ?",
    family: "PERSONNEL",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 40,
    intensity: 2,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "WOULD_YOU_RATHER",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "CHOICE",
      "RESULT",
      "NEXT"
    ],
    tags: ["choix", "personnel", "dilemme"]
  },

  {
    id: "G024",
    name: "Ton choix",
    family: "PERSONNEL",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 8,
    targetType: "ONE",
    contentPool: "CHOICE",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PLAY",
      "CHOICE",
      "RESULT",
      "NEXT"
    ],
    tags: ["choix", "decision", "personnel"]
  },

  {
    id: "G025",
    name: "Vérité de groupe",
    family: "PERSONNEL",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 50,
    intensity: 2,
    cooldown: 10,
    targetType: "ALL",
    contentPool: "GROUP_TRUTH",
    roles: {
      group: true,
      narrator: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["groupe", "verite", "personnel"]
  },


  /* ==========================================================
     CHAOS / DUO
     ========================================================== */

  {
    id: "G026",
    name: "Duo improbable",
    family: "CHAOS",
    minPlayers: 4,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 10,
    targetType: "PAIR",
    contentPool: "DUO",
    roles: {
      pair: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["duo", "improbable", "chaos"]
  },

  {
    id: "G027",
    name: "Revanche",
    family: "CHAOS",
    minPlayers: 4,
    maxPlayers: 12,
    duration: 60,
    intensity: 2,
    cooldown: 10,
    targetType: "TWO_PLAYERS",
    contentPool: "DUEL",
    roles: {
      player: true,
      opponent: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "SELECT_PLAYERS",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["duel", "revanche", "competition"]
  },

  {
    id: "G028",
    name: "Tout le monde",
    family: "CHAOS",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 45,
    intensity: 2,
    cooldown: 9,
    targetType: "ALL",
    contentPool: "GROUP",
    roles: {
      group: true,
      narrator: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["groupe", "tous", "chaos"]
  },

  {
    id: "G029",
    name: "Chaos total",
    family: "CHAOS",
    minPlayers: 3,
    maxPlayers: 12,
    duration: 60,
    intensity: 3,
    cooldown: 12,
    targetType: "ALL",
    contentPool: "CHAOS",
    roles: {
      group: true,
      narrator: true
    },
    phone: {
      mode: "NONE",
      visibility: "PUBLIC"
    },
    phases: [
      "INTRO",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["chaos", "groupe", "surprise"]
  },

  {
    id: "G030",
    name: "Règle secrète",
    family: "CHAOS",
    minPlayers: 4,
    maxPlayers: 12,
    duration: 90,
    intensity: 3,
    cooldown: 12,
    targetType: "ONE",
    contentPool: "SECRET_RULE",
    roles: {
      target: true,
      narrator: true,
      group: true
    },
    phone: {
      mode: "PASS_TO_TARGET",
      visibility: "TARGET_ONLY"
    },
    phases: [
      "INTRO",
      "SELECT_TARGET",
      "PASS_PHONE",
      "PRIVATE_REVEAL",
      "RETURN_PHONE",
      "PLAY",
      "RESULT",
      "PENALTY",
      "NEXT"
    ],
    tags: ["secret", "regle", "chaos"]
  }

];


/* ============================================================
   HELPERS
   ============================================================ */

function getGameById(id) {
  return GAMES.find(game => game.id === id) || null;
}

function getGamesForPlayers(playerCount) {
  return GAMES.filter(game =>
    playerCount >= game.minPlayers &&
    playerCount <= game.maxPlayers
  );
}

function getGamesByFamily(family) {
  return GAMES.filter(game => game.family === family);
}

function getGamesByPhase(phase) {
  return GAMES.filter(game =>
    Array.isArray(game.phases) &&
    game.phases.includes(phase)
  );
}
