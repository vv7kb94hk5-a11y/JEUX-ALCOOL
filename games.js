/* ============================================================
   SOIRÉE — GAMES DATABASE
   BUILD 08.7
   ============================================================

   RÈGLE DE FLOW
   ------------------------------------------------------------
   Jeu public simple :
   ACTION → VOTE/RESOLVE

   Jeu avec vote :
   ACTION → VOTE → RESOLVE

   Jeu secret :
   PASS_SECRET → SECRET_ACTION → SUCCESS_CHECK

   Mission secrète :
   PASS_SECRET → SECRET_ACTION

   Aucune phase technique :
   - INTRO
   - SELECT_TARGET
   - SELECT_PLAYERS
   - PENALTY
   - RETURN_PHONE
   - CONFIRMATION
   ============================================================ */

const GAME_DATABASE_VERSION = "08.7";


/* ============================================================
   RACCOURCIS
   ============================================================ */

const G = GAME_TYPES;
const A = ACTOR_MODES;
const T = TARGET_MODES;
const V = VOTE_MODES;
const P = PENALTIES;


/* ============================================================
   DATABASE
   ============================================================ */

const GAMES = [

  /* ==========================================================
     G001 — QUI POURRAIT ?
     ========================================================== */

  {
    id: "G001",
    title: "Qui pourrait ?",
    family: "VOTE",
    type: G.GROUP_VOTE,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ONE,

    phone: false,

    contentPool: "VOTE",

    voteMode: V.GROUP_CONFIRM,
    penalty: P.LOSER,

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
    title: "Majorité",
    family: "VOTE",
    type: G.GROUP_VOTE,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ONE,

    phone: false,

    contentPool: "MAJORITY",

    voteMode: V.GROUP_CONFIRM,
    penalty: P.LOSER,

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
    title: "Cible du groupe",
    family: "VOTE",
    type: G.GROUP_VOTE,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ONE,

    phone: false,

    contentPool: "TARGET",

    voteMode: V.GROUP_CONFIRM,
    penalty: P.LOSER,

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
    title: "Qui me connaît ?",
    family: "CONNAISSANCE",
    type: G.INDIVIDUAL,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: false,

    contentPool: "KNOWLEDGE",

    penalty: P.LOSER,

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
    title: "Le plus suspect",
    family: "SUSPECT",
    type: G.GROUP_VOTE,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ONE,

    phone: false,

    contentPool: "SUSPECT",

    voteMode: V.GROUP_CONFIRM,
    penalty: P.LOSER,

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
    title: "Catégorie express",
    family: "RAPID",
    type: G.RAPID,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.RANDOM,
    target: T.NONE,

    phone: false,

    contentPool: "CATEGORY",

    timer: 10,

    penalty: P.LOSER,

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
    title: "Association",
    family: "RAPID",
    type: G.RAPID,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.RANDOM,
    target: T.NONE,

    phone: false,

    contentPool: "WORD",

    timer: 10,

    penalty: P.LOSER,

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
    title: "Mot interdit",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "FORBIDDEN_WORD",

    penalty: P.LOSER,

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
    title: "Le mot suivant",
    family: "RAPID",
    type: G.RAPID,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.RANDOM,
    target: T.NONE,

    phone: false,

    contentPool: "WORD",

    timer: 10,

    penalty: P.LOSER,

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
    title: "Piège à mot",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "TRAP_WORD",

    penalty: P.LOSER,

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
    title: "Deux vérités, un mensonge",
    family: "BLUFF",
    type: G.BLUFF,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: false,

    contentPool: "STATEMENTS",

    voteMode: V.SECRET,
    penalty: P.LOSER,

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
    title: "Bluff total",
    family: "BLUFF",
    type: G.BLUFF,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: false,

    contentPool: "BLUFF",

    voteMode: V.SECRET,
    penalty: P.LOSER,

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
    title: "Qui ment ?",
    family: "BLUFF",
    type: G.BLUFF,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.SELECTED,
    target: T.TWO,

    phone: false,

    contentPool: "BLUFF",

    voteMode: V.SECRET,
    penalty: P.LOSER,

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
    title: "Le piège",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "TRAP_PROMPT",

    penalty: P.LOSER,

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
    title: "Mission secrète",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "MISSION",

    penalty: P.NONE,

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
    title: "Devine mon mot",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "GUESS_WORD",

    penalty: P.LOSER,

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
    title: "Description impossible",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "DESCRIPTION",

    penalty: P.LOSER,

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
    title: "Mime express",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "MIME",

    penalty: P.LOSER,

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
    title: "L'expression",
    family: "SECRET",
    type: G.SECRET,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: true,

    contentPool: "EXPRESSION",

    penalty: P.LOSER,

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
    title: "Question chaude",
    family: "HOT",
    type: G.INDIVIDUAL,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: false,

    contentPool: "HOT",

    penalty: P.NONE,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.RESOLVE
    ]
  },


  /* ==========================================================
     G021 — CHOIX IMPOSSIBLE
     ========================================================== */

  {
    id: "G021",
    title: "Choix impossible",
    family: "GROUPE",
    type: G.GROUP,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ALL,

    phone: false,

    contentPool: "CHOICE",

    penalty: P.NONE,

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
    title: "Vérité de groupe",
    family: "GROUPE",
    type: G.GROUP,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.NONE,
    target: T.ALL,

    phone: false,

    contentPool: "GROUP_TRUTH",

    penalty: P.NONE,

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
    title: "Mission improvisée",
    family: "IMPRO",
    type: G.INDIVIDUAL,

    minPlayers: 3,
    maxPlayers: 12,

    actor: A.TARGET,
    target: T.ONE,

    phone: false,

    contentPool: "IMPRO",

    penalty: P.LOSER,

    flow: [
      FLOW_PHASES.ACTION,
      FLOW_PHASES.SUCCESS_CHECK
    ]
  }

];


/* ============================================================
   LOOKUP
   ============================================================ */

function getGameById(id) {
  return GAMES.find(game => game.id === id) || null;
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateGames() {

  const errors = [];

  if (!Array.isArray(GAMES)) {
    errors.push("GAMES doit être un tableau.");
    return {
      valid: false,
      errors
    };
  }

  const ids = new Set();

  GAMES.forEach((game, index) => {

    if (!game.id) {
      errors.push(`Jeu ${index + 1} : ID manquant.`);
    }

    if (game.id && ids.has(game.id)) {
      errors.push(`ID dupliqué : ${game.id}`);
    }

    if (game.id) {
      ids.add(game.id);
    }

    if (!game.title) {
      errors.push(`${game.id || "Jeu inconnu"} : titre manquant.`);
    }

    if (!game.type) {
      errors.push(`${game.id || "Jeu inconnu"} : type manquant.`);
    }

    if (!Array.isArray(game.flow)) {
      errors.push(`${game.id || "Jeu inconnu"} : flow invalide.`);
      return;
    }

    /*
     * Les anciennes phases ne doivent plus exister.
     */

    const forbiddenPhases = [
      FLOW_PHASES.INTRO,
      FLOW_PHASES.SELECT_TARGET,
      FLOW_PHASES.SELECT_PLAYERS,
      FLOW_PHASES.PENALTY
    ];

    game.flow.forEach(phase => {
      if (forbiddenPhases.includes(phase)) {
        errors.push(
          `${game.id} : ancienne phase interdite détectée (${phase}).`
        );
      }
    });

    /*
     * Les jeux avec téléphone doivent avoir
     * PASS_SECRET + SECRET_ACTION.
     */

    if (game.phone) {

      if (!game.flow.includes(FLOW_PHASES.PASS_SECRET)) {
        errors.push(
          `${game.id} : jeu téléphone sans PASS_SECRET.`
        );
      }

      if (!game.flow.includes(FLOW_PHASES.SECRET_ACTION)) {
        errors.push(
          `${game.id} : jeu téléphone sans SECRET_ACTION.`
        );
      }
    }

    /*
     * Un jeu de vote doit contenir VOTE.
     */

    if (
      game.voteMode &&
      game.voteMode !== VOTE_MODES.NONE &&
      !game.flow.includes(FLOW_PHASES.VOTE)
    ) {
      errors.push(
        `${game.id} : voteMode défini mais phase VOTE absente.`
      );
    }

  });

  return {
    valid: errors.length === 0,
    errors
  };
}


/* ============================================================
   COMPATIBILITÉ AVEC L'ANCIEN SYSTÈME
   ============================================================ */

function validateGamesDatabase() {
  return validateGames();
}


/* ============================================================
   DEBUG
   ============================================================ */

if (typeof window !== "undefined") {

  window.GAMES = GAMES;
  window.GAME_DATABASE_VERSION = GAME_DATABASE_VERSION;
  window.getGameById = getGameById;
  window.validateGames = validateGames;
  window.validateGamesDatabase = validateGamesDatabase;

}
