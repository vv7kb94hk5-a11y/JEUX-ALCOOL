/* ============================================================
   SOIRÉE — GAME FLOW ENGINE
   BUILD 08.2
   ============================================================ */

/*
  OBJECTIF
  ---------
  Moteur de flux centralisé.

  Le moteur ne décide PAS des règles des jeux.
  Il gère uniquement :
  - la phase actuelle
  - les joueurs
  - les rôles
  - les secrets
  - les votes
  - le gagnant / perdant
  - les transitions
*/

/* ============================================================
   CONSTANTES
   ============================================================ */

const GAME_TYPES = {
  INDIVIDUAL: "INDIVIDUAL",
  GROUP_VOTE: "GROUP_VOTE",
  SECRET_VOTE: "SECRET_VOTE",
  SECRET: "SECRET",
  RAPID: "RAPID",
  BLUFF: "BLUFF",
  GROUP: "GROUP"
};

const ACTOR_MODES = {
  NONE: "NONE",
  RANDOM: "RANDOM",
  SELECTED: "SELECTED",
  TARGET: "TARGET"
};

const TARGET_MODES = {
  NONE: "NONE",
  ONE: "ONE",
  TWO: "TWO",
  ALL: "ALL"
};

const VOTE_MODES = {
  NONE: "NONE",
  GROUP_CONFIRM: "GROUP_CONFIRM",
  SECRET: "SECRET"
};

const PENALTIES = {
  NONE: "NONE",
  LOSER: "LOSER",
  WINNER: "WINNER",
  TARGET: "TARGET"
};

const FLOW_PHASES = {
  INTRO: "INTRO",
  ASSIGN: "ASSIGN",
  SELECT_TARGET: "SELECT_TARGET",
  SELECT_PLAYERS: "SELECT_PLAYERS",
  PASS_PHONE: "PASS_PHONE",
  SECRET_REVEAL: "SECRET_REVEAL",
  RETURN_PHONE: "RETURN_PHONE",
  PLAY: "PLAY",
  VOTE: "VOTE",
  RESOLVE: "RESOLVE",
  PENALTY: "PENALTY",
  NEXT: "NEXT"
};


/* ============================================================
   ÉTAT GLOBAL DU MOTEUR
   ============================================================ */

const GAME_FLOW = {

  currentGame: null,

  phase: null,

  phaseIndex: 0,

  actor: null,

  target: null,

  participants: [],

  voters: [],

  secretOwner: null,

  secretContent: null,

  winner: null,

  loser: null,

  votes: [],

  result: null,

  startedAt: null,

  phaseStartedAt: null,

  history: []
};


/* ============================================================
   UTILITAIRES
   ============================================================ */

function resetGameFlow() {

  GAME_FLOW.currentGame = null;
  GAME_FLOW.phase = null;
  GAME_FLOW.phaseIndex = 0;

  GAME_FLOW.actor = null;
  GAME_FLOW.target = null;

  GAME_FLOW.participants = [];
  GAME_FLOW.voters = [];

  GAME_FLOW.secretOwner = null;
  GAME_FLOW.secretContent = null;

  GAME_FLOW.winner = null;
  GAME_FLOW.loser = null;

  GAME_FLOW.votes = [];
  GAME_FLOW.result = null;

  GAME_FLOW.startedAt = null;
  GAME_FLOW.phaseStartedAt = null;

  GAME_FLOW.history = [];
}


function startGameFlow(game) {

  resetGameFlow();

  GAME_FLOW.currentGame = game;

  GAME_FLOW.startedAt = Date.now();

  if (!game || !Array.isArray(game.flow) || game.flow.length === 0) {
    GAME_FLOW.phase = null;
    return null;
  }

  GAME_FLOW.phaseIndex = 0;
  GAME_FLOW.phase = game.flow[0];

  GAME_FLOW.phaseStartedAt = Date.now();

  return GAME_FLOW.phase;
}


function getCurrentGamePhase() {

  return GAME_FLOW.phase;
}


function getGameFlowIndex() {

  return GAME_FLOW.phaseIndex;
}


function getGameFlow() {

  return GAME_FLOW;
}


/* ============================================================
   TRANSITIONS
   ============================================================ */

function nextGamePhase() {

  if (!GAME_FLOW.currentGame) {
    return null;
  }

  const flow = GAME_FLOW.currentGame.flow || [];

  const nextIndex = GAME_FLOW.phaseIndex + 1;

  if (nextIndex >= flow.length) {

    GAME_FLOW.phase = null;

    return null;
  }

  GAME_FLOW.phaseIndex = nextIndex;

  GAME_FLOW.phase = flow[nextIndex];

  GAME_FLOW.phaseStartedAt = Date.now();

  return GAME_FLOW.phase;
}


function goToGamePhase(phase) {

  if (!GAME_FLOW.currentGame) {
    return false;
  }

  const flow = GAME_FLOW.currentGame.flow || [];

  const index = flow.indexOf(phase);

  if (index === -1) {
    return false;
  }

  GAME_FLOW.phaseIndex = index;
  GAME_FLOW.phase = phase;
  GAME_FLOW.phaseStartedAt = Date.now();

  return true;
}


function hasGamePhase(phase) {

  if (!GAME_FLOW.currentGame) {
    return false;
  }

  return Array.isArray(GAME_FLOW.currentGame.flow)
    && GAME_FLOW.currentGame.flow.includes(phase);
}


/* ============================================================
   RÔLES
   ============================================================ */

function setGameActor(player) {

  GAME_FLOW.actor = player || null;

  return GAME_FLOW.actor;
}


function setGameTarget(player) {

  GAME_FLOW.target = player || null;

  return GAME_FLOW.target;
}


function setParticipants(players) {

  GAME_FLOW.participants = Array.isArray(players)
    ? [...players]
    : [];

  return GAME_FLOW.participants;
}


function setVoters(players) {

  GAME_FLOW.voters = Array.isArray(players)
    ? [...players]
    : [];

  return GAME_FLOW.voters;
}


function setSecretOwner(player) {

  GAME_FLOW.secretOwner = player || null;

  return GAME_FLOW.secretOwner;
}


function setSecretContent(content) {

  GAME_FLOW.secretContent = content ?? null;

  return GAME_FLOW.secretContent;
}


/* ============================================================
   RÉSULTAT
   ============================================================ */

function setGameWinner(player) {

  GAME_FLOW.winner = player || null;

  return GAME_FLOW.winner;
}


function setGameLoser(player) {

  GAME_FLOW.loser = player || null;

  return GAME_FLOW.loser;
}


function setGameResult(result) {

  GAME_FLOW.result = result ?? null;

  return GAME_FLOW.result;
}


/* ============================================================
   VOTES
   ============================================================ */

function resetGameVotes() {

  GAME_FLOW.votes = [];

  return GAME_FLOW.votes;
}


function addGameVote(voter, choice) {

  if (!voter || !choice) {
    return false;
  }

  GAME_FLOW.votes.push({
    voter,
    choice,
    timestamp: Date.now()
  });

  return true;
}


function getGameVotes() {

  return [...GAME_FLOW.votes];
}


function getVoteCount() {

  return GAME_FLOW.votes.length;
}


function hasVoted(player) {

  return GAME_FLOW.votes.some(
    vote => vote.voter === player
  );
}


/* ============================================================
   COMPTAGE DES VOTES
   ============================================================ */

function countGameVotes() {

  const counts = {};

  GAME_FLOW.votes.forEach(vote => {

    const choice = vote.choice;

    if (!counts[choice]) {
      counts[choice] = 0;
    }

    counts[choice]++;
  });

  return counts;
}


function getVoteWinner() {

  const counts = countGameVotes();

  const entries = Object.entries(counts);

  if (!entries.length) {
    return null;
  }

  entries.sort((a, b) => b[1] - a[1]);

  return {
    player: entries[0][0],
    votes: entries[0][1]
  };
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function resolveGame() {

  const game = GAME_FLOW.currentGame;

  if (!game) {
    return null;
  }

  /*
    VOTE COLLECTIF
    --------------
    Le résultat vient réellement du vote.
  */

  if (
    game.voteMode === VOTE_MODES.GROUP_CONFIRM ||
    game.voteMode === VOTE_MODES.SECRET
  ) {

    const winner = getVoteWinner();

    if (winner) {

      setGameWinner(winner.player);

      /*
        Dans un jeu de type "Qui pourrait ?",
        la personne la plus votée est généralement
        la cible / perdante.
      */

      setGameLoser(winner.player);

      setGameResult({
        type: "VOTE",
        winner: winner.player,
        votes: winner.votes,
        counts: countGameVotes()
      });

      return GAME_FLOW.result;
    }
  }

  /*
    Si le jeu possède déjà une cible explicite,
    elle peut devenir le résultat.
  */

  if (GAME_FLOW.target) {

    setGameLoser(GAME_FLOW.target);

    setGameResult({
      type: "TARGET",
      target: GAME_FLOW.target
    });

    return GAME_FLOW.result;
  }

  /*
    Aucun résultat automatique.
  */

  setGameResult({
    type: "NONE"
  });

  return GAME_FLOW.result;
}


/* ============================================================
   VALIDATION D'UN JEU
   ============================================================ */

function validateGameDefinition(game) {

  const errors = [];

  if (!game) {
    errors.push("Jeu inexistant.");
    return errors;
  }

  if (!game.id) {
    errors.push("ID manquant.");
  }

  if (!game.name) {
    errors.push("Nom manquant.");
  }

  if (!game.type) {
    errors.push("Type de jeu manquant.");
  }

  if (!Array.isArray(game.flow) || !game.flow.length) {
    errors.push("Flow manquant.");
  }

  /*
    TARGET NONE
    */

  if (
    game.target === TARGET_MODES.NONE &&
    game.flow?.includes(FLOW_PHASES.SELECT_TARGET)
  ) {
    errors.push(
      "Le jeu demande une cible alors que target = NONE."
    );
  }

  /*
    VOTE
    */

  if (
    game.flow?.includes(FLOW_PHASES.VOTE) &&
    game.voteMode === VOTE_MODES.NONE
  ) {
    errors.push(
      "Phase VOTE présente sans système de vote."
    );
  }

  /*
    SECRET
    */

  if (game.phone === true) {

    if (
      !game.flow?.includes(FLOW_PHASES.SECRET_REVEAL)
    ) {
      errors.push(
        "Jeu avec téléphone mais sans SECRET_REVEAL."
      );
    }

    if (
      !game.flow?.includes(FLOW_PHASES.PASS_PHONE)
    ) {
      errors.push(
        "Jeu avec téléphone mais sans PASS_PHONE."
      );
    }
  }

  /*
    PÉNALITÉ
    */

  if (
    game.penalty &&
    game.penalty !== PENALTIES.NONE &&
    game.penalty !== PENALTIES.WINNER &&
    game.penalty !== PENALTIES.LOSER &&
    game.penalty !== PENALTIES.TARGET
  ) {
    errors.push("Type de pénalité invalide.");
  }

  /*
    SECRET_OWNER
    */

  if (
    game.type === GAME_TYPES.SECRET &&
    game.target === TARGET_MODES.NONE
  ) {
    errors.push(
      "Un jeu SECRET doit définir son propriétaire du secret."
    );
  }

  return errors;
}


/* ============================================================
   VALIDATION DE TOUS LES JEUX
   ============================================================ */

function validateAllGames(games) {

  if (!Array.isArray(games)) {
    return [{
      game: null,
      errors: ["Liste des jeux invalide."]
    }];
  }

  return games
    .map(game => ({
      game: game.id || game.name,
      errors: validateGameDefinition(game)
    }))
    .filter(item => item.errors.length > 0);
}


/* ============================================================
   PHASE PRIVÉE
   ============================================================ */

function isPrivatePhase(phase = GAME_FLOW.phase) {

  return (
    phase === FLOW_PHASES.PASS_PHONE ||
    phase === FLOW_PHASES.SECRET_REVEAL ||
    phase === FLOW_PHASES.RETURN_PHONE
  );
}


/* ============================================================
   RESET APRÈS LE TOUR
   ============================================================ */

function clearGameResult() {

  GAME_FLOW.winner = null;
  GAME_FLOW.loser = null;
  GAME_FLOW.result = null;
}


function clearGameRoles() {

  GAME_FLOW.actor = null;
  GAME_FLOW.target = null;
  GAME_FLOW.participants = [];
  GAME_FLOW.voters = [];
  GAME_FLOW.secretOwner = null;
  GAME_FLOW.secretContent = null;
}


/* ============================================================
   DEBUG
   ============================================================ */

function debugGameFlow() {

  return {
    game: GAME_FLOW.currentGame?.id || null,
    phase: GAME_FLOW.phase,
    phaseIndex: GAME_FLOW.phaseIndex,
    actor: GAME_FLOW.actor,
    target: GAME_FLOW.target,
    participants: GAME_FLOW.participants,
    secretOwner: GAME_FLOW.secretOwner,
    winner: GAME_FLOW.winner,
    loser: GAME_FLOW.loser,
    votes: GAME_FLOW.votes,
    result: GAME_FLOW.result
  };
}
