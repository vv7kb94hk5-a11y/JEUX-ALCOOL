/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 08.5
   ============================================================

   NOUVELLE ARCHITECTURE

   Un jeu décrit une expérience, pas une succession
   d'écrans techniques.

   FLOWS DISPONIBLES :

   INTRO
   SELECT_TARGET
   SELECT_PLAYERS
   PASS_SECRET
   SECRET_ACTION
   ACTION
   VOTE
   RESOLVE
   SUCCESS_CHECK
   PENALTY

   RÈGLE :
   aucune phase technique inutile.
   ============================================================ */


/* ============================================================
   GAMES
   ============================================================ */

const GAMES = [

  /* ==========================================================
     01 — QUI POURRAIT ?
     ========================================================== */

  {
    id: "G001",
    name: "Qui pourrait ?",

    type: GAME_TYPES.GROUP_VOTE,
    family: "VOTE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "VOTE",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     02 — MAJORITÉ
     ========================================================== */

  {
    id: "G002",
    name: "Majorité",

    type: GAME_TYPES.GROUP_VOTE,
    family: "VOTE",

    /*
      AUCUNE CIBLE AVANT LE VOTE.
      Le groupe la détermine.
    */

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "MAJORITY",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     03 — CIBLE DU GROUPE
     ========================================================== */

  {
    id: "G003",
    name: "Cible du groupe",

    type: GAME_TYPES.GROUP_VOTE,
    family: "VOTE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "TARGET",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     04 — QUI ME CONNAÎT ?
     ========================================================== */

  {
    id: "G004",
    name: "Qui me connaît ?",

    type: GAME_TYPES.INDIVIDUAL,
    family: "QUESTION",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "KNOWLEDGE",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     05 — LE PLUS SUSPECT
     ========================================================== */

  {
    id: "G005",
    name: "Le plus suspect",

    type: GAME_TYPES.GROUP_VOTE,
    family: "VOTE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "SUSPECT",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     06 — CATÉGORIE EXPRESS
     ========================================================== */

  {
    id: "G006",
    name: "Catégorie express",

    type: GAME_TYPES.RAPID,
    family: "RAPIDITE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.RANDOM,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "CATEGORY",

    timer: 10,

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     07 — ASSOCIATION
     ========================================================== */

  {
    id: "G007",
    name: "Association",

    type: GAME_TYPES.RAPID,
    family: "RAPIDITE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.RANDOM,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "WORD",

    timer: 5,

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     08 — MOT INTERDIT
     ========================================================== */

  {
    id: "G008",
    name: "Mot interdit",

    type: GAME_TYPES.SECRET,
    family: "SECRET",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "FORBIDDEN_WORD",

    /*
      3 moments :

      1. Passe le téléphone
      2. Secret + règle
      3. Réussite ?
    */

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     09 — LE MOT SUIVANT
     ========================================================== */

  {
    id: "G009",
    name: "Le mot suivant",

    type: GAME_TYPES.RAPID,
    family: "RAPIDITE",

    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.RANDOM,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "WORD",

    timer: 5,

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     10 — PIÈGE À MOT
     ========================================================== */

  {
    id: "G010",
    name: "Piège à mot",

    type: GAME_TYPES.SECRET,
    family: "SECRET",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "TRAP_WORD",

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     11 — DEUX VÉRITÉS, UN MENSONGE
     ========================================================== */

  {
    id: "G011",
    name: "Deux vérités, un mensonge",

    type: GAME_TYPES.BLUFF,
    family: "BLUFF",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "STATEMENTS",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     12 — BLUFF TOTAL
     ========================================================== */

  {
    id: "G012",
    name: "Bluff total",

    type: GAME_TYPES.BLUFF,
    family: "BLUFF",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "BLUFF",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     13 — QUI MENT ?
     ========================================================== */

  {
    id: "G013",
    name: "Qui ment ?",

    type: GAME_TYPES.BLUFF,
    family: "BLUFF",

    target: TARGET_MODES.TWO,
    actor: ACTOR_MODES.SELECTED,

    phone: false,

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "BLUFF",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_PLAYERS,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     14 — LE PIÈGE
     ========================================================== */

  {
    id: "G014",
    name: "Le piège",

    type: GAME_TYPES.SECRET,
    family: "BLUFF",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "TRAP_PROMPT",

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     15 — MISSION SECRÈTE
     ========================================================== */

  {
    id: "G015",
    name: "Mission secrète",

    type: GAME_TYPES.SECRET,
    family: "BLUFF",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    contentPool: "MISSION",

    /*
      La mission peut continuer pendant la soirée.
      Pas de pénalité automatique.
    */

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION
    ]
  },


  /* ==========================================================
     16 — DEVINE MON MOT
     ========================================================== */

  {
    id: "G016",
    name: "Devine mon mot",

    type: GAME_TYPES.SECRET,
    family: "DEVINETTE",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "GUESS_WORD",

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     17 — DESCRIPTION IMPOSSIBLE
     ========================================================== */

  {
    id: "G017",
    name: "Description impossible",

    type: GAME_TYPES.SECRET,
    family: "DEVINETTE",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "DESCRIPTION",

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     18 — MIME EXPRESS
     ========================================================== */

  {
    id: "G018",
    name: "Mime express",

    type: GAME_TYPES.SECRET,
    family: "DEVINETTE",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "MIME",

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     19 — L'EXPRESSION
     ========================================================== */

  {
    id: "G019",
    name: "L'expression",

    type: GAME_TYPES.SECRET,
    family: "DEVINETTE",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "EXPRESSION",

    /*
      FLOW FINAL :

      Écran 1
      Passe le téléphone à Guillaume

      Écran 2
      Expression + consigne secrète

      Écran 3
      Guillaume : réussi OUI / NON
    */

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     20 — QUESTION CHAUDE
     ========================================================== */

  {
    id: "G020",
    name: "Question chaude",

    type: GAME_TYPES.INDIVIDUAL,
    family: "PERSONNEL",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    contentPool: "HOT",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     21 — CHOIX IMPOSSIBLE
     ========================================================== */

  {
    id: "G021",
    name: "Choix impossible",

    type: GAME_TYPES.GROUP,
    family: "CHOIX",

    target: TARGET_MODES.ALL,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    contentPool: "CHOICE",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     22 — VÉRITÉ DE GROUPE
     ========================================================== */

  {
    id: "G022",
    name: "Vérité de groupe",

    type: GAME_TYPES.GROUP,
    family: "GROUPE",

    target: TARGET_MODES.ALL,
    actor: ACTOR_MODES.NONE,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    contentPool: "GROUP_TRUTH",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     23 — MISSION IMPROVISÉE
     ========================================================== */

  {
    id: "G023",
    name: "Mission improvisée",

    type: GAME_TYPES.INDIVIDUAL,
    family: "IMPRO",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: false,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "IMPRO",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK,
      FLOW_PHASES.PENALTY
    ]
  }

];


/* ============================================================
   INDEX
   ============================================================ */

const GAME_INDEX = {};

GAMES.forEach(game => {

  GAME_INDEX[game.id] = game;

});


/* ============================================================
   ACCÈS
   ============================================================ */

function getGameById(id) {

  return GAME_INDEX[id] || null;
}


function getAllGames() {

  return [...GAMES];
}


function getGamesByFamily(family) {

  return GAMES.filter(
    game => game.family === family
  );
}


function getGamesByType(type) {

  return GAMES.filter(
    game => game.type === type
  );
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateGamesDatabase() {

  const errors = [];

  const ids = new Set();


  GAMES.forEach(game => {

    /* --------------------------------------------------------
       ID
       -------------------------------------------------------- */

    if (ids.has(game.id)) {

      errors.push({

        game: game.id,

        errors: [
          "ID dupliqué."
        ]

      });

    }

    ids.add(game.id);


    /* --------------------------------------------------------
       VALIDATION MOTEUR
       -------------------------------------------------------- */

    if (
      typeof validateGameDefinition ===
      "function"
    ) {

      const gameErrors =
        validateGameDefinition(game);

      if (gameErrors.length) {

        errors.push({

          game: game.id,

          errors: gameErrors

        });

      }
    }


    /* --------------------------------------------------------
       POOL
       -------------------------------------------------------- */

    if (
      typeof QUESTIONS === "undefined"
    ) {

      errors.push({

        game: game.id,

        errors: [
          "QUESTIONS n'est pas chargé."
        ]

      });

    } else if (
      !game.contentPool ||
      !Array.isArray(
        QUESTIONS[game.contentPool]
      )
    ) {

      errors.push({

        game: game.id,

        errors: [
          `Pool invalide : ${game.contentPool}`
        ]

      });

    }

  });


  return errors;
}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

function getGamesDiagnostic() {

  return GAMES.map(game => ({

    id:
      game.id,

    name:
      game.name,

    type:
      game.type,

    family:
      game.family,

    target:
      game.target,

    actor:
      game.actor,

    phone:
      game.phone,

    voteMode:
      game.voteMode,

    penalty:
      game.penalty,

    contentPool:
      game.contentPool,

    flow:
      [...game.flow],

    screenCount:
      game.flow.length

  }));
}
