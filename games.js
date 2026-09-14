/* ============================================================
   SOIRÉE — GAMES ENGINE
   BUILD 08.0

   CONTRAT D'UN JEU
   ------------------------------------------------------------
   type:
     GROUP_VOTE       → le groupe désigne quelqu'un
     TARGET_CHALLENGE → une personne reçoit une action/question
     SECRET           → une information privée est révélée
     ROTATION         → chacun joue à son tour
     BLUFF            → un joueur bluffe / ment
     GROUP            → tout le groupe participe
     CHOICE           → choix collectif
     IMPRO            → défi improvisé

   actor:
     NONE | ONE | TWO | ROTATION | ALL

   target:
     NONE | ONE | TWO | ALL | VOTE

   phone:
     false           → aucun passage de téléphone
     true            → passage uniquement si une information privée
                       doit réellement être consultée

   vote:
     NONE
     GROUP            → vote physique / confirmation du groupe
     SECRET           → vote réellement effectué sur le téléphone

   penalty:
     NONE
     ACTOR
     TARGET
     LOSER
     VOTED_PLAYER

   IMPORTANT :
   Le moteur ne doit jamais inventer une cible pour un jeu
   dont la cible est déterminée par le groupe.
   ============================================================ */

const GAME_TYPES = {
  GROUP_VOTE: "GROUP_VOTE",
  TARGET_CHALLENGE: "TARGET_CHALLENGE",
  SECRET: "SECRET",
  ROTATION: "ROTATION",
  BLUFF: "BLUFF",
  GROUP: "GROUP",
  CHOICE: "CHOICE",
  IMPRO: "IMPRO"
};

const ACTOR_MODES = {
  NONE: "NONE",
  ONE: "ONE",
  TWO: "TWO",
  ROTATION: "ROTATION",
  ALL: "ALL"
};

const TARGET_MODES = {
  NONE: "NONE",
  ONE: "ONE",
  TWO: "TWO",
  ALL: "ALL",
  VOTE: "VOTE"
};

const VOTE_MODES = {
  NONE: "NONE",
  GROUP: "GROUP",
  SECRET: "SECRET"
};

const PENALTIES = {
  NONE: "NONE",
  ACTOR: "ACTOR",
  TARGET: "TARGET",
  LOSER: "LOSER",
  VOTED_PLAYER: "VOTED_PLAYER"
};

const PHONE_MODES = {
  NONE: false,
  PRIVATE: true
};


/* ============================================================
   GAME DEFINITIONS
   ============================================================ */

const GAMES = [

  /* ----------------------------------------------------------
     VOTES DU GROUPE
     ---------------------------------------------------------- */

  {
    id: "G001",
    name: "Qui pourrait ?",
    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.VOTE,

    contentPool: "VOTE",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.VOTED_PLAYER,

    flow: [
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G002",
    name: "Majorité",
    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.VOTE,

    contentPool: "MAJORITY",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.VOTED_PLAYER,

    flow: [
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G003",
    name: "Cible du groupe",
    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.VOTE,

    contentPool: "TARGET",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.VOTED_PLAYER,

    flow: [
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G005",
    name: "Le plus suspect",
    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.VOTE,

    contentPool: "SUSPECT",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.VOTED_PLAYER,

    flow: [
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     QUESTION / CIBLE
     ---------------------------------------------------------- */

  {
    id: "G004",
    name: "Qui me connaît ?",
    type: GAME_TYPES.TARGET_CHALLENGE,

    actor: ACTOR_MODES.ONE,
    target: TARGET_MODES.ONE,

    contentPool: "KNOWLEDGE",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PROMPT",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     RAPIDITÉ
     ---------------------------------------------------------- */

  {
    id: "G006",
    name: "Catégorie express",
    type: GAME_TYPES.ROTATION,

    actor: ACTOR_MODES.ROTATION,
    target: TARGET_MODES.NONE,

    contentPool: "CATEGORY",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.ACTOR,

    timer: 5,

    flow: [
      "PROMPT",
      "ROTATION",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G007",
    name: "Association",
    type: GAME_TYPES.ROTATION,

    actor: ACTOR_MODES.ROTATION,
    target: TARGET_MODES.NONE,

    contentPool: "WORD",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.ACTOR,

    timer: 5,

    flow: [
      "PROMPT",
      "ROTATION",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G009",
    name: "Le mot suivant",
    type: GAME_TYPES.ROTATION,

    actor: ACTOR_MODES.ROTATION,
    target: TARGET_MODES.NONE,

    contentPool: "WORD",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.ACTOR,

    timer: 5,

    flow: [
      "PROMPT",
      "ROTATION",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     JEUX À INFORMATION SECRÈTE
     ---------------------------------------------------------- */

  {
    id: "G008",
    name: "Mot interdit",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "FORBIDDEN_WORD",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G010",
    name: "Piège à mot",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "TRAP_WORD",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G014",
    name: "Le piège",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "TRAP_PROMPT",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G015",
    name: "Mission secrète",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "MISSION",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     BLUFF
     ---------------------------------------------------------- */

  {
    id: "G011",
    name: "Deux vérités, un mensonge",
    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.ONE,
    target: TARGET_MODES.NONE,

    contentPool: "STATEMENTS",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.ACTOR,

    flow: [
      "SELECT_TARGET",
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G012",
    name: "Bluff total",
    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.ONE,
    target: TARGET_MODES.NONE,

    contentPool: "BLUFF",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.ACTOR,

    flow: [
      "SELECT_TARGET",
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G013",
    name: "Qui ment ?",
    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.TWO,
    target: TARGET_MODES.TWO,

    contentPool: "BLUFF",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.GROUP,

    penalty: PENALTIES.LOSER,

    flow: [
      "SELECT_PLAYERS",
      "PROMPT",
      "GROUP_VOTE",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 4,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     DEVINETTES
     ---------------------------------------------------------- */

  {
    id: "G016",
    name: "Devine mon mot",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "GUESS_WORD",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G017",
    name: "Description impossible",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "DESCRIPTION",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G018",
    name: "Mime express",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "MIME",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G019",
    name: "L'expression",
    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "EXPRESSION",

    phone: PHONE_MODES.PRIVATE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PRIVATE_REVEAL",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     QUESTIONS PERSONNELLES
     ---------------------------------------------------------- */

  {
    id: "G020",
    name: "Question chaude",
    type: GAME_TYPES.TARGET_CHALLENGE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "HOT",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.NONE,

    flow: [
      "SELECT_TARGET",
      "PROMPT",
      "PLAY",
      "RESOLVE"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     JEUX DE GROUPE
     ---------------------------------------------------------- */

  {
    id: "G021",
    name: "Choix impossible",
    type: GAME_TYPES.CHOICE,

    actor: ACTOR_MODES.ALL,
    target: TARGET_MODES.ALL,

    contentPool: "CHOICE",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.NONE,

    flow: [
      "PROMPT",
      "GROUP",
      "RESOLVE"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },

  {
    id: "G022",
    name: "Vérité de groupe",
    type: GAME_TYPES.GROUP,

    actor: ACTOR_MODES.ALL,
    target: TARGET_MODES.ALL,

    contentPool: "GROUP_TRUTH",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.NONE,

    flow: [
      "PROMPT",
      "GROUP",
      "RESOLVE"
    ],

    minPlayers: 3,
    maxPlayers: 12
  },


  /* ----------------------------------------------------------
     IMPROVISATION
     ---------------------------------------------------------- */

  {
    id: "G023",
    name: "Mission improvisée",
    type: GAME_TYPES.IMPRO,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    contentPool: "IMPRO",

    phone: PHONE_MODES.NONE,
    vote: VOTE_MODES.NONE,

    penalty: PENALTIES.TARGET,

    flow: [
      "SELECT_TARGET",
      "PROMPT",
      "PLAY",
      "RESOLVE",
      "PENALTY"
    ],

    minPlayers: 3,
    maxPlayers: 12
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

function gameNeedsPhone(game) {
  return Boolean(game?.phone);
}

function gameNeedsVote(game) {
  return game?.vote !== VOTE_MODES.NONE;
}

function gameNeedsTarget(game) {
  return (
    game?.target === TARGET_MODES.ONE ||
    game?.target === TARGET_MODES.TWO
  );
}

function gameTargetIsDeterminedByVote(game) {
  return game?.target === TARGET_MODES.VOTE;
}

function gameHasPenalty(game) {
  return game?.penalty !== PENALTIES.NONE;
}

function gameIsSecret(game) {
  return game?.type === GAME_TYPES.SECRET;
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateGameDefinition(game) {

  const errors = [];

  if (!game.id) {
    errors.push("ID manquant");
  }

  if (!game.name) {
    errors.push("Nom manquant");
  }

  if (!Object.values(GAME_TYPES).includes(game.type)) {
    errors.push(`Type invalide : ${game.type}`);
  }

  if (!Object.values(ACTOR_MODES).includes(game.actor)) {
    errors.push(`Mode acteur invalide : ${game.actor}`);
  }

  if (!Object.values(TARGET_MODES).includes(game.target)) {
    errors.push(`Mode cible invalide : ${game.target}`);
  }

  if (!Object.values(VOTE_MODES).includes(game.vote)) {
    errors.push(`Mode vote invalide : ${game.vote}`);
  }

  if (!Object.values(PENALTIES).includes(game.penalty)) {
    errors.push(`Pénalité invalide : ${game.penalty}`);
  }

  if (!game.contentPool) {
    errors.push("Pool de contenu manquant");
  }

  if (!Array.isArray(game.flow) || game.flow.length === 0) {
    errors.push("Flow manquant");
  }

  /*
   * Un jeu qui utilise le téléphone doit avoir
   * une phase privée.
   */
  if (
    game.phone === true &&
    !game.flow.includes("PRIVATE_REVEAL")
  ) {
    errors.push(
      "Téléphone privé déclaré mais aucune phase PRIVATE_REVEAL"
    );
  }

  /*
   * Un vote doit réellement avoir une phase GROUP_VOTE
   * ou SECRET_VOTE.
   */
  if (
    game.vote !== VOTE_MODES.NONE &&
    !game.flow.includes("GROUP_VOTE") &&
    !game.flow.includes("SECRET_VOTE")
  ) {
    errors.push(
      "Mode de vote déclaré mais aucune phase de vote"
    );
  }

  /*
   * Une cible déterminée par vote ne doit jamais
   * être préassignée comme une cible classique.
   */
  if (
    game.target === TARGET_MODES.VOTE &&
    game.target !== TARGET_MODES.ONE &&
    game.target !== TARGET_MODES.TWO
  ) {
    // comportement attendu
  }

  /*
   * Une pénalité nécessite obligatoirement une résolution.
   */
  if (
    game.penalty !== PENALTIES.NONE &&
    !game.flow.includes("RESOLVE")
  ) {
    errors.push(
      "Pénalité déclarée mais aucune phase RESOLVE"
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}


/* ============================================================
   GLOBAL VALIDATOR
   ============================================================ */

function validateAllGames() {

  const report = {
    valid: true,
    total: GAMES.length,
    errors: []
  };

  const ids = new Set();

  GAMES.forEach(game => {

    if (ids.has(game.id)) {
      report.errors.push(
        `${game.id} : ID en double`
      );
    }

    ids.add(game.id);

    const result = validateGameDefinition(game);

    if (!result.valid) {
      report.valid = false;

      result.errors.forEach(error => {
        report.errors.push(
          `${game.id} — ${game.name} : ${error}`
        );
      });
    }
  });

  return report;
}


/* ============================================================
   COMPATIBILITÉ
   ============================================================ */

const GAME_LIST = GAMES;
