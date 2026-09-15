/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 08.7
   ============================================================

   PRINCIPES :
   - Aucun écran INTRO inutile
   - Aucun écran PENALTY séparé
   - Aucun écran RESULT intermédiaire inutile
   - Une action = une étape claire
   - Maximum de fluidité
   - Les secrets passent uniquement par le téléphone
   - Les conséquences sont intégrées à RESOLVE / SUCCESS_CHECK

   ARCHITECTURE DES FLUX :

   JEU PUBLIC AVEC VOTE
   ACTION → VOTE → RESOLVE

   JEU PUBLIC AVEC RÉUSSITE
   ACTION → SUCCESS_CHECK

   JEU SECRET
   PASS_SECRET → SECRET_ACTION → SUCCESS_CHECK

   MISSION SECRÈTE
   PASS_SECRET → SECRET_ACTION

   ============================================================ */


const GAMES = [

  /* ==========================================================
     G001 — QUI POURRAIT ?
     ========================================================== */

  {
    id: "G001",
    name: "Qui pourrait ?",
    family: "VOTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 1,
    cooldown: 6,

    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "VOTE",

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G002 — MAJORITÉ
     ========================================================== */

  {
    id: "G002",
    name: "Majorité",
    family: "VOTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 1,
    cooldown: 6,

    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "MAJORITY",

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G003 — CIBLE DU GROUPE
     ========================================================== */

  {
    id: "G003",
    name: "Cible du groupe",
    family: "VOTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 1,
    cooldown: 7,

    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "TARGET",

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G004 — QUI ME CONNAÎT ?
     ========================================================== */

  {
    id: "G004",
    name: "Qui me connaît ?",
    family: "CONNAISSANCE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 1,
    cooldown: 8,

    type: GAME_TYPES.INDIVIDUAL,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "KNOWLEDGE",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G005 — LE PLUS SUSPECT
     ========================================================== */

  {
    id: "G005",
    name: "Le plus suspect",
    family: "VOTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.GROUP_VOTE,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "SUSPECT",

    voteMode: VOTE_MODES.GROUP_CONFIRM,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G006 — CATÉGORIE EXPRESS
     ========================================================== */

  {
    id: "G006",
    name: "Catégorie express",
    family: "RAPIDITE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 7,

    type: GAME_TYPES.RAPID,

    actor: ACTOR_MODES.RANDOM,
    target: TARGET_MODES.NONE,

    phone: false,

    contentPool: "CATEGORY",

    timer: 10,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G007 — ASSOCIATION
     ========================================================== */

  {
    id: "G007",
    name: "Association",
    family: "RAPIDITE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 7,

    type: GAME_TYPES.RAPID,

    actor: ACTOR_MODES.RANDOM,
    target: TARGET_MODES.NONE,

    phone: false,

    contentPool: "WORD",

    timer: 8,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G008 — MOT INTERDIT
     ========================================================== */

  {
    id: "G008",
    name: "Mot interdit",
    family: "SECRET",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "FORBIDDEN_WORD",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G009 — LE MOT SUIVANT
     ========================================================== */

  {
    id: "G009",
    name: "Le mot suivant",
    family: "RAPIDITE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 7,

    type: GAME_TYPES.RAPID,

    actor: ACTOR_MODES.RANDOM,
    target: TARGET_MODES.NONE,

    phone: false,

    contentPool: "WORD",

    timer: 8,

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G010 — PIÈGE À MOT
     ========================================================== */

  {
    id: "G010",
    name: "Piège à mot",
    family: "SECRET",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 9,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "TRAP_WORD",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G011 — DEUX VÉRITÉS, UN MENSONGE
     ========================================================== */

  {
    id: "G011",
    name: "Deux vérités, un mensonge",
    family: "BLUFF",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 10,

    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "STATEMENTS",

    voteMode: VOTE_MODES.SECRET,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G012 — BLUFF TOTAL
     ========================================================== */

  {
    id: "G012",
    name: "Bluff total",
    family: "BLUFF",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 10,

    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "BLUFF",

    voteMode: VOTE_MODES.SECRET,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G013 — QUI MENT ?
     ========================================================== */

  {
    id: "G013",
    name: "Qui ment ?",
    family: "BLUFF",

    minPlayers: 4,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 10,

    type: GAME_TYPES.BLUFF,

    actor: ACTOR_MODES.SELECTED,
    target: TARGET_MODES.TWO,

    phone: false,

    contentPool: "BLUFF",

    voteMode: VOTE_MODES.SECRET,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.VOTE,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G014 — LE PIÈGE
     ========================================================== */

  {
    id: "G014",
    name: "Le piège",
    family: "SECRET",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 10,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "TRAP_PROMPT",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G015 — MISSION SECRÈTE
     ========================================================== */

  {
    id: "G015",
    name: "Mission secrète",
    family: "SECRET",

    minPlayers: 4,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 12,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "MISSION",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    autoTarget: true,

    persistentMission: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION
    ]
  },


  /* ==========================================================
     G016 — DEVINE MON MOT
     ========================================================== */

  {
    id: "G016",
    name: "Devine mon mot",
    family: "DEVINETTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 9,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "GUESS_WORD",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G017 — DESCRIPTION IMPOSSIBLE
     ========================================================== */

  {
    id: "G017",
    name: "Description impossible",
    family: "DEVINETTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 9,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "DESCRIPTION",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G018 — MIME EXPRESS
     ========================================================== */

  {
    id: "G018",
    name: "Mime express",
    family: "DEVINETTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "MIME",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G019 — L'EXPRESSION
     ========================================================== */

  {
    id: "G019",
    name: "L'expression",
    family: "DEVINETTE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 9,

    type: GAME_TYPES.SECRET,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: true,

    contentPool: "EXPRESSION",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.PASS_SECRET,
      FLOW_PHASES.SECRET_ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  },


  /* ==========================================================
     G020 — QUESTION CHAUDE
     ========================================================== */

  {
    id: "G020",
    name: "Question chaude",
    family: "PERSONNEL",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.INDIVIDUAL,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "HOT",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION
    ]
  },


  /* ==========================================================
     G021 — CHOIX IMPOSSIBLE
     ========================================================== */

  {
    id: "G021",
    name: "Choix impossible",
    family: "CHOIX",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 1,
    cooldown: 7,

    type: GAME_TYPES.GROUP,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ALL,

    phone: false,

    contentPool: "CHOICE",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G022 — VÉRITÉ DE GROUPE
     ========================================================== */

  {
    id: "G022",
    name: "Vérité de groupe",
    family: "GROUPE",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.GROUP,

    actor: ACTOR_MODES.NONE,
    target: TARGET_MODES.ALL,

    phone: false,

    contentPool: "GROUP_TRUTH",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.NONE,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G023 — MISSION IMPROVISÉE
     ========================================================== */

  {
    id: "G023",
    name: "Mission improvisée",
    family: "IMPRO",

    minPlayers: 3,
    maxPlayers: 12,

    intensity: 2,
    cooldown: 8,

    type: GAME_TYPES.INDIVIDUAL,

    actor: ACTOR_MODES.TARGET,
    target: TARGET_MODES.ONE,

    phone: false,

    contentPool: "IMPRO",

    voteMode: VOTE_MODES.NONE,
    penalty: PENALTIES.LOSER,

    autoTarget: true,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  }

];


/* ============================================================
   OUTILS
   ============================================================ */

function getGameById(id) {
  return GAMES.find(game => game.id === id) || null;
}


function getGamesForPlayerCount(playerCount) {
  return GAMES.filter(game =>
    playerCount >= game.minPlayers &&
    playerCount <= game.maxPlayers
  );
}


/* ============================================================
   VALIDATION DU CATALOGUE
   ============================================================ */

function validateGames() {

  const errors = [];

  if (!Array.isArray(GAMES)) {
    errors.push("GAMES doit être un tableau.");
    return errors;
  }

  const ids = new Set();

  GAMES.forEach(game => {

    if (!game.id) {
      errors.push("Jeu sans ID.");
    }

    if (ids.has(game.id)) {
      errors.push(`ID dupliqué : ${game.id}`);
    }

    ids.add(game.id);

    if (!game.name) {
      errors.push(`${game.id} : nom manquant.`);
    }

    if (!game.type) {
      errors.push(`${game.id} : type manquant.`);
    }

    if (!game.contentPool) {
      errors.push(`${game.id} : contentPool manquant.`);
    }

    if (!Array.isArray(game.flow) || !game.flow.length) {
      errors.push(`${game.id} : flow manquant.`);
    }

    /* Aucun écran technique ne doit apparaître dans le nouveau système. */

    if (game.flow?.includes(FLOW_PHASES.INTRO)) {
      errors.push(`${game.id} : INTRO interdit dans BUILD 08.7.`);
    }

    if (game.flow?.includes(FLOW_PHASES.PENALTY)) {
      errors.push(`${game.id} : PENALTY interdit dans BUILD 08.7.`);
    }

    /* Les jeux secrets doivent toujours passer par le système privé. */

    if (game.type === GAME_TYPES.SECRET) {

      if (!game.phone) {
        errors.push(`${game.id} : jeu SECRET sans téléphone.`);
      }

      if (!game.flow.includes(FLOW_PHASES.PASS_SECRET)) {
        errors.push(`${game.id} : PASS_SECRET manquant.`);
      }

      if (!game.flow.includes(FLOW_PHASES.SECRET_ACTION)) {
        errors.push(`${game.id} : SECRET_ACTION manquant.`);
      }
    }

    /* Un vote nécessite une vraie phase de vote. */

    if (
      game.voteMode !== VOTE_MODES.NONE &&
      !game.flow.includes(FLOW_PHASES.VOTE)
    ) {
      errors.push(`${game.id} : voteMode actif sans phase VOTE.`);
    }

    /* Un GROUP_VOTE doit obligatoirement terminer par RESOLVE. */

    if (game.type === GAME_TYPES.GROUP_VOTE) {

      if (!game.flow.includes(FLOW_PHASES.VOTE)) {
        errors.push(`${game.id} : GROUP_VOTE sans VOTE.`);
      }

      if (!game.flow.includes(FLOW_PHASES.RESOLVE)) {
        errors.push(`${game.id} : GROUP_VOTE sans RESOLVE.`);
      }
    }

    /* Les jeux à réussite doivent avoir une vérification. */

    if (
      game.penalty !== PENALTIES.NONE &&
      !game.flow.includes(FLOW_PHASES.SUCCESS_CHECK) &&
      game.voteMode === VOTE_MODES.NONE &&
      game.type !== GAME_TYPES.GROUP
    ) {
      errors.push(
        `${game.id} : pénalité sans SUCCESS_CHECK ni VOTE.`
      );
    }

  });

  return errors;
}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

const GAME_VALIDATION_ERRORS = validateGames();

if (GAME_VALIDATION_ERRORS.length) {

  console.error(
    "SOIRÉE — ERREURS GAME DATABASE",
    GAME_VALIDATION_ERRORS
  );

} else {

  console.log(
    `SOIRÉE — GAME DATABASE BUILD 08.7 OK (${GAMES.length} jeux)`
  );

}
