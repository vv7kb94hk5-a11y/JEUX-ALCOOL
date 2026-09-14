/* ============================================================
   SOIRÉE — GAME FLOW ENGINE
   BUILD 08.0

   Nouveau moteur :
   - un écran = une action
   - aucune phase automatique incohérente
   - aucun secret dans une phase publique
   - le vote est une vraie étape
   - la cible peut être choisie par le groupe
   - le téléphone n'apparaît que lorsqu'il est nécessaire

   Le moteur ne décide PAS des règles d'un jeu.
   Les règles sont définies dans games.js.

   Le moteur exécute simplement le flow déclaré par le jeu.
   ============================================================ */


/* ============================================================
   PHASES AUTORISÉES
   ============================================================ */

const FLOW_PHASES = {

  PROMPT: "PROMPT",

  SELECT_TARGET: "SELECT_TARGET",

  SELECT_PLAYERS: "SELECT_PLAYERS",

  PRIVATE_REVEAL: "PRIVATE_REVEAL",

  PLAY: "PLAY",

  ROTATION: "ROTATION",

  GROUP: "GROUP",

  GROUP_VOTE: "GROUP_VOTE",

  SECRET_VOTE: "SECRET_VOTE",

  RESOLVE: "RESOLVE",

  PENALTY: "PENALTY"
};


/* ============================================================
   VISIBILITÉ DES PHASES
   ============================================================ */

const PRIVATE_PHASES = new Set([
  FLOW_PHASES.PRIVATE_REVEAL,
  FLOW_PHASES.SECRET_VOTE
]);


/* ============================================================
   FLOW D'UNE PARTIE
   ============================================================ */

const GAME_FLOW = {

  game: null,

  phaseIndex: 0,

  phase: null,

  actor: null,

  targets: [],

  participants: [],

  secretOwner: null,

  content: null,

  publicContent: null,

  privateContent: null,

  votes: {},

  selectedPlayers: [],

  winner: null,

  loser: null,

  resolved: false,

  startedAt: null,

  phaseStartedAt: null
};


/* ============================================================
   RESET
   ============================================================ */

function resetGameFlow() {

  GAME_FLOW.game = null;

  GAME_FLOW.phaseIndex = 0;

  GAME_FLOW.phase = null;

  GAME_FLOW.actor = null;

  GAME_FLOW.targets = [];

  GAME_FLOW.participants = [];

  GAME_FLOW.secretOwner = null;

  GAME_FLOW.content = null;

  GAME_FLOW.publicContent = null;

  GAME_FLOW.privateContent = null;

  GAME_FLOW.votes = {};

  GAME_FLOW.selectedPlayers = [];

  GAME_FLOW.winner = null;

  GAME_FLOW.loser = null;

  GAME_FLOW.resolved = false;

  GAME_FLOW.startedAt = null;

  GAME_FLOW.phaseStartedAt = null;
}


/* ============================================================
   DÉMARRER UN JEU
   ============================================================ */

function startGameFlow(game, data = {}) {

  resetGameFlow();

  if (!game) {
    console.error("GAME FLOW : jeu manquant");
    return false;
  }

  if (!Array.isArray(game.flow) || game.flow.length === 0) {
    console.error(
      `GAME FLOW : flow manquant pour ${game.id}`
    );

    return false;
  }

  GAME_FLOW.game = game;

  GAME_FLOW.actor = data.actor || null;

  GAME_FLOW.targets = Array.isArray(data.targets)
    ? [...data.targets]
    : [];

  GAME_FLOW.participants = Array.isArray(data.participants)
    ? [...data.participants]
    : [];

  GAME_FLOW.secretOwner =
    data.secretOwner || null;

  GAME_FLOW.content =
    data.content || null;

  GAME_FLOW.publicContent =
    data.publicContent || null;

  GAME_FLOW.privateContent =
    data.privateContent || null;

  GAME_FLOW.startedAt = Date.now();

  GAME_FLOW.phaseIndex = 0;

  GAME_FLOW.phase = game.flow[0];

  GAME_FLOW.phaseStartedAt = Date.now();

  return true;
}


/* ============================================================
   PHASE ACTUELLE
   ============================================================ */

function getCurrentGamePhase() {
  return GAME_FLOW.phase;
}


/* ============================================================
   INDEX DE PHASE
   ============================================================ */

function getCurrentGamePhaseIndex() {
  return GAME_FLOW.phaseIndex;
}


/* ============================================================
   FLOW COMPLET
   ============================================================ */

function getGameFlow() {

  if (!GAME_FLOW.game) {
    return [];
  }

  return [...GAME_FLOW.game.flow];
}


/* ============================================================
   PHASE PRIVÉE ?
   ============================================================ */

function isPrivatePhase(phase = GAME_FLOW.phase) {

  return PRIVATE_PHASES.has(phase);
}


/* ============================================================
   PHASE PUBLIQUE ?
   ============================================================ */

function isPublicPhase(phase = GAME_FLOW.phase) {

  return !isPrivatePhase(phase);
}


/* ============================================================
   PHASE SUIVANTE DISPONIBLE
   ============================================================ */

function getNextGamePhase() {

  if (!GAME_FLOW.game) {
    return null;
  }

  const nextIndex =
    GAME_FLOW.phaseIndex + 1;

  if (
    nextIndex >=
    GAME_FLOW.game.flow.length
  ) {
    return null;
  }

  return GAME_FLOW.game.flow[nextIndex];
}


/* ============================================================
   PHASE PRÉCÉDENTE
   ============================================================ */

function getPreviousGamePhase() {

  if (!GAME_FLOW.game) {
    return null;
  }

  const previousIndex =
    GAME_FLOW.phaseIndex - 1;

  if (previousIndex < 0) {
    return null;
  }

  return GAME_FLOW.game.flow[previousIndex];
}


/* ============================================================
   AVANCER D'UNE PHASE
   ============================================================ */

function nextGamePhase() {

  if (!GAME_FLOW.game) {
    return null;
  }

  const nextIndex =
    GAME_FLOW.phaseIndex + 1;

  /*
   * Fin du flow.
   */
  if (
    nextIndex >=
    GAME_FLOW.game.flow.length
  ) {

    GAME_FLOW.phase = null;

    return null;
  }

  GAME_FLOW.phaseIndex = nextIndex;

  GAME_FLOW.phase =
    GAME_FLOW.game.flow[nextIndex];

  GAME_FLOW.phaseStartedAt = Date.now();

  return GAME_FLOW.phase;
}


/* ============================================================
   ALLER À UNE PHASE PRÉCISE
   ============================================================ */

function goToGamePhase(phase) {

  if (!GAME_FLOW.game) {
    return false;
  }

  const index =
    GAME_FLOW.game.flow.indexOf(phase);

  if (index === -1) {
    console.error(
      `GAME FLOW : phase inexistante ${phase}`
    );

    return false;
  }

  GAME_FLOW.phaseIndex = index;

  GAME_FLOW.phase = phase;

  GAME_FLOW.phaseStartedAt = Date.now();

  return true;
}


/* ============================================================
   PHASE EXISTE ?
   ============================================================ */

function gameHasPhase(phase) {

  if (!GAME_FLOW.game) {
    return false;
  }

  return GAME_FLOW.game.flow.includes(phase);
}


/* ============================================================
   SET ACTEUR
   ============================================================ */

function setGameActor(player) {

  GAME_FLOW.actor = player || null;
}


/* ============================================================
   SET CIBLES
   ============================================================ */

function setGameTargets(players) {

  GAME_FLOW.targets =
    Array.isArray(players)
      ? [...players]
      : [];

}


/* ============================================================
   AJOUTER UNE CIBLE
   ============================================================ */

function addGameTarget(player) {

  if (!player) {
    return;
  }

  if (!GAME_FLOW.targets.includes(player)) {
    GAME_FLOW.targets.push(player);
  }
}


/* ============================================================
   SET PARTICIPANTS
   ============================================================ */

function setGameParticipants(players) {

  GAME_FLOW.participants =
    Array.isArray(players)
      ? [...players]
      : [];
}


/* ============================================================
   SET SECRET OWNER
   ============================================================ */

function setSecretOwner(player) {

  GAME_FLOW.secretOwner =
    player || null;
}


/* ============================================================
   SET CONTENU
   ============================================================ */

function setGameContent(content) {

  GAME_FLOW.content =
    content || null;
}


/* ============================================================
   CONTENU PUBLIC
   ============================================================ */

function setPublicContent(content) {

  GAME_FLOW.publicContent =
    content || null;
}


/* ============================================================
   CONTENU PRIVÉ
   ============================================================ */

function setPrivateContent(content) {

  GAME_FLOW.privateContent =
    content || null;
}


/* ============================================================
   VOTES
   ============================================================ */

function resetGameVotes() {

  GAME_FLOW.votes = {};
}


/* ============================================================
   ENREGISTRER UN VOTE
   ============================================================ */

function addGameVote(voter, candidate) {

  if (!voter || !candidate) {
    return false;
  }

  if (!GAME_FLOW.votes[voter]) {
    GAME_FLOW.votes[voter] = candidate;
  }

  return true;
}


/* ============================================================
   REMPLACER UN VOTE
   ============================================================ */

function setGameVote(voter, candidate) {

  if (!voter || !candidate) {
    return false;
  }

  GAME_FLOW.votes[voter] = candidate;

  return true;
}


/* ============================================================
   NOMBRE DE VOTES
   ============================================================ */

function getVoteCount(candidate) {

  if (!candidate) {
    return 0;
  }

  return Object.values(
    GAME_FLOW.votes
  ).filter(
    vote => vote === candidate
  ).length;
}


/* ============================================================
   RÉSULTATS DU VOTE
   ============================================================ */

function getVoteResults() {

  const counts = {};

  Object.values(
    GAME_FLOW.votes
  ).forEach(candidate => {

    if (!candidate) {
      return;
    }

    counts[candidate] =
      (counts[candidate] || 0) + 1;
  });

  return counts;
}


/* ============================================================
   GAGNANT DU VOTE
   ============================================================ */

function getVoteWinner() {

  const results =
    getVoteResults();

  const candidates =
    Object.keys(results);

  if (!candidates.length) {
    return null;
  }

  candidates.sort(
    (a, b) =>
      results[b] - results[a]
  );

  /*
   * Égalité :
   * on ne choisit PAS arbitrairement.
   * Le moteur renvoie null.
   */
  if (
    candidates.length > 1 &&
    results[candidates[0]] ===
    results[candidates[1]]
  ) {
    return null;
  }

  return candidates[0];
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function setGameWinner(player) {

  GAME_FLOW.winner =
    player || null;
}


function setGameLoser(player) {

  GAME_FLOW.loser =
    player || null;
}


function resolveGame({
  winner = null,
  loser = null,
  target = null
} = {}) {

  if (winner) {
    GAME_FLOW.winner = winner;
  }

  if (loser) {
    GAME_FLOW.loser = loser;
  }

  if (
    target &&
    !GAME_FLOW.targets.includes(target)
  ) {
    GAME_FLOW.targets.push(target);
  }

  GAME_FLOW.resolved = true;
}


/* ============================================================
   ÉTAT
   ============================================================ */

function getGameFlowState() {

  return {
    game: GAME_FLOW.game,

    phaseIndex:
      GAME_FLOW.phaseIndex,

    phase:
      GAME_FLOW.phase,

    actor:
      GAME_FLOW.actor,

    targets:
      [...GAME_FLOW.targets],

    participants:
      [...GAME_FLOW.participants],

    secretOwner:
      GAME_FLOW.secretOwner,

    content:
      GAME_FLOW.content,

    publicContent:
      GAME_FLOW.publicContent,

    privateContent:
      GAME_FLOW.privateContent,

    votes:
      { ...GAME_FLOW.votes },

    selectedPlayers:
      [...GAME_FLOW.selectedPlayers],

    winner:
      GAME_FLOW.winner,

    loser:
      GAME_FLOW.loser,

    resolved:
      GAME_FLOW.resolved,

    startedAt:
      GAME_FLOW.startedAt,

    phaseStartedAt:
      GAME_FLOW.phaseStartedAt
  };
}


/* ============================================================
   SÉLECTION DE JOUEURS
   ============================================================ */

function setSelectedPlayers(players) {

  GAME_FLOW.selectedPlayers =
    Array.isArray(players)
      ? [...players]
      : [];
}


function addSelectedPlayer(player) {

  if (!player) {
    return;
  }

  if (
    !GAME_FLOW.selectedPlayers.includes(player)
  ) {
    GAME_FLOW.selectedPlayers.push(player);
  }
}


/* ============================================================
   VALIDATION DU FLOW
   ============================================================ */

function validateGameFlow(game) {

  const errors = [];

  if (!game) {
    return {
      valid: false,
      errors: ["Jeu manquant"]
    };
  }

  if (!Array.isArray(game.flow)) {

    return {
      valid: false,
      errors: ["Flow manquant"]
    };
  }

  if (game.flow.length === 0) {

    return {
      valid: false,
      errors: ["Flow vide"]
    };
  }


  /*
   * Toutes les phases doivent être reconnues.
   */

  game.flow.forEach(phase => {

    if (
      !Object.values(FLOW_PHASES)
        .includes(phase)
    ) {
      errors.push(
        `Phase inconnue : ${phase}`
      );
    }

  });


  /*
   * Un jeu SECRET doit avoir
   * une révélation privée.
   */

  if (
    game.type === GAME_TYPES.SECRET &&
    !game.flow.includes(
      FLOW_PHASES.PRIVATE_REVEAL
    )
  ) {

    errors.push(
      "Jeu SECRET sans PRIVATE_REVEAL"
    );
  }


  /*
   * Un jeu avec téléphone doit
   * réellement avoir une phase privée.
   */

  if (
    game.phone === true &&
    !game.flow.includes(
      FLOW_PHASES.PRIVATE_REVEAL
    )
  ) {

    errors.push(
      "Téléphone déclaré mais aucune phase privée"
    );
  }


  /*
   * Un vote doit avoir sa phase.
   */

  if (
    game.vote === VOTE_MODES.GROUP &&
    !game.flow.includes(
      FLOW_PHASES.GROUP_VOTE
    )
  ) {

    errors.push(
      "Vote GROUP sans GROUP_VOTE"
    );
  }


  if (
    game.vote === VOTE_MODES.SECRET &&
    !game.flow.includes(
      FLOW_PHASES.SECRET_VOTE
    )
  ) {

    errors.push(
      "Vote SECRET sans SECRET_VOTE"
    );
  }


  /*
   * Une pénalité nécessite une résolution.
   */

  if (
    game.penalty !== PENALTIES.NONE &&
    !game.flow.includes(
      FLOW_PHASES.RESOLVE
    )
  ) {

    errors.push(
      "Pénalité sans RESOLVE"
    );
  }


  return {
    valid: errors.length === 0,
    errors
  };
}


/* ============================================================
   SÉCURITÉ — NE JAMAIS EXPOSER LE SECRET
   ============================================================ */

function getSafePublicFlowState() {

  return {

    game: GAME_FLOW.game
      ? {
          id: GAME_FLOW.game.id,
          name: GAME_FLOW.game.name,
          type: GAME_FLOW.game.type
        }
      : null,

    phase:
      GAME_FLOW.phase,

    phaseIndex:
      GAME_FLOW.phaseIndex,

    actor:
      GAME_FLOW.actor,

    targets:
      [...GAME_FLOW.targets],

    participants:
      [...GAME_FLOW.participants],

    winner:
      GAME_FLOW.winner,

    loser:
      GAME_FLOW.loser,

    resolved:
      GAME_FLOW.resolved,

    /*
     * IMPORTANT :
     * Aucun content privé ici.
     */
    publicContent:
      GAME_FLOW.publicContent
  };
}


/* ============================================================
   SÉCURITÉ — ACCÈS AU SECRET
   ============================================================ */

function getPrivateFlowState() {

  if (
    !isPrivatePhase()
  ) {
    return null;
  }

  return {

    phase:
      GAME_FLOW.phase,

    secretOwner:
      GAME_FLOW.secretOwner,

    privateContent:
      GAME_FLOW.privateContent,

    content:
      GAME_FLOW.privateContent
  };
}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

function getGameFlowDebug() {

  return {
    game:
      GAME_FLOW.game?.id || null,

    phase:
      GAME_FLOW.phase,

    phaseIndex:
      GAME_FLOW.phaseIndex,

    actor:
      GAME_FLOW.actor,

    targets:
      GAME_FLOW.targets,

    participants:
      GAME_FLOW.participants,

    secretOwner:
      GAME_FLOW.secretOwner,

    votes:
      GAME_FLOW.votes,

    winner:
      GAME_FLOW.winner,

    loser:
      GAME_FLOW.loser,

    resolved:
      GAME_FLOW.resolved
  };
}
