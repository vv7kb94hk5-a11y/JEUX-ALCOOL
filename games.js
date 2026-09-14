/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 08.2
   ============================================================ */

/*
  CONTRAT D'UN JEU

  id
  name
  type
  family
  target
  actor
  phone
  voteMode
  penalty
  contentPool
  flow

  Règle importante :
  Le jeu décrit CE QUI DOIT SE PASSER.
  Le moteur ne doit pas inventer une étape absente du flow.
*/


/* ============================================================
   23 JEUX
   ============================================================ */

const GAMES = [

  /* ==========================================================
     VOTE / QUESTIONS
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  {
    id: "G002",
    name: "Majorité",
    type: GAME_TYPES.GROUP_VOTE,
    family: "VOTE",

    /*
      IMPORTANT :
      La cible n'est PAS choisie avant le vote.
      Elle est déterminée par le groupe.
    */
    target: TARGET_MODES.NONE,
    actor: ACTOR_MODES.NONE,

    phone: false,
    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    contentPool: "MAJORITY",

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     RAPIDITÉ
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     SECRET / TÉLÉPHONE
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

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     BLUFF
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     DEVINETTES
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
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


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
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  {
    id: "G019",
    name: "L’expression",
    type: GAME_TYPES.SECRET,
    family: "DEVINETTE",

    target: TARGET_MODES.ONE,
    actor: ACTOR_MODES.TARGET,

    phone: true,
    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    contentPool: "EXPRESSION",

    /*
      IMPORTANT :
      Le téléphone n'est utilisé que pour révéler
      l'expression au joueur concerné.
      L'expression ne doit jamais apparaître
      sur une phase publique.
    */

    flow: [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.PASS_PHONE,
      FLOW_PHASES.SECRET_REVEAL,
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RETURN_PHONE,
      FLOW_PHASES.RESOLVE,
      FLOW_PHASES.PENALTY
    ]
  },


  /* ==========================================================
     PERSONNEL
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     GROUPE
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE
    ]
  },


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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     IMPRO
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
      FLOW_PHASES.PLAY,
      FLOW_PHASES.RESOLVE,
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
   ACCÈS RAPIDE
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

  if (!Array.isArray(GAMES)) {

    return [{
      game: "DATABASE",
      errors: ["GAMES n'est pas un tableau."]
    }];
  }


  const ids = new Set();

  GAMES.forEach(game => {

    if (ids.has(game.id)) {

      errors.push({
        game: game.id,
        errors: ["ID de jeu dupliqué."]
      });

    }

    ids.add(game.id);


    const gameErrors =
      typeof validateGameDefinition === "function"
        ? validateGameDefinition(game)
        : [];


    if (gameErrors.length) {

      errors.push({
        game: game.id,
        errors: gameErrors
      });
    }


    if (
      !game.contentPool ||
      typeof QUESTIONS === "undefined" ||
      !QUESTIONS[game.contentPool]
    ) {

      errors.push({
        game: game.id,
        errors: [
          `Pool de contenu introuvable : ${game.contentPool}`
        ]
      });
    }
  });


  return errors;
}


/* ============================================================
   RAPPORT DE DÉVELOPPEMENT
   ============================================================ */

function getGamesDiagnostic() {

  return GAMES.map(game => ({

    id: game.id,

    name: game.name,

    type: game.type,

    family: game.family,

    target: game.target,

    actor: game.actor,

    phone: game.phone,

    voteMode: game.voteMode,

    penalty: game.penalty,

    contentPool: game.contentPool,

    flow: [...game.flow]

  }));
}
