/* ============================================================
   SOIRÉE — APPLICATION ENGINE
   BUILD 08.2
   ============================================================ */

/*
  ARCHITECTURE

  config.js
      ↓
  questions.js
      ↓
  games.js
      ↓
  gameFlow.js
      ↓
  app.js
      ↓
  interface

  PRINCIPES
  ----------
  1. Une action importante = un écran.
  2. Un secret = uniquement dans une phase privée.
  3. Aucun vote n'est résolu après un seul clic.
  4. Aucun jeu ne reçoit une cible aléatoire si le groupe
     doit la déterminer.
  5. Une pénalité nécessite réellement un perdant.
  6. Les écrans "continuer" inutiles sont supprimés.
*/


/* ============================================================
   ÉTAT DE L'APPLICATION
   ============================================================ */

const APP = {

  players: [],

  intensity: "CLASSIQUE",

  screen: "HOME",

  round: 0,

  currentGame: null,

  currentContent: null,

  currentTargets: [],

  currentActor: null,

  currentPair: [],

  selectedChoice: null,

  selectedPlayers: [],

  votes: {},

  voteTurn: 0,

  timer: null,

  timerRemaining: 0,

  sessionStarted: false,

  history: [],

  playerHistory: {},

  recentFamilies: [],

  toastTimer: null
};


/* ============================================================
   INITIALISATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {

  loadSession();

  render();

  window.addEventListener("beforeunload", saveSession);
}


/* ============================================================
   PERSISTENCE
   ============================================================ */

function saveSession() {

  if (
    typeof CONFIG === "undefined" ||
    !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
  ) {
    return;
  }

  try {

    const data = {

      players: APP.players,

      intensity: APP.intensity,

      screen: APP.screen,

      round: APP.round,

      history: APP.history.slice(-30),

      playerHistory: APP.playerHistory,

      recentFamilies: APP.recentFamilies

    };

    localStorage.setItem(
      CONFIG.SESSION.STORAGE_KEY,
      JSON.stringify(data)
    );

  } catch (error) {

    console.warn("Impossible de sauvegarder la session.", error);
  }
}


function loadSession() {

  if (
    typeof CONFIG === "undefined" ||
    !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
  ) {
    return;
  }

  try {

    const raw = localStorage.getItem(
      CONFIG.SESSION.STORAGE_KEY
    );

    if (!raw) {
      return;
    }

    const data = JSON.parse(raw);

    if (Array.isArray(data.players)) {
      APP.players = data.players;
    }

    if (data.intensity) {
      APP.intensity = data.intensity;
    }

    if (Array.isArray(data.history)) {
      APP.history = data.history;
    }

    if (data.playerHistory) {
      APP.playerHistory = data.playerHistory;
    }

    if (Array.isArray(data.recentFamilies)) {
      APP.recentFamilies = data.recentFamilies;
    }

  } catch (error) {

    console.warn("Session invalide.", error);
  }
}


function clearSession() {

  try {

    if (typeof CONFIG !== "undefined") {

      localStorage.removeItem(
        CONFIG.SESSION.STORAGE_KEY
      );
    }

  } catch (error) {}

  APP.players = [];
  APP.history = [];
  APP.playerHistory = {};
  APP.recentFamilies = [];
  APP.round = 0;
}


/* ============================================================
   OUTILS
   ============================================================ */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function randomItem(array) {

  if (!Array.isArray(array) || !array.length) {
    return null;
  }

  return array[
    Math.floor(Math.random() * array.length)
  ];
}


function shuffle(array) {

  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] =
      [result[j], result[i]];
  }

  return result;
}


function normalizePlayerName(name) {

  return String(name || "")
    .trim()
    .replace(/\s+/g, " ");
}


function playerExists(name) {

  return APP.players.includes(name);
}


function getOtherPlayers(player) {

  return APP.players.filter(
    p => p !== player
  );
}


function getRandomPlayer(exclude = []) {

  const blocked = new Set(
    Array.isArray(exclude) ? exclude : [exclude]
  );

  const available = APP.players.filter(
    player => !blocked.has(player)
  );

  return randomItem(available);
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function setScreen(screen) {

  APP.screen = screen;

  saveSession();

  render();
}


function goHome() {

  stopTimer();

  resetCurrentTurn();

  APP.screen = "HOME";

  saveSession();

  render();
}


function resetCurrentTurn() {

  APP.currentGame = null;
  APP.currentContent = null;
  APP.currentTargets = [];
  APP.currentActor = null;
  APP.currentPair = [];
  APP.selectedChoice = null;
  APP.selectedPlayers = [];
  APP.votes = {};
  APP.voteTurn = 0;

  if (typeof resetGameFlow === "function") {
    resetGameFlow();
  }
}


/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render() {

  const root = document.getElementById("app");

  if (!root) {
    return;
  }

  switch (APP.screen) {

    case "HOME":
      root.innerHTML = renderHome();
      break;

    case "PLAYERS":
      root.innerHTML = renderPlayers();
      break;

    case "INTENSITY":
      root.innerHTML = renderIntensity();
      break;

    case "GAME":
      root.innerHTML = renderCurrentGame();
      break;

    case "PASS_PHONE":
      root.innerHTML = renderPassPhone();
      break;

    case "SECRET":
      root.innerHTML = renderSecret();
      break;

    case "RETURN_PHONE":
      root.innerHTML = renderReturnPhone();
      break;

    case "VOTE":
      root.innerHTML = renderVote();
      break;

    case "RESULT":
      root.innerHTML = renderResult();
      break;

    case "PENALTY":
      root.innerHTML = renderPenalty();
      break;

    default:
      root.innerHTML = renderHome();
  }
}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

  return `
    <section class="screen home-screen">
      <div class="screen-inner">

        <div class="screen-main">

          <p class="eyebrow">PARTY GAME</p>

          <h1 class="logo">SOIRÉE</h1>

          <p class="logo-subtitle">
            Des jeux rapides, du bluff, des défis
            et des secrets à partager.
          </p>

        </div>

        <div class="screen-footer">

          <div class="button-stack">

            <button
              class="primary-button"
              onclick="openPlayers()"
            >
              LANCER LA SOIRÉE
            </button>

            ${
              APP.players.length >= 3
                ? `
                  <button
                    class="secondary-button"
                    onclick="resumeSession()"
                  >
                    REPRENDRE
                  </button>
                `
                : ""
            }

          </div>

        </div>

      </div>
    </section>
  `;
}


/* ============================================================
   JOUEURS
   ============================================================ */

function openPlayers() {

  APP.screen = "PLAYERS";

  render();
}


function renderPlayers() {

  const rows = APP.players.length
    ? APP.players.map((player, index) => `
        <div class="player-row">

          <input
            class="input"
            value="${escapeHTML(player)}"
            data-player-index="${index}"
            maxlength="20"
            autocomplete="off"
          >

          <button
            class="remove-player"
            onclick="removePlayer(${index})"
            aria-label="Supprimer"
          >
            ×
          </button>

        </div>
      `).join("")
    : `
        <div class="empty-state">
          Ajoute au moins 3 joueurs.
        </div>
      `;

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <button
            class="back-button"
            onclick="goHome()"
            aria-label="Retour"
          >
            ‹
          </button>

          <span class="muted">
            ${APP.players.length}/12
          </span>

        </header>

        <div class="screen-main">

          <p class="eyebrow">ÉTAPE 1</p>

          <h1 class="title">
            Qui joue ?
          </h1>

          <p class="subtitle">
            Entrez les prénoms des joueurs.
          </p>

          <div class="setup mt-4">

            ${rows}

            <button
              class="secondary-button"
              onclick="addPlayer()"
            >
              + AJOUTER UN JOUEUR
            </button>

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="validatePlayers()"
          >
            CONTINUER
          </button>

        </div>

      </div>

    </section>
  `;
}


function addPlayer() {

  if (APP.players.length >= 12) {

    showToast("Maximum 12 joueurs.");

    return;
  }

  APP.players.push("");

  render();

  requestAnimationFrame(() => {

    const inputs =
      document.querySelectorAll(".input");

    const input =
      inputs[inputs.length - 1];

    if (input) {
      input.focus();
    }
  });
}


function removePlayer(index) {

  APP.players.splice(index, 1);

  render();
}


function syncPlayerInputs() {

  document
    .querySelectorAll("[data-player-index]")
    .forEach(input => {

      const index =
        Number(input.dataset.playerIndex);

      APP.players[index] =
        normalizePlayerName(input.value);
    });
}


function validatePlayers() {

  syncPlayerInputs();

  APP.players =
    APP.players
      .map(normalizePlayerName)
      .filter(Boolean);

  if (APP.players.length < 3) {

    showToast("Il faut au moins 3 joueurs.");

    render();

    return;
  }

  const duplicates =
    APP.players.filter(
      (name, index) =>
        APP.players.indexOf(name) !== index
    );

  if (duplicates.length) {

    showToast("Chaque joueur doit avoir un prénom différent.");

    return;
  }

  saveSession();

  APP.screen = "INTENSITY";

  render();
}


/* ============================================================
   INTENSITÉ
   ============================================================ */

function renderIntensity() {

  const intensities = [

    {
      id: "COOL",
      name: "COOL",
      description:
        "Tranquille, drôle et accessible."
    },

    {
      id: "CLASSIQUE",
      name: "CLASSIQUE",
      description:
        "Le meilleur équilibre pour une soirée."
    },

    {
      id: "CHAUD",
      name: "CHAUD",
      description:
        "Plus personnel, plus risqué, plus intense."
    },

    {
      id: "CHAOS",
      name: "CHAOS",
      description:
        "Aucune retenue. La soirée peut déraper."
    }

  ];

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <button
            class="back-button"
            onclick="setScreen('PLAYERS')"
          >
            ‹
          </button>

        </header>

        <div class="screen-main">

          <p class="eyebrow">ÉTAPE 2</p>

          <h1 class="title">
            Quelle ambiance ?
          </h1>

          <p class="subtitle">
            L'intensité influence les jeux proposés.
          </p>

          <div class="intensity-list mt-4">

            ${intensities.map(item => `

              <button
                class="intensity-card ${
                  APP.intensity === item.id
                    ? "selected"
                    : ""
                }"
                onclick="selectIntensity('${item.id}')"
              >

                <p class="intensity-name">
                  ${item.name}
                </p>

                <p class="intensity-description">
                  ${item.description}
                </p>

              </button>

            `).join("")}

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="launchParty()"
          >
            COMMENCER
          </button>

        </div>

      </div>

    </section>
  `;
}


function selectIntensity(intensity) {

  APP.intensity = intensity;

  render();
}


function launchParty() {

  APP.sessionStarted = true;

  APP.round = 0;

  saveSession();

  startNextRound();
}


function resumeSession() {

  if (APP.players.length < 3) {

    openPlayers();

    return;
  }

  APP.sessionStarted = true;

  startNextRound();
}


/* ============================================================
   SÉLECTION DU JEU
   ============================================================ */

function getEligibleGames() {

  if (
    typeof GAMES === "undefined" ||
    !Array.isArray(GAMES)
  ) {
    return [];
  }

  return GAMES.filter(game => {

    if (!game) {
      return false;
    }

    if (
      game.minPlayers &&
      APP.players.length < game.minPlayers
    ) {
      return false;
    }

    if (
      game.maxPlayers &&
      APP.players.length > game.maxPlayers
    ) {
      return false;
    }

    return true;
  });
}


function chooseGame() {

  const eligible =
    getEligibleGames();

  if (!eligible.length) {
    return null;
  }

  const intensityConfig =
    typeof getIntensityConfig === "function"
      ? getIntensityConfig(APP.intensity)
      : {
          preferredIntensity: 2,
          chaosMultiplier: 1,
          hotMultiplier: 1
        };


  /*
    Évite les mêmes jeux trop rapprochés.
  */

  const recentGames =
    APP.history.slice(-5);


  let candidates =
    eligible.filter(
      game => !recentGames.includes(game.id)
    );


  if (!candidates.length) {
    candidates = eligible;
  }


  /*
    Évite d'enchaîner trop souvent la même famille.
  */

  if (
    APP.recentFamilies.length >= 2
  ) {

    const lastFamily =
      APP.recentFamilies[
        APP.recentFamilies.length - 1
      ];

    const alternative =
      candidates.filter(
        game => game.family !== lastFamily
      );

    if (alternative.length) {
      candidates = alternative;
    }
  }


  /*
    Pondération légère selon l'intensité.
  */

  const weighted = [];

  candidates.forEach(game => {

    let weight = 1;

    if (
      APP.intensity === "COOL" &&
      (
        game.type === GAME_TYPES.SECRET ||
        game.family === "PERSONNEL"
      )
    ) {
      weight *= .6;
    }

    if (
      APP.intensity === "CHAUD" &&
      (
        game.family === "PERSONNEL" ||
        game.family === "BLUFF"
      )
    ) {
      weight *= 1.5;
    }

    if (
      APP.intensity === "CHAOS" &&
      (
        game.family === "BLUFF" ||
        game.family === "IMPRO" ||
        game.family === "RAPIDITE"
      )
    ) {
      weight *= 2;
    }

    /*
      Multiplicateur HOT.
    */

    if (
      game.family === "PERSONNEL"
    ) {
      weight *= intensityConfig.hotMultiplier || 1;
    }

    const count =
      Math.max(
        1,
        Math.round(weight)
      );

    for (let i = 0; i < count; i++) {
      weighted.push(game);
    }
  });


  return randomItem(weighted) || candidates[0];
}


/* ============================================================
   DÉMARRAGE D'UN TOUR
   ============================================================ */

function startNextRound() {

  stopTimer();

  APP.round++;

  const game = chooseGame();

  if (!game) {

    showError(
      "Aucun jeu disponible pour cette configuration."
    );

    return;
  }

  APP.currentGame = game;

  APP.currentContent =
    getGameContent(game);

  APP.currentTargets = [];

  APP.currentActor = null;

  APP.currentPair = [];

  APP.selectedChoice = null;

  APP.selectedPlayers = [];

  APP.votes = {};

  APP.voteTurn = 0;


  /*
    Enregistre l'historique.
  */

  APP.history.push(game.id);

  APP.history =
    APP.history.slice(-30);


  APP.recentFamilies.push(
    game.family
  );

  APP.recentFamilies =
    APP.recentFamilies.slice(-3);


  /*
    Lance le moteur.
  */

  if (typeof startGameFlow === "function") {
    startGameFlow(game);
  }


  /*
    Les rôles sont préparés uniquement
    lorsqu'ils sont réellement nécessaires.
  */

  prepareGameRoles(game);


  goToCurrentPhase();
}


/* ============================================================
   CONTENU
   ============================================================ */

function getGameContent(game) {

  if (
    !game ||
    typeof QUESTIONS === "undefined"
  ) {
    return null;
  }

  const pool =
    QUESTIONS[game.contentPool];

  if (!Array.isArray(pool) || !pool.length) {
    return null;
  }

  return randomItem(pool);
}


/* ============================================================
   RÔLES
   ============================================================ */

function prepareGameRoles(game) {

  if (!game) {
    return;
  }


  /*
    ACTOR RANDOM
    */

  if (game.actor === ACTOR_MODES.RANDOM) {

    APP.currentActor =
      getRandomPlayer();

    if (typeof setGameActor === "function") {
      setGameActor(APP.currentActor);
    }
  }


  /*
    TARGET ONE
    */

  if (
    game.target === TARGET_MODES.ONE &&
    game.actor === ACTOR_MODES.TARGET
  ) {

    APP.currentActor =
      getRandomPlayer();

    APP.currentTargets =
      APP.currentActor
        ? [APP.currentActor]
        : [];

    if (typeof setGameActor === "function") {
      setGameActor(APP.currentActor);
    }

    if (typeof setGameTarget === "function") {
      setGameTarget(APP.currentActor);
    }
  }


  /*
    TARGET TWO
    */

  if (
    game.target === TARGET_MODES.TWO
  ) {

    const players =
      shuffle(APP.players);

    APP.currentPair =
      players.slice(0, 2);

    APP.currentTargets =
      [...APP.currentPair];

    if (typeof setParticipants === "function") {
      setParticipants(APP.currentPair);
    }
  }


  /*
    ALL
    */

  if (
    game.target === TARGET_MODES.ALL
  ) {

    APP.currentTargets =
      [...APP.players];

    if (typeof setParticipants === "function") {
      setParticipants(APP.players);
    }
  }


  /*
    SECRET OWNER
    */

  if (
    game.type === GAME_TYPES.SECRET &&
    APP.currentActor
  ) {

    if (typeof setSecretOwner === "function") {
      setSecretOwner(APP.currentActor);
    }
  }
}


/* ============================================================
   PHASE ACTUELLE
   ============================================================ */

function goToCurrentPhase() {

  const phase =
    typeof getCurrentGamePhase === "function"
      ? getCurrentGamePhase()
      : APP.currentGame?.flow?.[0];


  switch (phase) {

    case FLOW_PHASES.INTRO:

      APP.screen = "GAME";
      render();

      break;


    case FLOW_PHASES.SELECT_TARGET:

      APP.screen = "GAME";
      render();

      break;


    case FLOW_PHASES.SELECT_PLAYERS:

      APP.screen = "GAME";
      render();

      break;


    case FLOW_PHASES.PASS_PHONE:

      APP.screen = "PASS_PHONE";
      render();

      break;


    case FLOW_PHASES.SECRET_REVEAL:

      APP.screen = "SECRET";
      render();

      break;


    case FLOW_PHASES.RETURN_PHONE:

      APP.screen = "RETURN_PHONE";
      render();

      break;


    case FLOW_PHASES.PLAY:

      APP.screen = "GAME";
      render();

      startGameTimerIfNeeded();

      break;


    case FLOW_PHASES.VOTE:

      prepareVote();

      break;


    case FLOW_PHASES.RESOLVE:

      resolveCurrentGame();

      break;


    case FLOW_PHASES.PENALTY:

      APP.screen = "PENALTY";
      render();

      break;


    case FLOW_PHASES.NEXT:

      startNextRound();

      break;


    default:

      APP.screen = "GAME";
      render();
  }
}


/* ============================================================
   AVANCER DANS LE FLOW
   ============================================================ */

function continueGame() {

  stopTimer();

  const phase =
    typeof nextGamePhase === "function"
      ? nextGamePhase()
      : null;


  if (!phase) {

    startNextRound();

    return;
  }


  goToCurrentPhase();
}


/* ============================================================
   ÉCRAN DE JEU
   ============================================================ */

function renderCurrentGame() {

  const game = APP.currentGame;

  if (!game) {
    return renderHome();
  }

  const phase =
    getCurrentGamePhaseSafe();


  /*
    INTRO
    */

  if (phase === FLOW_PHASES.INTRO) {

    return renderGameIntro(game);
  }


  /*
    SELECT TARGET
    */

  if (phase === FLOW_PHASES.SELECT_TARGET) {

    return renderTargetSelection(game);
  }


  /*
    SELECT PLAYERS
    */

  if (phase === FLOW_PHASES.SELECT_PLAYERS) {

    return renderPlayerSelection(game);
  }


  /*
    PLAY
    */

  return renderGamePlay(game);
}


function getCurrentGamePhaseSafe() {

  if (
    typeof getCurrentGamePhase === "function"
  ) {
    return getCurrentGamePhase();
  }

  return APP.currentGame?.flow?.[0] || null;
}


/* ============================================================
   INTRO
   ============================================================ */

function renderGameIntro(game) {

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <button
            class="back-button"
            onclick="confirmQuit()"
          >
            ‹
          </button>

          <span class="game-round">
            TOUR ${APP.round}
          </span>

        </header>

        <div class="screen-main">

          <div class="game-intro">

            <p class="eyebrow">
              ${escapeHTML(game.family)}
            </p>

            <h1 class="title">
              ${escapeHTML(game.name)}
            </h1>

            <p class="subtitle">
              ${getIntroText(game)}
            </p>

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="continueGame()"
          >
            COMMENCER
          </button>

        </div>

      </div>

    </section>
  `;
}


function getIntroText(game) {

  if (game.type === GAME_TYPES.GROUP_VOTE) {
    return "Le groupe décide.";
  }

  if (game.type === GAME_TYPES.SECRET) {
    return "Un joueur va recevoir une information secrète.";
  }

  if (game.type === GAME_TYPES.RAPID) {
    return "Répondez vite. Pas le temps de réfléchir.";
  }

  if (game.type === GAME_TYPES.BLUFF) {
    return "Convainquez les autres… ou repérez le menteur.";
  }

  if (game.type === GAME_TYPES.GROUP) {
    return "Tout le monde participe.";
  }

  return "Préparez-vous.";
}


/* ============================================================
   SÉLECTION DE CIBLE
   ============================================================ */

function renderTargetSelection(game) {

  /*
    Pour les jeux où la cible est déjà désignée
    automatiquement, on ne montre PAS une étape
    inutile de sélection.
  */

  if (
    APP.currentActor &&
    game.actor === ACTOR_MODES.TARGET
  ) {

    return renderAssignedTarget(game);
  }


  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <button
            class="back-button"
            onclick="confirmQuit()"
          >
            ‹
          </button>

        </header>

        <div class="screen-main">

          <p class="eyebrow">
            CHOISISSEZ
          </p>

          <h1 class="title">
            Qui joue ?
          </h1>

          <div class="player-list mt-4">

            ${APP.players.map(player => `

              <button
                class="player-button"
                onclick="selectTarget('${encodeURIComponent(player)}')"
              >
                <span>
                  ${escapeHTML(player)}
                </span>
              </button>

            `).join("")}

          </div>

        </div>

      </div>

    </section>
  `;
}


function renderAssignedTarget(game) {

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <span class="game-round">
            TOUR ${APP.round}
          </span>

        </header>

        <div class="screen-main">

          <div class="target-display">

            <p class="eyebrow">
              CIBLE DU TOUR
            </p>

            <div class="target-name">
              ${escapeHTML(APP.currentActor)}
            </div>

          </div>

          <div class="card card-accent center">

            <p class="section-title">
              ${escapeHTML(game.name)}
            </p>

            <p class="subtitle">
              ${getTargetInstruction(game)}
            </p>

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="continueGame()"
          >
            C'EST PARTI
          </button>

        </div>

      </div>

    </section>
  `;
}


function getTargetInstruction(game) {

  if (game.id === "G019") {
    return "Passe le téléphone à cette personne.";
  }

  if (game.type === GAME_TYPES.SECRET) {
    return "Cette personne recevra une information secrète.";
  }

  return "Cette personne est au centre du tour.";
}


/* ============================================================
   SÉLECTION DE JOUEURS
   ============================================================ */

function renderPlayerSelection(game) {

  const required =
    game.target === TARGET_MODES.TWO
      ? 2
      : 1;

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <button
            class="back-button"
            onclick="confirmQuit()"
          >
            ‹
          </button>

        </header>

        <div class="screen-main">

          <p class="eyebrow">
            ${required} JOUEURS
          </p>

          <h1 class="title">
            Qui participe ?
          </h1>

          <p class="subtitle">
            Sélectionnez ${required} personne${required > 1 ? "s" : ""}.
          </p>

          <div class="player-list mt-4">

            ${APP.players.map(player => {

              const selected =
                APP.selectedPlayers.includes(player);

              return `

                <button
                  class="player-button ${
                    selected ? "selected" : ""
                  }"
                  onclick="toggleSelectedPlayer('${encodeURIComponent(player)}')"
                >

                  <span>
                    ${escapeHTML(player)}
                  </span>

                  <span class="player-index">
                    ${selected ? "✓" : ""}
                  </span>

                </button>
              `;

            }).join("")}

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="confirmSelectedPlayers(${required})"
            ${APP.selectedPlayers.length !== required ? "disabled" : ""}
          >
            CONTINUER
          </button>

        </div>

      </div>

    </section>
  `;
}


function selectTarget(encodedPlayer) {

  const player =
    decodeURIComponent(encodedPlayer);

  if (!playerExists(player)) {
    return;
  }

  APP.currentActor = player;

  APP.currentTargets = [player];

  if (typeof setGameActor === "function") {
    setGameActor(player);
  }

  if (typeof setGameTarget === "function") {
    setGameTarget(player);
  }

  continueGame();
}


function toggleSelectedPlayer(encodedPlayer) {

  const player =
    decodeURIComponent(encodedPlayer);

  const index =
    APP.selectedPlayers.indexOf(player);

  if (index >= 0) {

    APP.selectedPlayers.splice(index, 1);

  } else {

    if (APP.selectedPlayers.length >= 2) {
      return;
    }

    APP.selectedPlayers.push(player);
  }

  render();
}


function confirmSelectedPlayers(required) {

  if (
    APP.selectedPlayers.length !== required
  ) {
    return;
  }

  APP.currentPair =
    [...APP.selectedPlayers];

  APP.currentTargets =
    [...APP.selectedPlayers];

  if (typeof setParticipants === "function") {
    setParticipants(APP.currentPair);
  }

  continueGame();
}


/* ============================================================
   PASSAGE DU TÉLÉPHONE
   ============================================================ */

function renderPassPhone() {

  const target =
    APP.currentActor ||
    APP.currentTargets[0];

  return `
    <section class="screen private-screen">

      <div class="screen-inner">

        <div class="private-content">

          <div class="private-icon">
            📱
          </div>

          <p class="eyebrow">
            TÉLÉPHONE
          </p>

          <h1 class="private-title">
            Passe le téléphone à
            <br>
            ${escapeHTML(target)}
          </h1>

          <p class="private-warning">
            Personne d'autre ne doit regarder l'écran.
          </p>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="continueGame()"
          >
            TÉLÉPHONE EN MAIN
          </button>

        </div>

      </div>

    </section>
  `;
}


/* ============================================================
   SECRET
   ============================================================ */

function renderSecret() {

  const game = APP.currentGame;

  const secret =
    getSecretContent(game);

  return `
    <section class="screen private-screen">

      <div class="screen-inner">

        <div class="private-content">

          <div class="secret-card">

            <p class="secret-label">
              SECRET
            </p>

            <p class="secret-value">
              ${escapeHTML(secret.title)}
            </p>

            ${
              secret.hint
                ? `
                  <p class="secret-hint">
                    ${escapeHTML(secret.hint)}
                  </p>
                `
                : ""
            }

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="continueGame()"
          >
            C'EST BON
          </button>

        </div>

      </div>

    </section>
  `;
}


function getSecretContent(game) {

  const content =
    APP.currentContent;

  if (!content) {

    return {
      title: "Aucune consigne",
      hint: ""
    };
  }


  switch (game.contentPool) {

    case "FORBIDDEN_WORD":

      return {
        title: content.word,
        hint:
          content.forbidden
            ? `Mot interdit : ${content.forbidden}`
            : "Ne prononce pas le mot interdit."
      };


    case "TRAP_WORD":

      return {
        title: content.word,
        hint:
          content.forbidden
            ? `Mot piège : ${content.forbidden}`
            : "Essaie de faire tomber quelqu'un dans le piège."
      };


    case "GUESS_WORD":

      return {
        title: content.word,
        hint:
          content.hint || "Fais deviner ce mot."
      };


    case "DESCRIPTION":

      return {
        title: content.word,
        hint:
          content.rule || "Fais deviner sans utiliser les mots évidents."
      };


    case "EXPRESSION":

      return {
        title: content,
        hint:
          "Fais deviner cette expression sans la prononcer."
      };


    case "MIME":

      return {
        title: content,
        hint:
          "Fais deviner uniquement avec des gestes."
      };


    case "TRAP_PROMPT":

      return {
        title: content,
        hint:
          "Réponds sans révéler le piège."
      };


    case "MISSION":

      return {
        title: content,
        hint:
          "Accomplis cette mission discrètement."
      };


    default:

      return {
        title:
          typeof content === "string"
            ? content
            : content.title || content.instruction || "Secret",
        hint:
          content.hint || ""
      };
  }
}


/* ============================================================
   RETOUR DU TÉLÉPHONE
   ============================================================ */

function renderReturnPhone() {

  return `
    <section class="screen private-screen">

      <div class="screen-inner">

        <div class="private-content">

          <div class="private-icon">
            ✓
          </div>

          <p class="eyebrow">
            SECRET TERMINÉ
          </p>

          <h1 class="private-title">
            Rends le téléphone
          </h1>

          <p class="private-warning">
            Le joueur peut maintenant reprendre sa place.
          </p>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="continueGame()"
          >
            TÉLÉPHONE RENDU
          </button>

        </div>

      </div>

    </section>
  `;
}


/* ============================================================
   JEU PUBLIC
   ============================================================ */

function renderGamePlay(game) {

  const content =
    getPublicGameContent(game);

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <span class="game-round">
            TOUR ${APP.round}
          </span>

          ${
            game.timer
              ? `
                <span class="vote-counter">
                  ${game.timer}s
                </span>
              `
              : ""
          }

        </header>

        <div class="screen-main">

          ${
            APP.currentActor &&
            shouldShowActor(game)
              ? `
                <div class="target-display">

                  <p class="eyebrow">
                    À TOI
                  </p>

                  <div class="target-name">
                    ${escapeHTML(APP.currentActor)}
                  </div>

                </div>
              `
              : ""
          }

          <div class="game-content">

            ${
              renderContentCard(
                game,
                content
              )
            }

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="handlePlayAction()"
          >
            ${getPlayButtonLabel(game)}
          </button>

        </div>

      </div>

    </section>
  `;
}


function shouldShowActor(game) {

  return (
    game.actor === ACTOR_MODES.RANDOM ||
    game.actor === ACTOR_MODES.TARGET
  );
}


function getPublicGameContent(game) {

  const content =
    APP.currentContent;

  if (!content) {

    return {
      title: "Préparez-vous.",
      instruction: ""
    };
  }


  switch (game.contentPool) {

    case "KNOWLEDGE":

      return {
        title: content.question,
        instruction:
          content.answerMode === "GROUP"
            ? "Le groupe répond."
            : "Réponds."
      };


    case "CHOICE":

      return {
        title: content.question,
        instruction:
          Array.isArray(content.choices)
            ? content.choices.join("  •  ")
            : ""
      };


    case "HOT":

      return {
        title: content.text,
        instruction: "Réponds franchement."
      };


    case "STATEMENTS":

      return {
        title: content.instruction,
        instruction:
          content.rule || "Le groupe doit trouver le mensonge."
      };


    default:

      return {
        title:
          typeof content === "string"
            ? content
            : content.question ||
              content.instruction ||
              content.text ||
              content.prompt ||
              "Préparez-vous.",

        instruction:
          content.rule ||
          content.hint ||
          ""
      };
  }
}


function renderContentCard(game, content) {

  /*
    CHOICE
    */

  if (
    game.contentPool === "CHOICE" &&
    Array.isArray(
      APP.currentContent?.choices
    )
  ) {

    return `

      <div class="prompt-card card">

        <p class="prompt">
          ${escapeHTML(content.title)}
        </p>

        <div class="choice-list mt-4">

          ${APP.currentContent.choices.map(
            (choice, index) => `

              <button
                class="choice-button ${
                  APP.selectedChoice === index
                    ? "selected"
                    : ""
                }"
                onclick="selectChoice(${index})"
              >
                ${escapeHTML(choice)}
              </button>

          `).join("")}

        </div>

      </div>

    `;
  }


  /*
    CONTENU STANDARD
    */

  return `

    <div class="prompt-card card">

      <p class="prompt">
        ${escapeHTML(content.title)}
      </p>

      ${
        content.instruction
          ? `
            <p class="instruction">
              ${escapeHTML(content.instruction)}
            </p>
          `
          : ""
      }

    </div>

  `;
}


function getPlayButtonLabel(game) {

  if (game.contentPool === "CHOICE") {
    return "VALIDER";
  }

  if (game.type === GAME_TYPES.GROUP_VOTE) {
    return "VOTER";
  }

  if (game.type === GAME_TYPES.RAPID) {
    return "J'AI FINI";
  }

  if (game.type === GAME_TYPES.BLUFF) {
    return "PASSER AU VOTE";
  }

  return "TERMINÉ";
}


/* ============================================================
   ACTION DE JEU
   ============================================================ */

function handlePlayAction() {

  const game =
    APP.currentGame;


  /*
    CHOIX
    */

  if (
    game.contentPool === "CHOICE"
  ) {

    if (
      APP.selectedChoice === null
    ) {

      showToast("Choisis une réponse.");

      return;
    }
  }


  /*
    RAPIDITÉ
    */

  stopTimer();


  /*
    Le prochain flow décide de la suite.
  */

  continueGame();
}


function selectChoice(index) {

  APP.selectedChoice = index;

  render();
}


/* ============================================================
   VOTE
   ============================================================ */

function prepareVote() {

  APP.votes = {};

  APP.voteTurn = 0;

  /*
    Vote physique confirmé par l'application :
    une seule confirmation collective suffit.
    Mais on conserve la structure pour les jeux
    qui nécessiteront plusieurs votes.
  */

  APP.screen = "VOTE";

  render();
}


function renderVote() {

  const game =
    APP.currentGame;

  const candidates =
    getVoteCandidates(game);

  return `
    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <span class="game-round">
            TOUR ${APP.round}
          </span>

          <span class="vote-counter">
            VOTE
          </span>

        </header>

        <div class="screen-main vote-screen">

          <p class="eyebrow">
            DÉCISION DU GROUPE
          </p>

          <h1 class="title">
            Qui choisissez-vous ?
          </h1>

          <p class="vote-status">
            Discutez à voix haute, puis sélectionnez
            la personne qui a obtenu le plus de votes.
          </p>

          <div class="player-list mt-4">

            ${candidates.map(player => `

              <button
                class="player-button ${
                  APP.selectedChoice === player
                    ? "selected"
                    : ""
                }"
                onclick="selectVoteCandidate('${encodeURIComponent(player)}')"
              >

                <span>
                  ${escapeHTML(player)}
                </span>

                <span class="player-index">
                  ${
                    APP.selectedChoice === player
                      ? "✓"
                      : ""
                  }
                </span>

              </button>

            `).join("")}

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="confirmVote()"
            ${APP.selectedChoice === null ? "disabled" : ""}
          >
            CONFIRMER LE VOTE
          </button>

        </div>

      </div>

    </section>
  `;
}


function getVoteCandidates(game) {

  /*
    La personne qui joue peut généralement
    être votée dans les jeux de bluff.
  */

  if (
    game.id === "G011" ||
    game.id === "G012"
  ) {
    return APP.players;
  }

  if (game.id === "G013") {
    return APP.currentPair;
  }

  return APP.players;
}


function selectVoteCandidate(encodedPlayer) {

  const player =
    decodeURIComponent(encodedPlayer);

  if (!APP.players.includes(player)) {
    return;
  }

  APP.selectedChoice = player;

  render();
}


function confirmVote() {

  if (
    APP.selectedChoice === null
  ) {

    showToast("Sélectionne une personne.");

    return;
  }


  const game =
    APP.currentGame;


  /*
    Enregistre une vraie décision de vote.
    Le système ne résout PAS le jeu avant cette étape.
  */

  if (typeof resetGameVotes === "function") {
    resetGameVotes();
  }

  if (typeof addGameVote === "function") {

    addGameVote(
      "GROUP",
      APP.selectedChoice
    );
  }


  /*
    Stockage local pour l'application.
  */

  APP.votes = {
    GROUP: APP.selectedChoice
  };


  continueGame();
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function resolveCurrentGame() {

  const game =
    APP.currentGame;


  /*
    Résolution moteur.
  */

  let result = null;

  if (typeof resolveGame === "function") {
    result = resolveGame();
  }


  /*
    Si le moteur n'a pas produit de résultat,
    l'application crée un résultat cohérent.
  */

  if (!result) {

    result = resolveFallback(game);
  }


  APP.currentContent = {
    original: APP.currentContent,
    result
  };


  APP.screen = "RESULT";

  render();
}


function resolveFallback(game) {

  /*
    Vote.
  */

  if (
    APP.selectedChoice
  ) {

    return {
      type: "VOTE",
      loser: APP.selectedChoice,
      winner: APP.selectedChoice
    };
  }


  /*
    Cible.
  */

  if (APP.currentActor) {

    return {
      type: "TARGET",
      target: APP.currentActor,
      loser: APP.currentActor
    };
  }


  return {
    type: "NONE"
  };
}


/* ============================================================
   RESULTAT
   ============================================================ */

function renderResult() {

  const result =
    APP.currentContent?.result || {};

  const game =
    APP.currentGame;


  const player =
    result.loser ||
    result.target ||
    result.winner ||
    null;


  const hasPenalty =
    game &&
    game.penalty &&
    game.penalty !== PENALTIES.NONE &&
    Boolean(player);


  return `
    <section class="screen">

      <div class="screen-inner">

        <div class="screen-main result-screen">

          <div class="result-icon">
            ✓
          </div>

          <p class="eyebrow">
            RÉSULTAT
          </p>

          <h1 class="result-title">
            ${
              result.type === "VOTE"
                ? "Le vote est tombé."
                : "Tour terminé."
            }
          </h1>

          ${
            player
              ? `
                <p class="result-description">
                  ${
                    result.type === "VOTE"
                      ? "La personne la plus votée est"
                      : "La personne concernée est"
                  }
                </p>

                <div class="result-player">
                  ${escapeHTML(player)}
                </div>
              `
              : `
                <p class="result-description">
                  Le tour est terminé.
                </p>
              `
          }

        </div>

        <div class="screen-footer">

          ${
            hasPenalty
              ? `
                <button
                  class="primary-button"
                  onclick="continueGame()"
                >
                  VOIR LA CONSÉQUENCE
                </button>
              `
              : `
                <button
                  class="primary-button"
                  onclick="finishTurn()"
                >
                  TOUR SUIVANT
                </button>
              `
          }

        </div>

      </div>

    </section>
  `;
}


/* ============================================================
   PÉNALITÉ
   ============================================================ */

function renderPenalty() {

  const game =
    APP.currentGame;

  const loser =
    APP.currentContent?.result?.loser ||
    APP.currentContent?.result?.target ||
    APP.currentActor;


  if (
    !loser ||
    !game ||
    game.penalty === PENALTIES.NONE
  ) {

    return renderNextTurn();
  }


  return `
    <section class="screen">

      <div class="screen-inner">

        <div class="screen-main">

          <div class="penalty-card card">

            <p class="penalty-label">
              CONSÉQUENCE
            </p>

            <p class="result-player">
              ${escapeHTML(loser)}
            </p>

            <p class="penalty-text mt-3">
              ${getPenaltyText()}
            </p>

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="finishTurn()"
          >
            C'EST FAIT
          </button>

        </div>

      </div>

    </section>
  `;
}


function getPenaltyText() {

  if (
    typeof CONFIG !== "undefined" &&
    CONFIG.PENALTIES?.DEFAULT
  ) {
    return CONFIG.PENALTIES.DEFAULT;
  }

  return "1 gorgée ou une alternative sans alcool.";
}


/* ============================================================
   FIN DU TOUR
   ============================================================ */

function finishTurn() {

  stopTimer();

  resetCurrentTurn();

  startNextRound();
}


function renderNextTurn() {

  return `
    <section class="screen">

      <div class="screen-inner">

        <div class="screen-main center">

          <p class="eyebrow">
            FIN DU TOUR
          </p>

          <h1 class="title">
            Prêts ?
          </h1>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="finishTurn()"
          >
            TOUR SUIVANT
          </button>

        </div>

      </div>

    </section>
  `;
}


/* ============================================================
   TIMER
   ============================================================ */

function startGameTimerIfNeeded() {

  const game =
    APP.currentGame;

  if (
    !game ||
    !game.timer
  ) {
    return;
  }

  startTimer(
    Number(game.timer)
  );
}


function startTimer(seconds) {

  stopTimer();

  APP.timerRemaining = seconds;

  const startedAt =
    Date.now();

  APP.timer = setInterval(() => {

    const elapsed =
      Math.floor(
        (Date.now() - startedAt) / 1000
      );

    APP.timerRemaining =
      Math.max(
        0,
        seconds - elapsed
      );


    const timer =
      document.querySelector(".vote-counter");

    if (timer) {

      timer.textContent =
        `${APP.timerRemaining}s`;
    }


    if (
      APP.timerRemaining <= 0
    ) {

      stopTimer();

      showToast("Temps écoulé.");

      setTimeout(() => {

        if (
          APP.screen === "GAME"
        ) {
          handlePlayAction();
        }

      }, 500);
    }

  }, 250);
}


function stopTimer() {

  if (APP.timer) {

    clearInterval(APP.timer);

    APP.timer = null;
  }

  APP.timerRemaining = 0;
}


/* ============================================================
   ERREURS
   ============================================================ */

function showError(message) {

  const root =
    document.getElementById("app");

  if (!root) {
    return;
  }

  root.innerHTML = `

    <section class="screen">

      <div class="screen-inner">

        <div class="screen-main">

          <div class="error-state">

            <strong>
              PROBLÈME
            </strong>

            <span>
              ${escapeHTML(message)}
            </span>

          </div>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="goHome()"
          >
            RETOUR À L'ACCUEIL
          </button>

        </div>

      </div>

    </section>

  `;
}


function showToast(message) {

  const existing =
    document.querySelector(".toast");

  if (existing) {
    existing.remove();
  }

  const toast =
    document.createElement("div");

  toast.className = "toast";

  toast.textContent = message;

  document.body.appendChild(toast);


  clearTimeout(APP.toastTimer);

  APP.toastTimer =
    setTimeout(() => {

      toast.remove();

    }, 2200);
}


/* ============================================================
   QUITTER
   ============================================================ */

function confirmQuit() {

  const confirmed =
    window.confirm(
      "Quitter la partie en cours ?"
    );

  if (!confirmed) {
    return;
  }

  stopTimer();

  resetCurrentTurn();

  APP.screen = "HOME";

  render();
}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

function runDiagnostics() {

  const report = {

    players:
      APP.players.length,

    games:
      typeof GAMES !== "undefined"
        ? GAMES.length
        : 0,

    questions:
      typeof QUESTIONS !== "undefined"
        ? Object.keys(QUESTIONS).length
        : 0,

    currentGame:
      APP.currentGame?.id || null,

    phase:
      getCurrentGamePhaseSafe(),

    gameErrors:
      typeof validateGamesDatabase === "function"
        ? validateGamesDatabase()
        : [],

    questionErrors:
      typeof validateQuestions === "function"
        ? validateQuestions()
        : []

  };


  console.table(report);

  return report;
}


/* ============================================================
   EXPOSITION DEBUG
   ============================================================ */

window.SOIRÉE = {

  APP,

  startNextRound,

  chooseGame,

  runDiagnostics,

  saveSession,

  clearSession,

  goHome

};
