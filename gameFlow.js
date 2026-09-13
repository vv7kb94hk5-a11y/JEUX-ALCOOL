/* ============================================================
   SOIRÉE — GAME FLOW ENGINE
   BUILD 04.0

   Architecture :
   GAME → PHASES → ROLES → SCREENS → ACTIONS

   Ce fichier ne dessine pas l'interface.
   Il contrôle uniquement le déroulement d'une partie.
   ============================================================ */


/* ============================================================
   FLOW STATE
   ============================================================ */

const GAME_FLOW = {

  currentGame: null,

  currentPhaseIndex: 0,

  currentPhase: null,

  currentActor: null,

  currentTarget: null,

  currentNarrator: null,

  currentPlayers: [],

  currentPrivateContent: null,

  currentPublicContent: null,

  history: [],

  startedAt: null,

  finishedAt: null

};


/* ============================================================
   PHASES DISPONIBLES
   ============================================================ */

const GAME_PHASES = {

  INTRO: {
    id: "INTRO",
    label: "Présentation",
    type: "PUBLIC"
  },

  SETUP: {
    id: "SETUP",
    label: "Préparation",
    type: "PUBLIC"
  },

  SELECT_ROLES: {
    id: "SELECT_ROLES",
    label: "Rôles",
    type: "PUBLIC"
  },

  SELECT_TARGET: {
    id: "SELECT_TARGET",
    label: "Choix de la cible",
    type: "PUBLIC"
  },

  SELECT_PLAYERS: {
    id: "SELECT_PLAYERS",
    label: "Choix des joueurs",
    type: "PUBLIC"
  },

  PASS_PHONE: {
    id: "PASS_PHONE",
    label: "Passage du téléphone",
    type: "PRIVATE_TRANSITION"
  },

  PRIVATE_REVEAL: {
    id: "PRIVATE_REVEAL",
    label: "Information secrète",
    type: "PRIVATE"
  },

  RETURN_PHONE: {
    id: "RETURN_PHONE",
    label: "Retour du téléphone",
    type: "PRIVATE_TRANSITION"
  },

  PLAY: {
    id: "PLAY",
    label: "À vous de jouer",
    type: "PUBLIC"
  },

  VOTE: {
    id: "VOTE",
    label: "Vote",
    type: "PUBLIC"
  },

  CHOICE: {
    id: "CHOICE",
    label: "Choix",
    type: "PUBLIC"
  },

  RESULT: {
    id: "RESULT",
    label: "Résultat",
    type: "PUBLIC"
  },

  PENALTY: {
    id: "PENALTY",
    label: "Pénalité",
    type: "PUBLIC"
  },

  NEXT: {
    id: "NEXT",
    label: "Tour suivant",
    type: "PUBLIC"
  }

};


/* ============================================================
   INITIALISATION
   ============================================================ */

function startGameFlow(game, players) {

  if (!game) {
    console.error("GAME FLOW : jeu introuvable.");
    return false;
  }

  if (!Array.isArray(players) || players.length < game.minPlayers) {
    console.error("GAME FLOW : nombre de joueurs insuffisant.");
    return false;
  }

  GAME_FLOW.currentGame = game;

  GAME_FLOW.currentPlayers = [...players];

  GAME_FLOW.currentPhaseIndex = 0;

  GAME_FLOW.currentPhase =
    game.phases && game.phases.length
      ? game.phases[0]
      : "INTRO";

  GAME_FLOW.currentActor = null;
  GAME_FLOW.currentTarget = null;
  GAME_FLOW.currentNarrator = null;

  GAME_FLOW.currentPrivateContent = null;
  GAME_FLOW.currentPublicContent = null;

  GAME_FLOW.history = [];

  GAME_FLOW.startedAt = Date.now();
  GAME_FLOW.finishedAt = null;

  GAME_FLOW.history.push({
    type: "GAME_START",
    gameId: game.id,
    timestamp: Date.now()
  });

  return true;
}


/* ============================================================
   PHASE ACTUELLE
   ============================================================ */

function getCurrentGamePhase() {

  if (!GAME_FLOW.currentPhase) {
    return null;
  }

  return GAME_PHASES[GAME_FLOW.currentPhase] || {
    id: GAME_FLOW.currentPhase,
    label: GAME_FLOW.currentPhase,
    type: "PUBLIC"
  };

}


/* ============================================================
   PHASE SUIVANTE
   ============================================================ */

function nextGamePhase() {

  const game = GAME_FLOW.currentGame;

  if (!game || !game.phases) {
    return null;
  }

  if (
    GAME_FLOW.currentPhaseIndex >=
    game.phases.length - 1
  ) {

    finishGameFlow();

    return null;
  }

  GAME_FLOW.currentPhaseIndex++;

  GAME_FLOW.currentPhase =
    game.phases[GAME_FLOW.currentPhaseIndex];

  GAME_FLOW.history.push({
    type: "PHASE_CHANGE",
    phase: GAME_FLOW.currentPhase,
    timestamp: Date.now()
  });

  return GAME_FLOW.currentPhase;

}


/* ============================================================
   PHASE PRÉCÉDENTE
   ============================================================ */

function previousGamePhase() {

  const game = GAME_FLOW.currentGame;

  if (!game || !game.phases) {
    return null;
  }

  if (GAME_FLOW.currentPhaseIndex <= 0) {
    return GAME_FLOW.currentPhase;
  }

  GAME_FLOW.currentPhaseIndex--;

  GAME_FLOW.currentPhase =
    game.phases[GAME_FLOW.currentPhaseIndex];

  return GAME_FLOW.currentPhase;

}


/* ============================================================
   CHANGER DIRECTEMENT DE PHASE
   ============================================================ */

function goToGamePhase(phaseId) {

  const game = GAME_FLOW.currentGame;

  if (!game || !game.phases) {
    return false;
  }

  const index = game.phases.indexOf(phaseId);

  if (index === -1) {
    console.error(
      "GAME FLOW : phase inexistante dans ce jeu :",
      phaseId
    );

    return false;
  }

  GAME_FLOW.currentPhaseIndex = index;

  GAME_FLOW.currentPhase = phaseId;

  GAME_FLOW.history.push({
    type: "PHASE_CHANGE",
    phase: phaseId,
    timestamp: Date.now()
  });

  return true;

}


/* ============================================================
   JOUEUR / CIBLE
   ============================================================ */

function setCurrentActor(player) {

  GAME_FLOW.currentActor = player || null;

  GAME_FLOW.history.push({
    type: "ACTOR_SELECTED",
    player: player || null,
    timestamp: Date.now()
  });

}


function setCurrentTarget(player) {

  GAME_FLOW.currentTarget = player || null;

  GAME_FLOW.history.push({
    type: "TARGET_SELECTED",
    player: player || null,
    timestamp: Date.now()
  });

}


function setCurrentNarrator(player) {

  GAME_FLOW.currentNarrator = player || null;

  GAME_FLOW.history.push({
    type: "NARRATOR_SELECTED",
    player: player || null,
    timestamp: Date.now()
  });

}


function setCurrentPlayers(players) {

  GAME_FLOW.currentPlayers =
    Array.isArray(players)
      ? [...players]
      : [];

}


/* ============================================================
   CONTENU PUBLIC
   ============================================================ */

function setPublicContent(content) {

  GAME_FLOW.currentPublicContent =
    content || null;

}


/* ============================================================
   CONTENU PRIVÉ
   ============================================================ */

function setPrivateContent(content) {

  GAME_FLOW.currentPrivateContent =
    content || null;

}


/* ============================================================
   SÉCURITÉ DU CONTENU PRIVÉ
   ============================================================ */

function clearPrivateContent() {

  GAME_FLOW.currentPrivateContent = null;

}


/* ============================================================
   TRANSITION TÉLÉPHONE
   ============================================================ */

function getPhoneInstruction() {

  const game = GAME_FLOW.currentGame;

  if (!game || !game.phone) {
    return null;
  }

  const mode = game.phone.mode;

  if (mode === "PASS_TO_TARGET") {

    return {
      mode,
      title: "DONNE LE TÉLÉPHONE À LA CIBLE",
      target: GAME_FLOW.currentTarget
    };

  }

  if (mode === "PASS_TO_PLAYER") {

    return {
      mode,
      title: "DONNE LE TÉLÉPHONE AU JOUEUR",
      target: GAME_FLOW.currentActor
    };

  }

  if (mode === "PASS_TO_PAIR") {

    return {
      mode,
      title: "DONNE LE TÉLÉPHONE AU DUO",
      target: GAME_FLOW.currentPlayers
    };

  }

  return {
    mode: "NONE",
    title: null,
    target: null
  };

}


/* ============================================================
   VÉRIFICATION PHASE PRIVÉE
   ============================================================ */

function isPrivatePhase() {

  const phase = getCurrentGamePhase();

  return phase &&
    (
      phase.type === "PRIVATE" ||
      phase.type === "PRIVATE_TRANSITION"
    );

}


/* ============================================================
   VÉRIFICATION CONTENU PRIVÉ
   ============================================================ */

function hasPrivateContent() {

  return GAME_FLOW.currentPrivateContent !== null;

}


/* ============================================================
   FIN D'UNE PHASE PRIVÉE
   ============================================================ */

function leavePrivatePhase() {

  clearPrivateContent();

  return true;

}


/* ============================================================
   RETOUR AU PUBLIC
   ============================================================ */

function returnToPublic() {

  clearPrivateContent();

  const phase = getCurrentGamePhase();

  if (phase && phase.type === "PRIVATE") {
    return false;
  }

  return true;

}


/* ============================================================
   TERMINER LE JEU
   ============================================================ */

function finishGameFlow() {

  GAME_FLOW.finishedAt = Date.now();

  clearPrivateContent();

  GAME_FLOW.history.push({
    type: "GAME_END",
    gameId:
      GAME_FLOW.currentGame
        ? GAME_FLOW.currentGame.id
        : null,
    timestamp: Date.now()
  });

}


/* ============================================================
   ÉTAT COMPLET DU FLOW
   ============================================================ */

function getGameFlowState() {

  return {

    game: GAME_FLOW.currentGame,

    phase: GAME_FLOW.currentPhase,

    phaseIndex: GAME_FLOW.currentPhaseIndex,

    actor: GAME_FLOW.currentActor,

    target: GAME_FLOW.currentTarget,

    narrator: GAME_FLOW.currentNarrator,

    players: [...GAME_FLOW.currentPlayers],

    publicContent: GAME_FLOW.currentPublicContent,

    privateContent: GAME_FLOW.currentPrivateContent,

    phone: getPhoneInstruction(),

    isPrivate: isPrivatePhase(),

    startedAt: GAME_FLOW.startedAt,

    finishedAt: GAME_FLOW.finishedAt

  };

}


/* ============================================================
   RESET COMPLET
   ============================================================ */

function resetGameFlow() {

  GAME_FLOW.currentGame = null;

  GAME_FLOW.currentPhaseIndex = 0;

  GAME_FLOW.currentPhase = null;

  GAME_FLOW.currentActor = null;

  GAME_FLOW.currentTarget = null;

  GAME_FLOW.currentNarrator = null;

  GAME_FLOW.currentPlayers = [];

  GAME_FLOW.currentPrivateContent = null;

  GAME_FLOW.currentPublicContent = null;

  GAME_FLOW.history = [];

  GAME_FLOW.startedAt = null;

  GAME_FLOW.finishedAt = null;

}


/* ============================================================
   DEBUG
   ============================================================ */

function debugGameFlow() {

  console.log(
    "========== SOIRÉE GAME FLOW =========="
  );

  console.log(
    "Jeu :",
    GAME_FLOW.currentGame
      ? GAME_FLOW.currentGame.name
      : null
  );

  console.log(
    "Phase :",
    GAME_FLOW.currentPhase
  );

  console.log(
    "Acteur :",
    GAME_FLOW.currentActor
  );

  console.log(
    "Cible :",
    GAME_FLOW.currentTarget
  );

  console.log(
    "Narrateur :",
    GAME_FLOW.currentNarrator
  );

  console.log(
    "Privé :",
    GAME_FLOW.currentPrivateContent
  );

  console.log(
    "Public :",
    GAME_FLOW.currentPublicContent
  );

  console.log(
    "======================================"
  );

}
