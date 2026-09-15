/* ============================================================
   SOIRÉE — APPLICATION ENGINE
   BUILD 08.7
   ============================================================

   ARCHITECTURE FINALE

   JEU PUBLIC AVEC VOTE
   ACTION → VOTE → RÉSOLUTION

   JEU PUBLIC AVEC RÉUSSITE
   ACTION → RÉUSSOLUTION

   JEU SECRET
   PASSE LE TÉLÉPHONE → SECRET → RÉUSSITE ?

   MISSION SECRÈTE
   PASSE LE TÉLÉPHONE → SECRET

   RÈGLES :
   - Aucun INTRO supplémentaire
   - Aucun SELECT_TARGET visible
   - Aucun RETURN_PHONE
   - Aucun RESULT technique
   - Aucun PENALTY comme écran
   - Aucun NEXT comme écran
   - Une action principale par écran
   - Le résultat et la conséquence sont réunis
   ============================================================ */


/* ============================================================
   ÉTAT APPLICATION
   ============================================================ */

const APP = {

  players: [],

  intensity: "CLASSIQUE",

  screen: "HOME",

  round: 0,

  currentGame: null,

  currentContent: null,

  currentActor: null,

  currentTarget: null,

  currentPlayers: [],

  selectedChoice: null,

  votes: {},

  voteTarget: null,

  success: null,

  consequence: null,

  phaseIndex: 0,

  timer: null,

  timerRemaining: 0,

  history: [],

  recentFamilies: [],

  playerHistory: [],

  sessionStarted: false,

  toastTimer: null

};


/* ============================================================
   INITIALISATION
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  initApp
);


function initApp() {

  loadSession();

  render();

  window.addEventListener(
    "beforeunload",
    saveSession
  );

}


/* ============================================================
   PERSISTENCE
   ============================================================ */

function saveSession() {

  try {

    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
    ) {
      return;
    }

    localStorage.setItem(
      CONFIG.SESSION.STORAGE_KEY,
      JSON.stringify({

        players:
          APP.players,

        intensity:
          APP.intensity,

        history:
          APP.history.slice(-30),

        recentFamilies:
          APP.recentFamilies.slice(-3),

        playerHistory:
          APP.playerHistory.slice(-20)

      })
    );

  } catch (error) {

    console.warn(
      "Impossible de sauvegarder la session.",
      error
    );

  }

}


function loadSession() {

  try {

    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
    ) {
      return;
    }

    const raw =
      localStorage.getItem(
        CONFIG.SESSION.STORAGE_KEY
      );

    if (!raw) {
      return;
    }

    const data =
      JSON.parse(raw);

    if (
      Array.isArray(data.players)
    ) {

      APP.players =
        data.players
          .filter(Boolean)
          .slice(0, 12);

    }

    if (
      data.intensity &&
      (
        typeof CONFIG.INTENSITY === "undefined" ||
        CONFIG.INTENSITY[data.intensity]
      )
    ) {

      APP.intensity =
        data.intensity;

    }

    if (
      Array.isArray(data.history)
    ) {

      APP.history =
        data.history.slice(-30);

    }

    if (
      Array.isArray(data.recentFamilies)
    ) {

      APP.recentFamilies =
        data.recentFamilies.slice(-3);

    }

    if (
      Array.isArray(data.playerHistory)
    ) {

      APP.playerHistory =
        data.playerHistory.slice(-20);

    }

  } catch (error) {

    console.warn(
      "Session invalide.",
      error
    );

  }

}


function clearSession() {

  try {

    if (
      typeof CONFIG !== "undefined"
    ) {

      localStorage.removeItem(
        CONFIG.SESSION.STORAGE_KEY
      );

    }

  } catch (error) {}

  APP.players = [];

  APP.history = [];

  APP.recentFamilies = [];

  APP.playerHistory = [];

  APP.round = 0;

  resetCurrentTurn();

}


/* ============================================================
   UTILITAIRES
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

  if (
    !Array.isArray(array) ||
    !array.length
  ) {

    return null;

  }

  return array[
    Math.floor(
      Math.random() * array.length
    )
  ];

}


function shuffle(array) {

  const result =
    Array.isArray(array)
      ? [...array]
      : [];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ];

  }

  return result;

}


function getAvailablePlayers(exclude = []) {

  const blocked =
    new Set(
      Array.isArray(exclude)
        ? exclude
        : [exclude]
    );

  let available =
    APP.players.filter(
      player =>
        !blocked.has(player)
    );

  const recent =
    APP.playerHistory.slice(-3);

  const preferred =
    available.filter(
      player =>
        !recent.includes(player)
    );

  if (preferred.length) {

    available =
      preferred;

  }

  return shuffle(
    available
  );

}


function choosePlayer(exclude = []) {

  const player =
    randomItem(
      getAvailablePlayers(
        exclude
      )
    );

  if (player) {

    APP.playerHistory.push(
      player
    );

    APP.playerHistory =
      APP.playerHistory.slice(-20);

  }

  return player;

}


function chooseTwoPlayers() {

  const players =
    getAvailablePlayers();

  const pair =
    players.slice(0, 2);

  pair.forEach(
    player => {

      APP.playerHistory.push(
        player
      );

    }
  );

  APP.playerHistory =
    APP.playerHistory.slice(-20);

  return pair;

}


/* ============================================================
   NAVIGATION
   ============================================================ */

function setScreen(screen) {

  APP.screen =
    screen;

  render();

}


function goHome() {

  stopTimer();

  resetCurrentTurn();

  APP.screen =
    "HOME";

  render();

}


function resetCurrentTurn() {

  stopTimer();

  APP.currentGame =
    null;

  APP.currentContent =
    null;

  APP.currentActor =
    null;

  APP.currentTarget =
    null;

  APP.currentPlayers =
    [];

  APP.selectedChoice =
    null;

  APP.votes =
    {};

  APP.voteTarget =
    null;

  APP.success =
    null;

  APP.consequence =
    null;

  APP.phaseIndex =
    0;

}


/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render() {

  const root =
    document.getElementById(
      "app"
    );

  if (!root) {
    return;
  }

  switch (APP.screen) {

    case "HOME":

      root.innerHTML =
        renderHome();

      break;


    case "PLAYERS":

      root.innerHTML =
        renderPlayers();

      break;


    case "INTENSITY":

      root.innerHTML =
        renderIntensity();

      break;


    case "ACTION":

      root.innerHTML =
        renderAction();

      break;


    case "VOTE":

      root.innerHTML =
        renderVote();

      break;


    case "RESOLVE":

      root.innerHTML =
        renderResolve();

      break;


    case "PASS_SECRET":

      root.innerHTML =
        renderPassSecret();

      break;


    case "SECRET_ACTION":

      root.innerHTML =
        renderSecretAction();

      break;


    default:

      root.innerHTML =
        renderHome();

  }

}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

  return `

    <section class="home">

      <div class="logo">
        SOIRÉE
      </div>

      <p class="subtitle">
        PARTY GAME
      </p>

      <button
        class="primary-btn"
        onclick="openPlayers()"
      >
        LANCER LA SOIRÉE
      </button>

      ${
        APP.players.length >= 3
          ? `
            <button
              class="secondary-btn"
              onclick="resumeSession()"
            >
              REPRENDRE LA SOIRÉE
            </button>
          `
          : ""
      }

    </section>

  `;

}


function openPlayers() {

  APP.screen =
    "PLAYERS";

  render();

}


function resumeSession() {

  if (
    APP.players.length < 3
  ) {

    openPlayers();

    return;

  }

  APP.sessionStarted =
    true;

  startNextRound();

}


/* ============================================================
   JOUEURS
   ============================================================ */

function renderPlayers() {

  const rows =
    APP.players.length

      ? APP.players.map(
          (player, index) => `

            <div class="player-row">

              <input
                class="input"
                value="${escapeHTML(player)}"
                data-player-index="${index}"
                maxlength="20"
                autocomplete="off"
                placeholder="Prénom"
              >

              <button
                type="button"
                onclick="removePlayer(${index})"
              >
                ×
              </button>

            </div>

          `
        ).join("")

      : `
          <div class="empty-state">
            Ajoute les joueurs de la soirée.
          </div>
        `;


  return `

    <section class="players-screen">

      <header class="screen-header">

        <button
          class="back-btn"
          onclick="goHome()"
        >
          ‹
        </button>

        <div>
          Joueurs
        </div>

        <span class="players-count">
          ${APP.players.length}/12
        </span>

      </header>


      <div class="player-list">

        ${rows}

      </div>


      <button
        class="secondary-btn"
        onclick="addPlayer()"
      >
        + AJOUTER UN JOUEUR
      </button>


      <button
        class="primary-btn"
        onclick="validatePlayers()"
      >
        CONTINUER
      </button>

    </section>

  `;

}


function addPlayer() {

  if (
    APP.players.length >= 12
  ) {

    showToast(
      "Maximum 12 joueurs."
    );

    return;

  }

  APP.players.push("");

  render();

}


function removePlayer(index) {

  if (
    index < 0 ||
    index >= APP.players.length
  ) {
    return;
  }

  APP.players.splice(
    index,
    1
  );

  render();

}


function syncPlayerInputs() {

  document
    .querySelectorAll(
      "[data-player-index]"
    )
    .forEach(
      input => {

        const index =
          Number(
            input.dataset.playerIndex
          );

        APP.players[index] =
          String(
            input.value || ""
          )
          .trim()
          .replace(
            /\s+/g,
            " "
          );

      }
    );

}


function validatePlayers() {

  syncPlayerInputs();

  APP.players =
    APP.players
      .filter(Boolean);


  if (
    APP.players.length < 3
  ) {

    showToast(
      "Il faut au moins 3 joueurs."
    );

    render();

    return;

  }


  const normalized =
    APP.players.map(
      player =>
        player.toLowerCase()
    );


  if (
    new Set(normalized).size !==
    normalized.length
  ) {

    showToast(
      "Les prénoms doivent être différents."
    );

    return;

  }


  APP.screen =
    "INTENSITY";

  saveSession();

  render();

}


/* ============================================================
   INTENSITÉ
   ============================================================ */

const INTENSITIES = [

  {
    id: "COOL",
    title: "COOL",
    description:
      "Tranquille, drôle et accessible."
  },

  {
    id: "CLASSIQUE",
    title: "CLASSIQUE",
    description:
      "Le meilleur équilibre pour une soirée."
  },

  {
    id: "CHAUD",
    title: "CHAUD",
    description:
      "Plus personnel, plus intense."
  },

  {
    id: "CHAOS",
    title: "CHAOS",
    description:
      "Aucune retenue."
  }

];


function renderIntensity() {

  return `

    <section class="intensity-screen">

      <header class="screen-header">

        <button
          class="back-btn"
          onclick="setScreen('PLAYERS')"
        >
          ‹
        </button>

        <div>
          Intensité
        </div>

      </header>


      <div class="intensity-list">

        ${INTENSITIES.map(
          intensity => `

            <button
              class="
                intensity-card
                ${
                  APP.intensity ===
                  intensity.id
                    ? "selected"
                    : ""
                }
              "
              onclick="
                selectIntensity('${intensity.id}')
              "
            >

              <strong>
                ${intensity.title}
              </strong>

              <span>
                ${intensity.description}
              </span>

            </button>

          `
        ).join("")}

      </div>


      <button
        class="primary-btn"
        onclick="launchParty()"
      >
        COMMENCER
      </button>

    </section>

  `;

}


function selectIntensity(intensity) {

  if (
    !INTENSITIES.some(
      item =>
        item.id === intensity
    )
  ) {
    return;
  }

  APP.intensity =
    intensity;

  saveSession();

  render();

}


/* ============================================================
   SÉLECTION DU JEU
   ============================================================ */

function getEligibleGames() {

  if (
    typeof GAMES === "undefined" ||
    !Array.isArray(GAMES)
  ) {

    console.error(
      "GAMES est introuvable."
    );

    return [];

  }


  return GAMES.filter(
    game => {

      if (!game) {
        return false;
      }

      if (
        APP.players.length <
        game.minPlayers
      ) {
        return false;
      }

      if (
        APP.players.length >
        game.maxPlayers
      ) {
        return false;
      }

      if (
        game.contentPool &&
        typeof QUESTIONS !== "undefined"
      ) {

        const pool =
          QUESTIONS[
            game.contentPool
          ];

        if (
          !Array.isArray(pool) ||
          !pool.length
        ) {

          return false;

        }

      }

      return true;

    }
  );

}


function chooseGame() {

  const eligible =
    getEligibleGames();

  if (!eligible.length) {
    return null;
  }


  /* Évite les jeux récemment utilisés. */

  let candidates =
    eligible.filter(
      game =>
        !APP.history
          .slice(-5)
          .includes(game.id)
    );


  if (!candidates.length) {
    candidates =
      eligible;
  }


  /* Évite la répétition immédiate
     de la même famille. */

  const lastFamily =
    APP.recentFamilies[
      APP.recentFamilies.length - 1
    ];


  if (lastFamily) {

    const differentFamily =
      candidates.filter(
        game =>
          game.family !==
          lastFamily
      );

    if (differentFamily.length) {

      candidates =
        differentFamily;

    }

  }


  return randomItem(
    candidates
  );

}


/* ============================================================
   LANCEMENT D'UNE PARTIE
   ============================================================ */

function launchParty() {

  APP.sessionStarted =
    true;

  APP.round =
    0;

  APP.history =
    [];

  APP.recentFamilies =
    [];

  saveSession();

  startNextRound();

}


function startNextRound() {

  stopTimer();

  resetCurrentTurn();


  const game =
    chooseGame();


  if (!game) {

    showToast(
      "Aucun jeu disponible pour ce nombre de joueurs."
    );

    return;

  }


  APP.round++;


  APP.currentGame =
    game;


  APP.history.push(
    game.id
  );

  APP.history =
    APP.history.slice(-30);


  APP.recentFamilies.push(
    game.family
  );

  APP.recentFamilies =
    APP.recentFamilies.slice(-3);


  prepareGame(
    game
  );


  saveSession();

  enterFirstPhase();

}


/* ============================================================
   PRÉPARATION DU JEU
   ============================================================ */

function prepareGame(game) {

  const pool =
    typeof QUESTIONS !== "undefined"
      ? QUESTIONS[
          game.contentPool
        ]
      : [];


  APP.currentContent =
    randomItem(pool);


  /* ----------------------------------------------------------
     ACTEUR
     ---------------------------------------------------------- */

  if (
    game.actor ===
    ACTOR_MODES.RANDOM
  ) {

    APP.currentActor =
      choosePlayer();

  }


  /* ----------------------------------------------------------
     CIBLE UNIQUE
     ---------------------------------------------------------- */

  if (
    game.target ===
    TARGET_MODES.ONE
  ) {

    const target =
      choosePlayer(
        APP.currentActor
          ? [APP.currentActor]
          : []
      );

    APP.currentTarget =
      target;


    if (
      game.actor ===
      ACTOR_MODES.TARGET
    ) {

      APP.currentActor =
        target;

    }

  }


  /* ----------------------------------------------------------
     DEUX JOUEURS
     ---------------------------------------------------------- */

  if (
    game.target ===
    TARGET_MODES.TWO
  ) {

    APP.currentPlayers =
      chooseTwoPlayers();

    APP.currentActor =
      APP.currentPlayers[0] ||
      null;

    APP.currentTarget =
      APP.currentPlayers[1] ||
      null;

  }


  /* ----------------------------------------------------------
     TOUS
     ---------------------------------------------------------- */

  if (
    game.target ===
    TARGET_MODES.ALL
  ) {

    APP.currentPlayers =
      [...APP.players];

  }

}


/* ============================================================
   PHASES
   ============================================================ */

function getGameFlow() {

  if (
    !APP.currentGame
  ) {
    return [];
  }

  return Array.isArray(
    APP.currentGame.flow
  )
    ? APP.currentGame.flow
    : [];

}


function getCurrentPhase() {

  const flow =
    getGameFlow();

  return flow[
    APP.phaseIndex
  ] || null;

}


function enterFirstPhase() {

  APP.phaseIndex =
    0;

  showCurrentPhase();

}


function advancePhase() {

  const flow =
    getGameFlow();


  if (!flow.length) {

    finishRound();

    return;

  }


  APP.phaseIndex++;


  if (
    APP.phaseIndex >=
    flow.length
  ) {

    finishRound();

    return;

  }


  showCurrentPhase();

}


function showCurrentPhase() {

  let phase =
    getCurrentPhase();


  /* Sécurité :
     les anciennes phases techniques
     ne doivent plus produire d'écran. */

  while (
    phase === FLOW_PHASES.INTRO ||
    phase === FLOW_PHASES.SELECT_TARGET ||
    phase === FLOW_PHASES.SELECT_PLAYERS ||
    phase === FLOW_PHASES.PENALTY ||
    phase === "PASS_PHONE" ||
    phase === "PRIVATE_REVEAL" ||
    phase === "RETURN_PHONE" ||
    phase === "SECRET_REVEAL" ||
    phase === "PLAY" ||
    phase === "RESULT" ||
    phase === "NEXT"
  ) {

    APP.phaseIndex++;

    phase =
      getCurrentPhase();


    if (!phase) {

      finishRound();

      return;

    }

  }


  switch (phase) {

    case FLOW_PHASES.ACTION:

      APP.screen =
        "ACTION";

      render();

      startGameTimerIfNeeded();

      return;


    case FLOW_PHASES.VOTE:

      APP.screen =
        "VOTE";

      render();

      return;


    case FLOW_PHASES.RESOLVE:

      APP.screen =
        "RESOLVE";

      render();

      return;


    case FLOW_PHASES.SUCCESS_CHECK:

      APP.screen =
        "RESOLVE";

      render();

      return;


    case FLOW_PHASES.PASS_SECRET:

      APP.screen =
        "PASS_SECRET";

      render();

      return;


    case FLOW_PHASES.SECRET_ACTION:

      APP.screen =
        "SECRET_ACTION";

      render();

      return;


    default:

      finishRound();

  }

}


/* ============================================================
   ACTION PUBLIQUE
   ============================================================ */

function getActionTitle() {

  const game =
    APP.currentGame;

  if (!game) {
    return "DÉFI";
  }


  if (
    game.contentPool ===
    "HOT"
  ) {

    return (
      APP.currentTarget ||
      APP.currentActor ||
      game.name
    );

  }


  if (
    game.contentPool ===
    "STATEMENTS"
  ) {

    return (
      APP.currentActor ||
      game.name
    );

  }


  if (
    game.target ===
    TARGET_MODES.ONE
  ) {

    return (
      APP.currentActor ||
      APP.currentTarget ||
      game.name
    );

  }


  if (
    game.target ===
    TARGET_MODES.TWO
  ) {

    return APP.currentPlayers.join(
      " & "
    );

  }


  return game.name;

}


function getActionPrompt() {

  const content =
    APP.currentContent;


  if (
    typeof content ===
    "string"
  ) {

    return content;

  }


  if (
    content?.question
  ) {

    return content.question;

  }


  if (
    content?.text
  ) {

    return content.text;

  }


  if (
    content?.instruction
  ) {

    return content.instruction;

  }


  if (
    content?.word
  ) {

    return content.word;

  }


  return "Préparez-vous.";

}


function renderAction() {

  const game =
    APP.currentGame;


  if (!game) {
    return "";
  }


  const prompt =
    getActionPrompt();


  /* ----------------------------------------------------------
     CHOIX IMPOSSIBLE
     ---------------------------------------------------------- */

  if (
    game.contentPool ===
    "CHOICE"
  ) {

    return renderChoiceAction();

  }


  const target =
    APP.currentTarget;


  const targetLine =
    target
      ? `
        <div class="game-target">
          ${escapeHTML(target)}
        </div>
      `
      : "";


  let buttonLabel =
    "TERMINÉ";


  if (
    game.type ===
    GAME_TYPES.GROUP_VOTE ||
    game.voteMode !==
    VOTE_MODES.NONE
  ) {

    buttonLabel =
      "VOTER";

  }


  return `

    <section class="game-screen">

      <div class="game-header">

        <span>
          TOUR ${APP.round}
        </span>

        <span>
          ${escapeHTML(
            game.family || "DÉFI"
          )}
        </span>

      </div>


      <div class="game-card">

        ${
          targetLine
        }

        <div class="game-label">
          ${escapeHTML(
            game.name
          )}
        </div>

        <div class="game-main-text">
          ${escapeHTML(
            prompt
          )}
        </div>

        ${
          game.timer
            ? `
              <div class="timer">
                ${APP.timerRemaining || game.timer}s
              </div>
            `
            : ""
        }

      </div>


      <button
        class="primary-btn"
        onclick="actionDone()"
      >
        ${buttonLabel}
      </button>

    </section>

  `;

}


function actionDone() {

  stopTimer();

  advancePhase();

}


/* ============================================================
   CHOIX
   ============================================================ */

function renderChoiceAction() {

  const content =
    APP.currentContent;


  const choices =
    Array.isArray(
      content?.choices
    )
      ? content.choices
      : [];


  return `

    <section class="game-screen">

      <div class="game-header">

        <span>
          TOUR ${APP.round}
        </span>

        <span>
          CHOIX
        </span>

      </div>


      <div class="game-card">

        <div class="game-label">
          CHOIX IMPOSSIBLE
        </div>

        <div class="game-main-text">
          ${escapeHTML(
            content?.question ||
            "Choisissez."
          )}
        </div>

      </div>


      <div class="choice-grid">

        ${choices.map(
          (choice, index) => `

            <button
              class="choice-btn"
              onclick="
                chooseChoice(${index})
              "
            >
              ${escapeHTML(choice)}
            </button>

          `
        ).join("")}

      </div>

    </section>

  `;

}


function chooseChoice(index) {

  const choices =
    APP.currentContent?.choices ||
    [];


  const choice =
    choices[index];


  if (!choice) {
    return;
  }


  APP.selectedChoice =
    choice;


  APP.success =
    true;


  advancePhase();

}


/* ============================================================
   VOTE
   ============================================================ */

function getVotePrompt() {

  const content =
    APP.currentContent;


  if (
    typeof content ===
    "string"
  ) {

    return content;

  }


  return (
    content?.question ||
    content?.text ||
    content?.instruction ||
    "Qui choisissez-vous ?"
  );

}


function renderVote() {

  const prompt =
    getVotePrompt();


  return `

    <section class="result-screen">

      <div class="game-header">

        <span>
          TOUR ${APP.round}
        </span>

        <span>
          VOTE
        </span>

      </div>


      <div class="result-card">

        <div class="game-label">
          VOTE
        </div>

        <div class="game-main-text">
          ${escapeHTML(prompt)}
        </div>

        <p class="game-subtext">
          Désignez la personne choisie par le groupe.
        </p>

      </div>


      <div class="vote-list">

        ${APP.players.map(
          player => `

            <button
              class="choice-btn"
              onclick="
                selectVote('${escapeHTML(player)}')
              "
            >
              ${escapeHTML(player)}
            </button>

          `
        ).join("")}

      </div>

    </section>

  `;

}


function selectVote(player) {

  if (
    !APP.players.includes(
      player
    )
  ) {

    return;

  }


  APP.voteTarget =
    player;


  APP.result = {

    type: "VOTE",

    target:
      player

  };


  /*
    IMPORTANT :

    Le clic est directement
    le choix du groupe.

    PAS DE DEUXIÈME ÉCRAN
    "CONFIRMER".

    Le prochain écran est
    directement la résolution.
  */

  advancePhase();

}


/* ============================================================
   SECRET — PASSAGE DU TÉLÉPHONE
   ============================================================ */

function renderPassSecret() {

  const player =
    APP.currentActor ||
    APP.currentTarget ||
    "la personne désignée";


  return `

    <section class="private-transition">

      <div class="private-top">

        <div class="private-icon">
          📱
        </div>

        <div class="eyebrow">
          TÉLÉPHONE
        </div>

        <h1>
          Passe le téléphone à
          <br>
          ${escapeHTML(player)}
        </h1>

        <p>
          Personne d'autre ne doit regarder l'écran.
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="phoneInHand()"
      >
        TÉLÉPHONE EN MAIN
      </button>

    </section>

  `;

}


function phoneInHand() {

  advancePhase();

}


/* ============================================================
   SECRET — CONTENU PRIVÉ
   ============================================================ */

function getSecretTitle() {

  const content =
    APP.currentContent;


  switch (
    APP.currentGame?.contentPool
  ) {

    case "EXPRESSION":

      return content || "";


    case "MIME":

      return content || "";


    case "MISSION":

      return content || "";


    case "GUESS_WORD":

      return content?.word || "";


    case "DESCRIPTION":

      return content?.word || "";


    case "FORBIDDEN_WORD":

      return content?.word || "";


    case "TRAP_WORD":

      return content?.word || "";


    case "TRAP_PROMPT":

      return "LE PIÈGE";


    default:

      return (
        content?.word ||
        content?.text ||
        content?.instruction ||
        content ||
        APP.currentGame?.name ||
        ""
      );

  }

}


function getSecretInstruction() {

  const content =
    APP.currentContent;


  switch (
    APP.currentGame?.contentPool
  ) {

    case "EXPRESSION":

      return "Fais deviner cette expression sans la prononcer.";


    case "MIME":

      return "Fais deviner uniquement avec des gestes.";


    case "MISSION":

      return "Accomplis cette mission sans te faire griller.";


    case "GUESS_WORD":

      return content?.hint
        ? `Fais deviner ce mot. Indice : ${content.hint}`
        : "Fais deviner ce mot sans le prononcer.";


    case "DESCRIPTION":

      return (
        content?.rule ||
        "Fais deviner ce mot."
      );


    case "FORBIDDEN_WORD":

      return content?.forbidden
        ? `Ne prononce surtout pas : ${content.forbidden}`
        : "Évite le mot interdit.";


    case "TRAP_WORD":

      return content?.forbidden
        ? `Piège : ${content.forbidden}`
        : "Tends ton piège au groupe.";


    case "TRAP_PROMPT":

      return content ||
        "Tends ton piège au groupe.";


    default:

      return (
        content?.rule ||
        content?.instruction ||
        "Réalise le défi."
      );

  }

}


function renderSecretAction() {

  const title =
    getSecretTitle();


  const instruction =
    getSecretInstruction();


  return `

    <section class="private-screen">

      <div class="private-top">

        <div class="private-label">
          SECRET
        </div>


        <div class="secret-card">

          <div class="secret-label">
            ${escapeHTML(
              APP.currentActor ||
              APP.currentTarget ||
              ""
            )}
          </div>


          <div class="secret-text">
            ${escapeHTML(title)}
          </div>


          <div class="secret-subtext">
            ${escapeHTML(instruction)}
          </div>

        </div>

      </div>


      <button
        class="primary-btn"
        onclick="secretSeen()"
      >
        C'EST BON
      </button>

    </section>

  `;

}


function secretSeen() {

  /*
    MISSION SECRÈTE :

    Le joueur reçoit sa mission,
    puis elle continue dans la
    soirée. Aucun écran public
    supplémentaire.
  */

  if (
    APP.currentGame?.id ===
    "G015"
  ) {

    finishRound();

    return;

  }


  advancePhase();

}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function renderResolve() {

  const phase =
    getCurrentPhase();


  /*
    ------------------------------------------------------------
    SUCCESS CHECK
    ------------------------------------------------------------
  */

  if (
    phase ===
    FLOW_PHASES.SUCCESS_CHECK
  ) {

    return renderSuccessCheck();

  }


  /*
    ------------------------------------------------------------
    VOTE
    ------------------------------------------------------------
  */

  if (
    APP.result?.type ===
    "VOTE"
  ) {

    return renderVoteResult();

  }


  /*
    ------------------------------------------------------------
    CHOIX
    ------------------------------------------------------------
  */

  if (
    APP.selectedChoice
  ) {

    return renderChoiceResult();

  }


  /*
    ------------------------------------------------------------
    RÉSOLUTION GÉNÉRIQUE
    ------------------------------------------------------------
  */

  return renderGenericResult();

}


/* ============================================================
   SUCCESS CHECK
   ============================================================ */

function renderSuccessCheck() {

  const player =
    APP.currentActor ||
    APP.currentTarget ||
    "Alors ?";


  return `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          RÉUSSITE ?
        </div>

        <div class="game-main-text">
          ${escapeHTML(player)}
        </div>

        <p class="game-subtext">
          Tu as réussi le défi ?
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="resolveSuccess(true)"
      >
        OUI
      </button>


      <button
        class="secondary-btn"
        onclick="resolveSuccess(false)"
      >
        NON
      </button>

    </section>

  `;

}


function resolveSuccess(success) {

  APP.success =
    Boolean(success);


  const player =
    APP.currentActor ||
    APP.currentTarget;


  if (success) {

    APP.consequence =
      null;

  } else {

    APP.consequence =
      getConsequence(
        player
      );

  }


  /*
    On ne crée PAS une nouvelle phase.

    La résolution est immédiatement
    affichée dans le même écran logique.
  */

  renderSuccessResult();

}


function renderSuccessResult() {

  const player =
    APP.currentActor ||
    APP.currentTarget ||
    "La personne concernée";


  if (
    APP.success
  ) {

    return renderSuccessResultHTML(
      player
    );

  }


  return renderFailureResultHTML(
    player
  );

}


function renderSuccessResultHTML(player) {

  const root =
    document.getElementById(
      "app"
    );


  if (!root) {
    return;
  }


  root.innerHTML = `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          RÉUSSI
        </div>

        <div class="game-main-text">
          Bien joué.
        </div>

        <p class="game-subtext">
          ${escapeHTML(player)}
          a réussi.
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="finishRound()"
      >
        TOUR SUIVANT
      </button>

    </section>

  `;

}


function renderFailureResultHTML(player) {

  const root =
    document.getElementById(
      "app"
    );


  if (!root) {
    return;
  }


  root.innerHTML = `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          CONSÉQUENCE
        </div>

        <div class="game-main-text">
          ${escapeHTML(player)}
        </div>

        <p class="game-subtext">
          ${escapeHTML(
            APP.consequence
          )}
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="finishRound()"
      >
        C'EST FAIT
      </button>

    </section>

  `;

}


/* ============================================================
   RÉSULTAT VOTE
   ============================================================ */

function renderVoteResult() {

  const target =
    APP.result?.target ||
    APP.voteTarget;


  const consequence =
    APP.currentGame?.penalty ===
    PENALTIES.LOSER
      ? getConsequence(
          target
        )
      : null;


  return `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          RÉSULTAT
        </div>

        <div class="game-main-text">
          ${escapeHTML(
            target ||
            "Vote terminé."
          )}
        </div>

        <p class="game-subtext">
          Le groupe a choisi cette personne.
        </p>

        ${
          consequence
            ? `
              <div class="secret-subtext">
                ${escapeHTML(
                  consequence
                )}
              </div>
            `
            : ""
        }

      </div>


      <button
        class="primary-btn"
        onclick="finishRound()"
      >
        C'EST FAIT
      </button>

    </section>

  `;

}


/* ============================================================
   RÉSULTAT CHOIX
   ============================================================ */

function renderChoiceResult() {

  return `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          CHOIX
        </div>

        <div class="game-main-text">
          ${escapeHTML(
            APP.selectedChoice
          )}
        </div>

        <p class="game-subtext">
          Le groupe peut maintenant débattre.
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="finishRound()"
      >
        TOUR SUIVANT
      </button>

    </section>

  `;

}


/* ============================================================
   RÉSULTAT GÉNÉRIQUE
   ============================================================ */

function renderGenericResult() {

  return `

    <section class="result-screen">

      <div class="result-card">

        <div class="game-label">
          TERMINÉ
        </div>

        <div class="game-main-text">
          Tour terminé.
        </div>

      </div>


      <button
        class="primary-btn"
        onclick="finishRound()"
      >
        TOUR SUIVANT
      </button>

    </section>

  `;

}


/* ============================================================
   CONSÉQUENCE
   ============================================================ */

function getConsequence(player) {

  if (
    typeof CONFIG !==
    "undefined" &&
    CONFIG.PENALTIES?.DEFAULT
  ) {

    return CONFIG.PENALTIES.DEFAULT;

  }

  return "1 gorgée ou une alternative sans alcool";

}


/* ============================================================
   FIN DU TOUR
   ============================================================ */

function finishRound() {

  stopTimer();

  startNextRound();

}


/* ============================================================
   TIMER
   ============================================================ */

function startGameTimerIfNeeded() {

  const game =
    APP.currentGame;


  if (
    !game?.timer
  ) {

    return;

  }


  startTimer(
    game.timer,
    () => {

      actionDone();

    }
  );

}


function startTimer(
  seconds,
  callback
) {

  stopTimer();


  APP.timerRemaining =
    Number(seconds) || 0;


  if (
    APP.timerRemaining <= 0
  ) {

    return;

  }


  APP.timer =
    setInterval(
      () => {

        APP.timerRemaining--;


        if (
          APP.timerRemaining <= 0
        ) {

          stopTimer();


          if (
            typeof callback ===
            "function"
          ) {

            callback();

          }

          return;

        }


        render();

      },
      1000
    );

}


function stopTimer() {

  if (
    APP.timer
  ) {

    clearInterval(
      APP.timer
    );

    APP.timer =
      null;

  }


  APP.timerRemaining =
    0;

}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

  const old =
    document.querySelector(
      ".toast"
    );


  if (old) {
    old.remove();
  }


  const toast =
    document.createElement(
      "div"
    );


  toast.className =
    "toast";


  toast.textContent =
    message;


  document.body.appendChild(
    toast
  );


  clearTimeout(
    APP.toastTimer
  );


  APP.toastTimer =
    setTimeout(
      () => {

        toast.remove();

      },
      2500
    );

}


/* ============================================================
   DEBUG
   ============================================================ */

window.SOIRE_DEBUG = {

  app:
    APP,

  games:
    () =>
      typeof GAMES !==
      "undefined"
        ? GAMES
        : [],

  questions:
    () =>
      typeof QUESTIONS !==
      "undefined"
        ? QUESTIONS
        : {},

  currentPhase:
    () =>
      getCurrentPhase(),

  currentGame:
    () =>
      APP.currentGame,

  validateGames:
    () =>
      typeof validateGames ===
      "function"
        ? validateGames()
        : null

};
