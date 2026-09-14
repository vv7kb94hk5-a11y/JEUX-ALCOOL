/* ============================================================
   SOIRÉE — APPLICATION ENGINE
   BUILD 08.6
   ============================================================

   OBJECTIF
   --------
   Un jeu doit être rapide à comprendre et rapide à jouer.

   NOUVEAU FLOW :

   JEU NORMAL
   ──────────
   ACTION
      ↓
   RÉSOLUTION

   JEU SECRET
   ──────────
   PASSE LE TÉLÉPHONE
      ↓
   SECRET + CONSIGNE
      ↓
   RÉUSSITE ?

   IMPORTANT
   ---------
   PENALTY n'est jamais un écran supplémentaire.
   La conséquence apparaît dans l'écran de résolution.

   RETURN_PHONE est supprimé.
   RESULT est supprimé.
   NEXT est supprimé.
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

  selectedPlayers: [],

  votes: {},

  result: null,

  success: null,

  consequence: null,

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

    const data = {

      players:
        APP.players,

      intensity:
        APP.intensity,

      round:
        APP.round,

      history:
        APP.history.slice(-30),

      playerHistory:
        APP.playerHistory,

      recentFamilies:
        APP.recentFamilies

    };

    localStorage.setItem(
      CONFIG.SESSION.STORAGE_KEY,
      JSON.stringify(data)
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
        data.players;
    }

    if (data.intensity) {

      APP.intensity =
        data.intensity;
    }

    if (
      Array.isArray(data.history)
    ) {
      APP.history =
        data.history;
    }

    if (data.playerHistory) {

      APP.playerHistory =
        data.playerHistory;
    }

    if (
      Array.isArray(data.recentFamilies)
    ) {

      APP.recentFamilies =
        data.recentFamilies;
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

  APP.playerHistory = {};

  APP.recentFamilies = [];

  APP.round = 0;
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


function getRandomPlayer(exclude = []) {

  const blocked =
    new Set(
      Array.isArray(exclude)
        ? exclude
        : [exclude]
    );

  const available =
    APP.players.filter(
      player =>
        !blocked.has(player)
    );

  return randomItem(
    available
  );
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function setScreen(screen) {

  APP.screen =
    screen;

  saveSession();

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

  APP.selectedPlayers =
    [];

  APP.votes =
    {};

  APP.result =
    null;

  APP.success =
    null;

  APP.consequence =
    null;

  if (
    typeof resetGameFlow ===
    "function"
  ) {

    resetGameFlow();
  }
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


    case "GAME":

      root.innerHTML =
        renderGame();

      break;


    case "PASS_SECRET":

      root.innerHTML =
        renderPassSecret();

      break;


    case "SECRET_ACTION":

      root.innerHTML =
        renderSecretAction();

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

    <section class="screen home-screen">

      <div class="screen-inner">

        <div class="screen-main">

          <p class="eyebrow">
            PARTY GAME
          </p>

          <h1 class="logo">
            SOIRÉE
          </h1>

          <p class="subtitle">
            Des jeux rapides, du bluff,
            des défis et des secrets.
          </p>

        </div>

        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="openPlayers()"
          >
            LANCER LA SOIRÉE
          </button>

        </div>

      </div>

    </section>

  `;
}


/* ============================================================
   JOUEURS
   ============================================================ */

function openPlayers() {

  APP.screen =
    "PLAYERS";

  render();
}


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
                class="remove-player"
                onclick="removePlayer(${index})"
              >
                ×
              </button>

            </div>

          `
        ).join("")

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
          >
            ‹
          </button>

          <span class="muted">
            ${APP.players.length}/12
          </span>

        </header>


        <div class="screen-main">

          <p class="eyebrow">
            ÉTAPE 1
          </p>

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
    .forEach(input => {

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
    });
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


  const unique =
    new Set(
      APP.players.map(
        p => p.toLowerCase()
      )
    );


  if (
    unique.size !==
    APP.players.length
  ) {

    showToast(
      "Chaque joueur doit avoir un prénom différent."
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

function renderIntensity() {

  const choices = [

    {
      id: "COOL",
      title: "COOL",
      text:
        "Tranquille, drôle et accessible."
    },

    {
      id: "CLASSIQUE",
      title: "CLASSIQUE",
      text:
        "Le meilleur équilibre pour une soirée."
    },

    {
      id: "CHAUD",
      title: "CHAUD",
      text:
        "Plus personnel, plus risqué, plus intense."
    },

    {
      id: "CHAOS",
      title: "CHAOS",
      text:
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

          <p class="eyebrow">
            ÉTAPE 2
          </p>

          <h1 class="title">
            Quelle ambiance ?
          </h1>

          <p class="subtitle">
            L'intensité influence les jeux proposés.
          </p>


          <div class="intensity-list">

            ${choices.map(
              choice => `

                <button
                  class="
                    intensity-card
                    ${
                      APP.intensity ===
                      choice.id
                        ? "selected"
                        : ""
                    }
                  "
                  onclick="
                    selectIntensity('${choice.id}')
                  "
                >

                  <strong>
                    ${choice.title}
                  </strong>

                  <span>
                    ${choice.text}
                  </span>

                </button>

              `
            ).join("")}

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

  APP.intensity =
    intensity;

  render();
}


/* ============================================================
   LANCEMENT
   ============================================================ */

function launchParty() {

  APP.sessionStarted =
    true;

  APP.round =
    0;

  saveSession();

  startNextRound();
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
   SÉLECTION DU JEU
   ============================================================ */

function getEligibleGames() {

  if (
    typeof GAMES === "undefined" ||
    !Array.isArray(GAMES)
  ) {

    return [];
  }


  return GAMES.filter(
    game => {

      if (!game) {
        return false;
      }


      if (
        game.minPlayers &&
        APP.players.length <
        game.minPlayers
      ) {

        return false;
      }


      if (
        game.maxPlayers &&
        APP.players.length >
        game.maxPlayers
      ) {

        return false;
      }


      if (
        game.contentPool &&
        typeof QUESTIONS !==
        "undefined"
      ) {

        if (
          !Array.isArray(
            QUESTIONS[
              game.contentPool
            ]
          )
        ) {

          return false;
        }
      }


      return true;
    }
  );
}


function chooseGame() {

  const games =
    getEligibleGames();


  if (!games.length) {

    return null;
  }


  /*
    On évite les jeux récemment joués.
  */

  const recent =
    new Set(
      APP.history.slice(-5)
    );


  let candidates =
    games.filter(
      game =>
        !recent.has(game.id)
    );


  if (!candidates.length) {

    candidates =
      games;
  }


  /*
    On évite autant que possible
    de répéter immédiatement
    la même famille.
  */

  if (
    APP.recentFamilies.length
  ) {

    const lastFamily =
      APP.recentFamilies[
        APP.recentFamilies.length - 1
      ];

    const different =
      candidates.filter(
        game =>
          game.family !==
          lastFamily
      );

    if (different.length) {

      candidates =
        different;
    }
  }


  return randomItem(
    candidates
  );
}


/* ============================================================
   NOUVEAU TOUR
   ============================================================ */

function startNextRound() {

  stopTimer();

  resetCurrentTurn();

  const game =
    chooseGame();


  if (!game) {

    showToast(
      "Aucun jeu disponible."
    );

    return;
  }


  APP.round++;

  APP.currentGame =
    game;


  if (
    !APP.history.includes(
      game.id
    )
  ) {

    APP.history.push(
      game.id
    );

  } else {

    APP.history.push(
      game.id
    );
  }


  APP.history =
    APP.history.slice(-30);


  APP.recentFamilies.push(
    game.family
  );

  APP.recentFamilies =
    APP.recentFamilies.slice(-3);


  prepareGame(game);

  saveSession();

  renderGameFlow();
}


/* ============================================================
   PRÉPARATION DU JEU
   ============================================================ */

function prepareGame(game) {

  const pool =
    typeof QUESTIONS !==
    "undefined"
      ? QUESTIONS[
          game.contentPool
        ]
      : [];


  APP.currentContent =
    randomItem(pool);


  /*
    ACTOR
  */

  if (
    game.actor ===
    ACTOR_MODES.RANDOM
  ) {

    APP.currentActor =
      getRandomPlayer();

  }


  /*
    TARGET
  */

  if (
    game.target ===
    TARGET_MODES.ONE
  ) {

    APP.currentTarget =
      getRandomPlayer(
        APP.currentActor
          ? [APP.currentActor]
          : []
      );

    /*
      Pour les jeux où le target
      est aussi l'acteur.
    */

    if (
      game.actor ===
      ACTOR_MODES.TARGET
    ) {

      APP.currentActor =
        APP.currentTarget;
    }
  }


  /*
    DEUX JOUEURS
  */

  if (
    game.target ===
    TARGET_MODES.TWO
  ) {

    APP.currentPlayers =
      shuffle(
        APP.players
      ).slice(0, 2);

    APP.currentPair =
      APP.currentPlayers;

    APP.currentActor =
      APP.currentPlayers[0];

    APP.currentTarget =
      APP.currentPlayers[1];
  }


  /*
    TOUS
  */

  if (
    game.target ===
    TARGET_MODES.ALL
  ) {

    APP.currentPlayers =
      [...APP.players];
  }


  /*
    Synchronisation moteur.
  */

  if (
    typeof resetGameFlow ===
    "function"
  ) {

    resetGameFlow();

    startGameFlow(game);

    setGameActorIfPossible();

    setGameTargetIfPossible();
  }
}


function setGameActorIfPossible() {

  if (
    APP.currentActor &&
    typeof setGameActor ===
    "function"
  ) {

    setGameActor(
      APP.currentActor
    );
  }
}


function setGameTargetIfPossible() {

  if (
    APP.currentTarget &&
    typeof setGameTarget ===
    "function"
  ) {

    setGameTarget(
      APP.currentTarget
    );
  }
}


/* ============================================================
   FLOW
   ============================================================ */

function renderGameFlow() {

  const game =
    APP.currentGame;


  if (!game) {

    startNextRound();

    return;
  }


  /*
    IMPORTANT :

    On ignore les phases techniques
    qui ne doivent jamais devenir
    des écrans.

    PENALTY est traité dans RESOLVE.
  */

  let phase =
    typeof getCurrentGamePhase ===
    "function"
      ? getCurrentGamePhase()
      : game.flow?.[0];


  while (
    phase ===
      FLOW_PHASES.PENALTY ||
    phase === "RETURN_PHONE" ||
    phase === "SECRET_REVEAL" ||
    phase === "RESULT" ||
    phase === "NEXT" ||
    phase === "PLAY"
  ) {

    phase =
      typeof nextGamePhase ===
      "function"
        ? nextGamePhase()
        : null;


    if (!phase) {
      break;
    }
  }


  /*
    INTRO n'est conservé que
    pour les jeux qui en ont
    réellement besoin.
  */

  if (
    phase === FLOW_PHASES.INTRO
  ) {

    APP.screen =
      "GAME";

    render();

    return;
  }


  if (
    phase ===
    FLOW_PHASES.SELECT_TARGET
  ) {

    /*
      Dans cette version,
      les jeux individuels ont
      une cible déterminée
      automatiquement.

      On affiche directement
      l'action.

      Cela évite un écran
      supplémentaire.
    */

    nextGamePhase();

    renderGameFlow();

    return;
  }


  if (
    phase ===
    FLOW_PHASES.SELECT_PLAYERS
  ) {

    nextGamePhase();

    renderGameFlow();

    return;
  }


  if (
    phase ===
    FLOW_PHASES.PASS_SECRET
  ) {

    APP.screen =
      "PASS_SECRET";

    render();

    return;
  }


  if (
    phase ===
    FLOW_PHASES.SECRET_ACTION
  ) {

    APP.screen =
      "SECRET_ACTION";

    render();

    return;
  }


  if (
    phase === FLOW_PHASES.ACTION
  ) {

    APP.screen =
      "ACTION";

    render();

    return;
  }


  if (
    phase === FLOW_PHASES.VOTE
  ) {

    APP.screen =
      "VOTE";

    render();

    return;
  }


  if (
    phase === FLOW_PHASES.RESOLVE
  ) {

    APP.screen =
      "RESOLVE";

    render();

    return;
  }


  if (
    phase === FLOW_PHASES.SUCCESS_CHECK
  ) {

    APP.screen =
      "RESOLVE";

    render();

    return;
  }


  /*
    Sécurité.
  */

  APP.screen =
    "RESOLVE";

  render();
}


/* ============================================================
   INTRO
   ============================================================ */

function renderGame() {

  const game =
    APP.currentGame;


  if (!game) {

    startNextRound();

    return "";
  }


  return `

    <section class="screen">

      <div class="screen-inner">

        <header class="screen-header">

          <span class="round-label">
            TOUR ${APP.round}
          </span>

        </header>


        <div class="screen-main centered">

          <p class="eyebrow">
            ${escapeHTML(
              game.family || "JEU"
            )}
          </p>

          <h1 class="title">
            ${escapeHTML(
              game.name
            )}
          </h1>

          <div class="game-card">

            ${renderContentPreview()}

          </div>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="advanceFromIntro()"
          >
            COMMENCER
          </button>

        </div>

      </div>

    </section>

  `;
}


function renderContentPreview() {

  const content =
    APP.currentContent;


  if (!content) {

    return `
      <p>
        Préparez-vous.
      </p>
    `;
  }


  if (
    typeof content ===
    "string"
  ) {

    return `
      <p class="game-prompt">
        ${escapeHTML(content)}
      </p>
    `;
  }


  return `
    <p class="game-prompt">
      ${escapeHTML(
        content.question ||
        content.text ||
        content.instruction ||
        content.word ||
        "Préparez-vous."
      )}
    </p>
  `;
}


function advanceFromIntro() {

  const phase =
    getCurrentGamePhaseSafe();


  if (
    phase ===
    FLOW_PHASES.INTRO
  ) {

    nextGamePhaseSafe();

    renderGameFlow();

    return;
  }


  renderGameFlow();
}


/* ============================================================
   PASSAGE TÉLÉPHONE
   ============================================================ */

function renderPassSecret() {

  const target =
    APP.currentTarget ||
    APP.currentActor;


  return `

    <section class="
      screen
      private-transition-screen
    ">

      <div class="screen-inner">


        <div class="screen-main centered">

          <div class="phone-icon">
            📱
          </div>


          <p class="eyebrow">
            TÉLÉPHONE
          </p>


          <h1 class="title">
            Passe le téléphone à
            <strong>
              ${escapeHTML(
                target || "la personne"
              )}
            </strong>
          </h1>


          <p class="subtitle">
            Personne d'autre ne doit regarder l'écran.
          </p>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="phoneInHand()"
          >
            TÉLÉPHONE EN MAIN
          </button>

        </div>


      </div>

    </section>

  `;
}


function phoneInHand() {

  nextGamePhaseSafe();

  renderGameFlow();
}


/* ============================================================
   SECRET + ACTION
   ============================================================ */

function renderSecretAction() {

  const game =
    APP.currentGame;

  const content =
    APP.currentContent;

  const target =
    APP.currentTarget ||
    APP.currentActor;


  let title = "";
  let instruction = "";


  if (
    game.contentPool ===
    "EXPRESSION"
  ) {

    title =
      content;

    instruction =
      "Fais deviner cette expression sans la prononcer.";
  }


  else if (
    game.contentPool ===
    "GUESS_WORD"
  ) {

    title =
      content?.word ||
      "";

    instruction =
      content?.hint
        ? `Fais deviner ce mot. Indice : ${content.hint}`
        : "Fais deviner ce mot sans le prononcer.";
  }


  else if (
    game.contentPool ===
    "DESCRIPTION"
  ) {

    title =
      content?.word ||
      "";

    instruction =
      content?.rule ||
      "Fais deviner ce mot.";
  }


  else if (
    game.contentPool ===
    "MIME"
  ) {

    title =
      content;

    instruction =
      "Fais deviner uniquement avec des gestes.";
  }


  else if (
    game.contentPool ===
    "FORBIDDEN_WORD"
  ) {

    title =
      content?.word ||
      "";

    instruction =
      content?.forbidden
        ? `Ne prononce surtout pas : ${content.forbidden}`
        : "Évite le mot interdit.";
  }


  else if (
    game.contentPool ===
    "TRAP_WORD"
  ) {

    title =
      content?.word ||
      "";

    instruction =
      content?.forbidden
        ? `Piège : ${content.forbidden}`
        : "Tends ton piège au groupe.";
  }


  else if (
    game.contentPool ===
    "MISSION"
  ) {

    title =
      content;

    instruction =
      "Accomplis cette mission sans te faire griller.";
  }


  else if (
    game.contentPool ===
    "TRAP_PROMPT"
  ) {

    title =
      "LE PIÈGE";

    instruction =
      content;
  }


  else {

    title =
      content?.text ||
      content?.instruction ||
      content ||
      game.name;

    instruction =
      content?.rule ||
      "Réalise le défi.";
  }


  return `

    <section class="
      screen
      secret-screen
    ">

      <div class="screen-inner">


        <div class="screen-main centered">

          <p class="eyebrow">
            SECRET
          </p>


          <h1 class="title">
            ${escapeHTML(title)}
          </h1>


          <div class="game-card">

            <p class="game-prompt">
              ${escapeHTML(
                instruction
              )}
            </p>

          </div>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="secretSeen()"
          >
            C'EST BON
          </button>

        </div>


      </div>

    </section>

  `;
}


function secretSeen() {

  /*
    Pour une mission secrète,
    il n'y a pas de résolution
    immédiate.
  */

  if (
    APP.currentGame?.id ===
    "G015"
  ) {

    finishSecretMission();

    return;
  }


  /*
    Pour les autres jeux,
    on passe directement à
    la résolution OUI / NON.

    Aucun écran "rends le téléphone".
  */

  nextGamePhaseSafe();

  renderGameFlow();
}


function finishSecretMission() {

  APP.result = {

    type: "MISSION_STARTED",

    player:
      APP.currentTarget ||
      APP.currentActor

  };


  /*
    Retour immédiat au prochain
    tour : la mission continue
    dans la vraie soirée.
  */

  startNextRound();
}


/* ============================================================
   ACTION PUBLIQUE
   ============================================================ */

function renderAction() {

  const game =
    APP.currentGame;

  const content =
    APP.currentContent;


  let title =
    game.name;

  let prompt = "";


  if (
    typeof content ===
    "string"
  ) {

    prompt =
      content;
  }

  else if (
    content?.question
  ) {

    prompt =
      content.question;
  }

  else if (
    content?.text
  ) {

    prompt =
      content.text;
  }

  else if (
    content?.instruction
  ) {

    prompt =
      content.instruction;
  }

  else if (
    content?.word
  ) {

    prompt =
      content.word;
  }


  /*
    Question chaude
  */

  if (
    game.contentPool ===
    "HOT"
  ) {

    title =
      APP.currentTarget ||
      APP.currentActor;

    prompt =
      content?.text ||
      "";
  }


  /*
    Choix impossible
  */

  if (
    game.contentPool ===
    "CHOICE"
  ) {

    prompt =
      content?.question ||
      "";

    return renderChoiceAction(
      title,
      prompt,
      content?.choices || []
    );
  }


  return `

    <section class="screen">

      <div class="screen-inner">


        <div class="screen-main centered">

          <p class="eyebrow">
            ${escapeHTML(
              game.family ||
              "DÉFI"
            )}
          </p>


          <h1 class="title">
            ${escapeHTML(
              title
            )}
          </h1>


          <div class="game-card">

            <p class="game-prompt">
              ${escapeHTML(
                prompt
              )}
            </p>

          </div>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="actionDone()"
          >
            TERMINÉ
          </button>

        </div>


      </div>

    </section>

  `;
}


function actionDone() {

  const phase =
    getCurrentGamePhaseSafe();


  /*
    Jeux qui nécessitent
    une validation OUI / NON.
  */

  if (
    phase ===
    FLOW_PHASES.SUCCESS_CHECK
  ) {

    renderGameFlow();

    return;
  }


  nextGamePhaseSafe();

  renderGameFlow();
}


/* ============================================================
   CHOIX
   ============================================================ */

function renderChoiceAction(
  title,
  prompt,
  choices
) {

  return `

    <section class="screen">

      <div class="screen-inner">

        <div class="screen-main">

          <p class="eyebrow">
            CHOIX
          </p>

          <h1 class="title">
            ${escapeHTML(
              prompt
            )}
          </h1>


          <div class="choice-list">

            ${choices.map(
              (choice, index) => `

                <button
                  class="choice-button"
                  onclick="
                    chooseChoice(${index})
                  "
                >
                  ${escapeHTML(choice)}
                </button>

              `
            ).join("")}

          </div>

        </div>

      </div>

    </section>

  `;
}


function chooseChoice(index) {

  const choices =
    APP.currentContent?.choices ||
    [];

  APP.selectedChoice =
    choices[index] ||
    null;


  APP.result = {

    type: "CHOICE",

    choice:
      APP.selectedChoice

  };


  nextGamePhaseSafe();

  renderGameFlow();
}


/* ============================================================
   VOTE
   ============================================================ */

function renderVote() {

  const game =
    APP.currentGame;

  const content =
    APP.currentContent;


  let prompt =
    typeof content ===
    "string"
      ? content
      : (
          content?.question ||
          content?.text ||
          content?.instruction ||
          "Qui choisissez-vous ?"
        );


  const players =
    APP.players;


  return `

    <section class="screen">

      <div class="screen-inner">


        <div class="screen-main">

          <p class="eyebrow">
            VOTE
          </p>


          <h1 class="title">
            ${escapeHTML(
              prompt
            )}
          </h1>


          <p class="subtitle">
            Désignez la personne choisie
            par le groupe.
          </p>


          <div class="vote-list">

            ${players.map(
              player => `

                <button
                  class="vote-button"
                  onclick="
                    registerVote('${escapeHTML(player)}')
                  "
                >
                  ${escapeHTML(player)}
                </button>

              `
            ).join("")}

          </div>

        </div>


      </div>

    </section>

  `;
}


function registerVote(player) {

  if (
    !APP.players.includes(
      player
    )
  ) {

    return;
  }


  /*
    Pour un vote de groupe,
    l'application demande une
    confirmation du choix collectif.

    On ne considère PAS le premier
    clic comme le résultat.
  */

  APP.votes[player] =
    (
      APP.votes[player] ||
      0
    ) + 1;


  /*
    Ici, le groupe valide
    explicitement le résultat.

    Pour éviter le faux vote
    "un clic = résultat",
    on utilise un écran de
    confirmation très court.
  */

  APP.currentTarget =
    player;


  APP.result = {

    type: "VOTE_PENDING",

    player,

    votes:
      APP.votes[player]

  };


  renderVoteConfirmation();
}


function renderVoteConfirmation() {

  const target =
    APP.currentTarget;


  const count =
    APP.votes[target] ||
    1;


  const players =
    APP.players.length;


  return `

    <section class="screen">

      <div class="screen-inner">


        <div class="screen-main centered">

          <p class="eyebrow">
            VOTE
          </p>


          <h1 class="title">
            ${escapeHTML(target)}
          </h1>


          <p class="subtitle">
            Le groupe confirme ce choix ?
          </p>


          <div class="game-card">

            <strong>
              ${count} vote${count > 1 ? "s" : ""}
            </strong>

          </div>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="confirmVote()"
          >
            CONFIRMER
          </button>


          <button
            class="secondary-button"
            onclick="cancelVote()"
          >
            CHANGER
          </button>

        </div>


      </div>

    </section>

  `;
}


function confirmVote() {

  const target =
    APP.currentTarget;


  if (!target) {
    return;
  }


  APP.result = {

    type: "VOTE",

    target,

    votes:
      APP.votes[target] ||
      1

  };


  /*
    Le perdant est la cible
    du vote.
  */

  if (
    APP.currentGame?.penalty ===
    PENALTIES.LOSER
  ) {

    APP.currentTarget =
      target;
  }


  nextGamePhaseSafe();

  renderGameFlow();
}


function cancelVote() {

  APP.currentTarget =
    null;

  render();
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function renderResolve() {

  const game =
    APP.currentGame;


  /*
    ------------------------------------------------------------
    QUESTION OUI / NON
    ------------------------------------------------------------
  */

  if (
    getCurrentGamePhaseSafe() ===
    FLOW_PHASES.SUCCESS_CHECK
  ) {

    const player =
      APP.currentActor ||
      APP.currentTarget;


    return `

      <section class="screen">

        <div class="screen-inner">


          <div class="screen-main centered">

            <p class="eyebrow">
              À TOI
            </p>


            <h1 class="title">
              ${escapeHTML(
                player ||
                "Alors ?"
              )}
            </h1>


            <div class="game-card">

              <p class="game-prompt">
                Tu as réussi ?
              </p>

            </div>

          </div>


          <div class="screen-footer">

            <button
              class="primary-button"
              onclick="resolveSuccess(true)"
            >
              OUI
            </button>


            <button
              class="secondary-button"
              onclick="resolveSuccess(false)"
            >
              NON
            </button>

          </div>


        </div>

      </section>

    `;
  }


  /*
    ------------------------------------------------------------
    RÉSULTAT
    ------------------------------------------------------------
  */

  return renderFinalResolve(
    game
  );
}


function resolveSuccess(success) {

  APP.success =
    Boolean(success);


  const player =
    APP.currentActor ||
    APP.currentTarget;


  if (
    success
  ) {

    APP.result = {

      type:
        "SUCCESS",

      player,

      success:
        true

    };

    APP.consequence =
      null;

  } else {

    APP.result = {

      type:
        "FAILURE",

      player,

      success:
        false

    };

    APP.consequence =
      getConsequence(
        player
      );
  }


  render();
}


function renderFinalResolve(game) {

  const player =
    APP.result?.player ||
    APP.currentActor ||
    APP.currentTarget;


  /*
    Succès
  */

  if (
    APP.result?.type ===
    "SUCCESS"
  ) {

    return `

      <section class="screen">

        <div class="screen-inner">


          <div class="screen-main centered">

            <p class="eyebrow">
              RÉUSSI
            </p>


            <h1 class="title">
              Bien joué.
            </h1>


            <p class="subtitle">
              ${escapeHTML(
                player || ""
              )}
              a réussi.
            </p>

          </div>


          <div class="screen-footer">

            <button
              class="primary-button"
              onclick="finishRound()"
            >
              TOUR SUIVANT
            </button>

          </div>


        </div>

      </section>

    `;
  }


  /*
    Échec / conséquence
  */

  if (
    APP.result?.type ===
    "FAILURE"
  ) {

    return `

      <section class="screen">

        <div class="screen-inner">


          <div class="screen-main centered">

            <p class="eyebrow">
              CONSÉQUENCE
            </p>


            <h1 class="title">
              ${escapeHTML(
                player || ""
              )}
            </h1>


            <div class="game-card consequence-card">

              <p class="game-prompt">
                ${escapeHTML(
                  APP.consequence
                )}
              </p>

            </div>

          </div>


          <div class="screen-footer">

            <button
              class="primary-button"
              onclick="finishRound()"
            >
              C'EST FAIT
            </button>

          </div>


        </div>

      </section>

    `;
  }


  /*
    Résultat d'un vote
  */

  if (
    APP.result?.type ===
    "VOTE"
  ) {

    return `

      <section class="screen">

        <div class="screen-inner">


          <div class="screen-main centered">

            <p class="eyebrow">
              RÉSULTAT
            </p>


            <h1 class="title">
              ${escapeHTML(
                APP.result.target
              )}
            </h1>


            <p class="subtitle">
              Le groupe a choisi
              cette personne.
            </p>


            ${
              game?.penalty ===
              PENALTIES.LOSER

                ? `

                  <div class="game-card consequence-card">

                    <p class="game-prompt">
                      ${escapeHTML(
                        getConsequence(
                          APP.result.target
                        )
                      )}
                    </p>

                  </div>

                `

                : ""
            }

          </div>


          <div class="screen-footer">

            <button
              class="primary-button"
              onclick="finishRound()"
            >
              C'EST FAIT
            </button>

          </div>


        </div>

      </section>

    `;
  }


  /*
    Résolution générique
  */

  return `

    <section class="screen">

      <div class="screen-inner">


        <div class="screen-main centered">

          <p class="eyebrow">
            TERMINÉ
          </p>


          <h1 class="title">
            Tour terminé.
          </h1>

        </div>


        <div class="screen-footer">

          <button
            class="primary-button"
            onclick="finishRound()"
          >
            TOUR SUIVANT
          </button>

        </div>


      </div>

    </section>

  `;
}


/* ============================================================
   CONSÉQUENCE
   ============================================================ */

function getConsequence(player) {

  const name =
    player || "La personne concernée";


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

function startTimer(seconds, callback) {

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

  if (APP.timer) {

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
   HELPERS GAME FLOW
   ============================================================ */

function getCurrentGamePhaseSafe() {

  if (
    typeof getCurrentGamePhase ===
    "function"
  ) {

    return getCurrentGamePhase();
  }

  return APP.currentGame?.flow?.[0] ||
    null;
}


function nextGamePhaseSafe() {

  if (
    typeof nextGamePhase ===
    "function"
  ) {

    return nextGamePhase();
  }

  return null;
}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

  const existing =
    document.querySelector(
      ".toast"
    );


  if (existing) {
    existing.remove();
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

  flow:
    () =>
      typeof debugGameFlow ===
      "function"
        ? debugGameFlow()
        : null,

  validate:
    () =>
      typeof validateGamesDatabase ===
      "function"
        ? validateGamesDatabase()
        : null

};
