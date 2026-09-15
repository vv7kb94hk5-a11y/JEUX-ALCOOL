/* ============================================================
   SOIRÉE — APP
   BUILD 08.9
   ============================================================

   ARCHITECTURE

   PUBLIC AVEC VOTE
   ACTION → VOTE → RESOLVE

   PUBLIC SIMPLE
   ACTION → SUCCESS_CHECK
   ou
   ACTION → RESOLVE

   SECRET
   PASS_SECRET → SECRET_ACTION → SUCCESS_CHECK

   MISSION SECRÈTE
   PASS_SECRET → SECRET_ACTION

   AUCUNE PHASE TECHNIQUE AFFICHÉE :
   - INTRO
   - SELECT_TARGET
   - SELECT_PLAYERS
   - PENALTY
   - RETURN_PHONE
   - RESULT
   - NEXT
   - PLAY

   ============================================================ */


const APP_VERSION = "08.9";

const app = document.getElementById("app");


/* ============================================================
   SESSION
   ============================================================ */

const session = {

  players: [],

  intensity: "CLASSIQUE",

  screen: "HOME",

  history: [],

  playerHistory: [],

  currentGame: null,

  currentContent: null,

  currentTargets: [],

  currentActor: null,

  currentPair: [],

  currentPhase: null,

  round: 0,

  votes: [],

  selectedChoice: null,

  success: null,

  consequence: null,

  timer: null,

  timerRemaining: null,

  actionLocked: false
};


/* ============================================================
   UTILITAIRES
   ============================================================ */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

  return [...array].sort(
    () => Math.random() - 0.5
  );
}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

function saveSession() {

  if (
    !CONFIG?.SESSION?.SAVE_TO_LOCAL_STORAGE
  ) {
    return;
  }

  try {

    localStorage.setItem(
      CONFIG.SESSION.STORAGE_KEY,
      JSON.stringify({

        players:
          session.players,

        intensity:
          session.intensity,

        history:
          session.history.slice(
            -CONFIG.SESSION.MAX_HISTORY
          ),

        playerHistory:
          session.playerHistory.slice(-20)

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

  if (
    !CONFIG?.SESSION?.SAVE_TO_LOCAL_STORAGE
  ) {
    return;
  }

  try {

    const raw =
      localStorage.getItem(
        CONFIG.SESSION.STORAGE_KEY
      );

    if (!raw) {
      return;
    }

    const saved =
      JSON.parse(raw);

    if (
      Array.isArray(
        saved.players
      )
    ) {

      session.players =
        saved.players;
    }

    if (
      saved.intensity &&
      CONFIG.INTENSITY[saved.intensity]
    ) {

      session.intensity =
        saved.intensity;
    }

    if (
      Array.isArray(
        saved.history
      )
    ) {

      session.history =
        saved.history;
    }

    if (
      Array.isArray(
        saved.playerHistory
      )
    ) {

      session.playerHistory =
        saved.playerHistory;
    }

  } catch (error) {

    console.warn(
      "Session sauvegardée illisible.",
      error
    );
  }
}


/* ============================================================
   NAVIGATION
   ============================================================ */

function navigate(screen) {

  stopTimer();

  session.screen =
    screen;

  render();
}


/* ============================================================
   ROTATION DES JOUEURS
   ============================================================ */

function getAvailablePlayers() {

  const limit =
    CONFIG?.ROTATION?.RECENT_PLAYER_LIMIT ?? 2;

  const recent =
    session.playerHistory.slice(-limit);

  const available =
    session.players.filter(
      player =>
        !recent.includes(player)
    );

  return shuffle(
    available.length
      ? available
      : session.players
  );
}


function choosePlayer() {

  const player =
    randomItem(
      getAvailablePlayers()
    );

  if (player) {

    session.playerHistory.push(
      player
    );
  }

  return player;
}


function chooseTwoPlayers() {

  const available =
    getAvailablePlayers();

  let pair =
    available.slice(0, 2);

  if (pair.length < 2) {

    pair =
      shuffle(
        session.players
      ).slice(0, 2);
  }

  pair.forEach(player => {

    if (player) {

      session.playerHistory.push(
        player
      );
    }

  });

  return pair;
}


/* ============================================================
   SÉLECTION DU JEU
   ============================================================ */

function chooseGame() {

  let candidates =
    GAMES.filter(game => {

      const min =
        game.minPlayers ??
        CONFIG.PLAYERS.MIN;

      const max =
        game.maxPlayers ??
        CONFIG.PLAYERS.MAX;

      if (
        session.players.length < min ||
        session.players.length > max
      ) {

        return false;
      }

      const cooldown =
        game.cooldown ??
        CONFIG.COOLDOWN.GAME;

      if (
        session.history
          .slice(-cooldown)
          .includes(game.id)
      ) {

        return false;
      }

      return true;
    });


  /*
   * Si tous les jeux sont temporairement
   * exclus, on réautorise les jeux compatibles.
   */

  if (!candidates.length) {

    candidates =
      GAMES.filter(game => {

        return (
          session.players.length >=
            (
              game.minPlayers ??
              CONFIG.PLAYERS.MIN
            ) &&

          session.players.length <=
            (
              game.maxPlayers ??
              CONFIG.PLAYERS.MAX
            )
        );
      });
  }


  if (!candidates.length) {

    return null;
  }


  const intensity =
    getIntensityConfig(
      session.intensity
    );


  const recentFamilies =
    session.history
      .slice(-2)
      .map(id => {

        return GAMES.find(
          game =>
            game.id === id
        )?.family;

      })
      .filter(Boolean);


  const scored =
    candidates.map(game => {

      let score = 100;


      /*
       * Intensité
       */

      if (
        typeof game.intensity ===
        "number"
      ) {

        score -=
          Math.abs(
            game.intensity -
            intensity.preferredIntensity
          ) * 20;
      }


      /*
       * Diversité
       */

      const familyCount =
        recentFamilies.filter(
          family =>
            family === game.family
        ).length;


      if (
        familyCount >=
        CONFIG.DIVERSITY.MAX_SAME_FAMILY
      ) {

        score -= 60;
      }


      if (
        session.currentGame?.family ===
        game.family
      ) {

        score -= 20;
      }


      /*
       * Bonus spécial
       */

      if (
        game.family === "IMPRO"
      ) {

        score +=
          10 *
          intensity.chaosMultiplier;
      }


      if (
        game.family === "HOT"
      ) {

        score +=
          15 *
          intensity.hotMultiplier;
      }


      score +=
        Math.random() * 35;


      return {

        game,

        score:
          Math.max(
            1,
            score
          )
      };

    });


  const total =
    scored.reduce(
      (sum, item) =>
        sum + item.score,
      0
    );


  let roll =
    Math.random() *
    total;


  for (
    const item of scored
  ) {

    roll -=
      item.score;

    if (
      roll <= 0
    ) {

      return item.game;
    }
  }


  return scored[0].game;
}


/* ============================================================
   CONTENU
   ============================================================ */

function getContentForGame(game) {

  const pool =
    QUESTIONS[
      game.contentPool
    ];


  if (
    !Array.isArray(pool) ||
    !pool.length
  ) {

    console.warn(
      `Pool introuvable : ${game.contentPool}`
    );

    return null;
  }


  if (
    game.contentPool === "HOT"
  ) {

    const maxIntensity =
      session.intensity === "COOL"
        ? 2
        : 3;

    const filtered =
      pool.filter(item => {

        return (
          typeof item?.intensity !==
            "number" ||

          item.intensity <=
            maxIntensity
        );
      });

    return randomItem(
      filtered.length
        ? filtered
        : pool
    );
  }


  return randomItem(pool);
}


/* ============================================================
   ATTRIBUTION DES RÔLES
   ============================================================ */

function assignRoles(game) {

  session.currentActor =
    null;

  session.currentTargets =
    [];

  session.currentPair =
    [];


  /*
   * IMPORTANT :
   *
   * Les jeux avec VOTE ne reçoivent
   * jamais une cible automatique.
   *
   * Le vote crée la cible.
   */

  const isVote =
    game.flow?.includes(
      FLOW_PHASES.VOTE
    );


  if (!isVote) {

    switch (
      game.target
    ) {

      case TARGET_MODES.ONE: {

        const player =
          choosePlayer();

        session.currentActor =
          player;

        session.currentTargets =
          player
            ? [player]
            : [];

        break;
      }


      case TARGET_MODES.TWO: {

        const pair =
          chooseTwoPlayers();

        session.currentPair =
          pair;

        session.currentTargets =
          [...pair];

        session.currentActor =
          pair[0] || null;

        break;
      }


      case TARGET_MODES.ALL: {

        session.currentTargets =
          [...session.players];

        break;
      }


      case TARGET_MODES.NONE:
      default:

        break;
    }
  }


  /*
   * Acteur RANDOM
   */

  if (
    game.actor ===
    ACTOR_MODES.RANDOM
  ) {

    session.currentActor =
      choosePlayer();
  }


  /*
   * Acteur TARGET
   */

  if (
    game.actor ===
      ACTOR_MODES.TARGET &&
    session.currentTargets.length
  ) {

    session.currentActor =
      session.currentTargets[0];
  }
}


/* ============================================================
   SYNCHRONISATION GAME FLOW
   ============================================================ */

function syncGameFlow() {

  if (
    typeof GAME_FLOW ===
    "undefined"
  ) {

    return;
  }


  if (
    typeof setGameActor ===
    "function"
  ) {

    setGameActor(
      session.currentActor
    );
  }


  if (
    typeof setGameTarget ===
    "function"
  ) {

    /*
     * Pour un vote, la cible sera
     * définie après le choix.
     */

    setGameTarget(
      session.currentTargets[0] ||
      null
    );
  }


  if (
    typeof setParticipants ===
    "function"
  ) {

    setParticipants(
      session.currentPair.length
        ? session.currentPair
        : session.players
    );
  }


  if (
    typeof setVoters ===
    "function"
  ) {

    setVoters(
      session.players
    );
  }


  if (
    typeof setSecretOwner ===
    "function"
  ) {

    setSecretOwner(
      session.currentActor
    );
  }


  if (
    typeof setSecretContent ===
    "function"
  ) {

    setSecretContent(
      session.currentContent
    );
  }
}


/* ============================================================
   PRÉPARATION DU TOUR
   ============================================================ */

function prepareRound() {

  stopTimer();

  const game =
    chooseGame();


  if (!game) {

    return null;
  }


  session.currentGame =
    game;

  session.currentContent =
    getContentForGame(game);

  session.votes =
    [];

  session.selectedChoice =
    null;

  session.success =
    null;

  session.consequence =
    null;

  session.actionLocked =
    false;


  assignRoles(game);


  session.currentPhase =
    game.flow?.[0] ||
    null;


  session.round++;


  session.history.push(
    game.id
  );


  if (
    typeof resetGameVotes ===
    "function"
  ) {

    resetGameVotes();
  }


  if (
    typeof resetGameFlow ===
    "function"
  ) {

    resetGameFlow();
  }


  if (
    typeof startGameFlow ===
    "function"
  ) {

    startGameFlow(
      game,
      session.players
    );
  }


  syncGameFlow();

  saveSession();


  return game;
}


/* ============================================================
   DÉMARRAGE
   ============================================================ */

function startRound() {

  stopTimer();

  if (
    session.players.length <
    CONFIG.PLAYERS.MIN
  ) {

    showToast(
      `Il faut au moins ${CONFIG.PLAYERS.MIN} joueurs.`
    );

    return;
  }


  const game =
    prepareRound();


  if (!game) {

    showToast(
      "Aucun jeu compatible."
    );

    return;
  }


  session.screen =
    "GAME";

  render();
}


/* ============================================================
   PHASE SUIVANTE
   ============================================================ */

function advancePhase() {

  if (
    session.actionLocked
  ) {

    return;
  }


  session.actionLocked =
    true;


  stopTimer();


  let next =
    null;


  if (
    typeof nextGamePhase ===
    "function"
  ) {

    next =
      nextGamePhase();
  }


  if (!next) {

    session.actionLocked =
      false;

    finishRound();

    return;
  }


  session.currentPhase =
    next;


  if (
    typeof GAME_FLOW !==
    "undefined"
  ) {

    if (
      GAME_FLOW.actor
    ) {

      session.currentActor =
        GAME_FLOW.actor;
    }


    if (
      GAME_FLOW.target
    ) {

      session.currentTargets =
        [
          GAME_FLOW.target
        ];
    }
  }


  session.actionLocked =
    false;

  render();
}


/* ============================================================
   FIN DU TOUR
   ============================================================ */

function finishRound() {

  stopTimer();

  session.currentPhase =
    null;

  session.currentContent =
    null;

  session.currentTargets =
    [];

  session.currentActor =
    null;

  session.currentPair =
    [];

  session.votes =
    [];

  session.selectedChoice =
    null;

  session.success =
    null;

  session.consequence =
    null;

  session.actionLocked =
    false;


  if (
    typeof clearPrivateContent ===
    "function"
  ) {

    clearPrivateContent();
  }


  /*
   * Tour suivant immédiatement.
   */

  startRound();
}


/* ============================================================
   RENDU GLOBAL
   ============================================================ */

function render() {

  switch (
    session.screen
  ) {

    case "HOME":
      return renderHome();

    case "PLAYERS":
      return renderPlayers();

    case "INTENSITY":
      return renderIntensity();

    case "OPTIONS":
      return renderOptions();

    case "GAME":
      return renderGame();

    default:

      session.screen =
        "HOME";

      return renderHome();
  }
}


/* ============================================================
   ACCUEIL
   ============================================================ */

function renderHome() {

  app.innerHTML = `

    <section class="screen home">

      <div class="brand">
        SOIRÉE
      </div>

      <div class="subtitle">
        PARTY GAME
      </div>

      <div class="home-spacer"></div>

      <button
        class="primary-btn"
        onclick="navigate('PLAYERS')"
      >
        JOUER
      </button>

      <button
        class="secondary-btn"
        onclick="navigate('OPTIONS')"
      >
        OPTIONS
      </button>

      ${
        session.players.length
          ? `
            <p class="muted">
              ${session.players.length}
              joueurs enregistrés
            </p>
          `
          : ""
      }

    </section>
  `;
}


/* ============================================================
   JOUEURS
   ============================================================ */

function renderPlayers() {

  const rows =
    session.players
      .map(
        (player, index) => `

          <div class="player-row">

            <span>
              ${escapeHTML(player)}
            </span>

            <button
              class="icon-btn"
              aria-label="Supprimer ${escapeHTML(player)}"
              onclick="removePlayer(${index})"
            >
              ×
            </button>

          </div>
        `
      )
      .join("");


  app.innerHTML = `

    <section class="screen players-screen">

      <header class="screen-header">

        <button
          class="back-btn"
          onclick="navigate('HOME')"
        >
          ‹
        </button>

        <h1>
          JOUEURS
        </h1>

        <span></span>

      </header>


      <div class="count">
        ${session.players.length}/${CONFIG.PLAYERS.MAX}
      </div>


      <div class="player-list">

        ${
          rows ||
          `
            <div class="empty">
              Ajoute les personnes présentes.
            </div>
          `
        }

      </div>


      <button
        class="secondary-btn"
        ${
          session.players.length >=
          CONFIG.PLAYERS.MAX
            ? "disabled"
            : ""
        }
        onclick="openPlayerModal()"
      >
        + AJOUTER UN JOUEUR
      </button>


      <button
        class="primary-btn"
        ${
          session.players.length <
          CONFIG.PLAYERS.MIN
            ? "disabled"
            : ""
        }
        onclick="navigate('INTENSITY')"
      >
        CONTINUER
      </button>

    </section>
  `;
}


/* ============================================================
   MODALE JOUEUR
   ============================================================ */

function openPlayerModal() {

  app.insertAdjacentHTML(
    "beforeend",
    `

      <div
        class="modal-backdrop"
        id="player-modal"
      >

        <form
          class="modal"
          onsubmit="confirmAddPlayer(event)"
        >

          <h2>
            Nouveau joueur
          </h2>

          <input
            id="player-name"
            maxlength="20"
            autocomplete="off"
            placeholder="Prénom"
          >

          <div class="modal-actions">

            <button
              type="button"
              class="secondary-btn"
              onclick="closePlayerModal()"
            >
              ANNULER
            </button>

            <button
              class="primary-btn"
              type="submit"
            >
              AJOUTER
            </button>

          </div>

        </form>

      </div>
    `
  );


  setTimeout(
    () => {

      document
        .getElementById(
          "player-name"
        )
        ?.focus();

    },
    50
  );
}


function closePlayerModal() {

  document
    .getElementById(
      "player-modal"
    )
    ?.remove();
}


function confirmAddPlayer(event) {

  event.preventDefault();

  const input =
    document.getElementById(
      "player-name"
    );


  if (!input) {
    return;
  }


  const name =
    input.value
      .trim()
      .replace(/\s+/g, " ");


  if (!name) {
    return;
  }


  if (
    session.players.some(
      player =>
        player.toLowerCase() ===
        name.toLowerCase()
    )
  ) {

    showToast(
      "Ce joueur existe déjà."
    );

    return;
  }


  if (
    session.players.length >=
    CONFIG.PLAYERS.MAX
  ) {

    showToast(
      "Nombre maximum de joueurs atteint."
    );

    return;
  }


  session.players.push(
    name
  );

  saveSession();

  closePlayerModal();

  render();
}


function removePlayer(index) {

  session.players.splice(
    index,
    1
  );

  saveSession();

  render();
}


/* ============================================================
   INTENSITÉ
   ============================================================ */

function renderIntensity() {

  const options = [

    [
      "COOL",
      "Tranquille pour commencer."
    ],

    [
      "CLASSIQUE",
      "Le rythme équilibré."
    ],

    [
      "CHAUD",
      "Plus personnel et imprévisible."
    ],

    [
      "CHAOS",
      "Le mode sans temps mort."
    ]

  ];


  app.innerHTML = `

    <section class="screen intensity-screen">

      <header class="screen-header">

        <button
          class="back-btn"
          onclick="navigate('PLAYERS')"
        >
          ‹
        </button>

        <h1>
          INTENSITÉ
        </h1>

        <span></span>

      </header>


      <div class="intensity-list">

        ${
          options
            .map(
              ([id, description]) => `

                <button
                  class="intensity-card ${
                    session.intensity === id
                      ? "selected"
                      : ""
                  }"
                  onclick="selectIntensity('${id}')"
                >

                  <strong>
                    ${id}
                  </strong>

                  <span>
                    ${description}
                  </span>

                </button>
              `
            )
            .join("")
        }

      </div>


      <button
        class="primary-btn"
        onclick="startRound()"
      >
        LANCER LA SOIRÉE
      </button>

    </section>
  `;
}


function selectIntensity(value) {

  if (
    !CONFIG.INTENSITY[value]
  ) {

    return;
  }

  session.intensity =
    value;

  saveSession();

  render();
}


/* ============================================================
   OPTIONS
   ============================================================ */

function renderOptions() {

  app.innerHTML = `

    <section class="screen options-screen">

      <header class="screen-header">

        <button
          class="back-btn"
          onclick="navigate('HOME')"
        >
          ‹
        </button>

        <h1>
          OPTIONS
        </h1>

        <span></span>

      </header>


      <div class="option-card">

        <strong>
          Session locale
        </strong>

        <span>
          Les joueurs et les préférences
          restent sur cet appareil.
        </span>

      </div>


      <button
        class="secondary-btn"
        onclick="clearSavedSession()"
      >
        RÉINITIALISER LA SESSION
      </button>


      <p class="muted">
        BUILD ${APP_VERSION}
      </p>

    </section>
  `;
}


function clearSavedSession() {

  try {

    localStorage.removeItem(
      CONFIG.SESSION.STORAGE_KEY
    );

  } catch (error) {

    console.warn(
      "Impossible de supprimer la session.",
      error
    );
  }


  session.players =
    [];

  session.history =
    [];

  session.playerHistory =
    [];

  session.intensity =
    "CLASSIQUE";

  session.round =
    0;

  stopTimer();

  render();
}


/* ============================================================
   ROUTEUR DU JEU
   ============================================================ */

function renderGame() {

  const phase =
    session.currentPhase;


  switch (phase) {

    case FLOW_PHASES.PASS_SECRET:

      return renderPassSecret();


    case FLOW_PHASES.SECRET_ACTION:

      return renderSecretAction();


    case FLOW_PHASES.ACTION:

      return renderAction();


    case FLOW_PHASES.VOTE:

      return renderVote();


    case FLOW_PHASES.RESOLVE:

      return renderResolve();


    case FLOW_PHASES.SUCCESS_CHECK:

      return renderSuccessCheck();


    default:

      console.warn(
        "Phase inconnue :",
        phase
      );

      finishRound();

      return;
  }
}


/* ============================================================
   HEADER DE JEU
   ============================================================ */

function gameHeader() {

  return `

    <header class="game-header">

      <span>
        TOUR ${session.round}
      </span>

      <span>
        ${escapeHTML(
          session.currentGame?.family ||
          ""
        )}
      </span>

    </header>
  `;
}


/* ============================================================
   EXTRACTION TEXTE
   ============================================================ */

function contentText(content) {

  if (
    typeof content ===
    "string"
  ) {

    return content;
  }


  if (!content) {

    return "";
  }


  return (
    content.question ||
    content.text ||
    content.prompt ||
    content.instruction ||
    content.action ||
    content.expression ||
    content.word ||
    ""
  );
}


/* ============================================================
   CONTENU PUBLIC
   ============================================================ */

function getPublicContentHTML() {

  const game =
    session.currentGame;

  const content =
    session.currentContent;


  if (
    !game ||
    content == null
  ) {

    return `

      <div class="main-text">
        À vous de jouer.
      </div>

    `;
  }


  switch (
    game.contentPool
  ) {

    case "CATEGORY":

      return `

        <div class="eyebrow">
          CATÉGORIE
        </div>

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

        <p>
          Chacun répond à son tour.
        </p>

      `;


    case "WORD":

      return `

        <div class="eyebrow">
          MOT
        </div>

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;


    case "KNOWLEDGE":

      return `

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;


    case "HOT":

      return `

        <div class="eyebrow">
          QUESTION CHAUDE
        </div>

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;


    case "CHOICE":

      return renderChoiceContent(
        content
      );


    case "GROUP_TRUTH":

      return `

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;


    case "IMPRO":

      return `

        <div class="eyebrow">
          MISSION
        </div>

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;


    /*
     * Les contenus secrets ne doivent
     * JAMAIS apparaître ici.
     */

    case "FORBIDDEN_WORD":
    case "TRAP_WORD":
    case "MISSION":
    case "TRAP_PROMPT":
    case "DESCRIPTION":
    case "MIME":
    case "GUESS_WORD":
    case "EXPRESSION":

      return `

        <div class="eyebrow">
          DÉFI SECRET
        </div>

        <div class="main-text">
          ${escapeHTML(
            session.currentActor ||
            "Joueur désigné"
          )}
        </div>

        <p>
          Le joueur désigné connaît
          son défi.
        </p>

      `;


    default:

      return `

        <div class="main-text">
          ${escapeHTML(
            contentText(content)
          )}
        </div>

      `;
  }
}


/* ============================================================
   CHOIX IMPOSSIBLE
   ============================================================ */

function getChoices(content) {

  if (!content) {
    return [];
  }


  if (
    Array.isArray(
      content.choices
    )
  ) {

    return content.choices;
  }


  if (
    Array.isArray(
      content.options
    )
  ) {

    return content.options;
  }


  return [];
}


function renderChoiceContent(content) {

  const question =
    content?.question ||
    content?.text ||
    "Choisissez.";


  const choices =
    getChoices(content);


  if (!choices.length) {

    return `

      <div class="main-text">
        ${escapeHTML(question)}
      </div>

    `;
  }


  return `

    <div class="eyebrow">
      CHOIX IMPOSSIBLE
    </div>

    <div class="main-text">
      ${escapeHTML(question)}
    </div>

  `;
}


/* ============================================================
   ACTION PUBLIQUE
   ============================================================ */

function renderAction() {

  const game =
    session.currentGame;


  const isVote =
    game?.flow?.includes(
      FLOW_PHASES.VOTE
    );


  const target =
    session.currentTargets;


  const targetHTML =
    target.length
      ? `

        <div class="target-line">

          ${target
            .map(
              escapeHTML
            )
            .join(" • ")}

        </div>

      `
      : "";


  /*
   * G021 possède ses propres boutons.
   */

  if (
    game?.contentPool ===
    "CHOICE"
  ) {

    return renderChoiceAction();
  }


  /*
   * G006/G007/G009 utilisent
   * le timer.
   */

  const timerHTML =
    game?.timer
      ? `

        <div
          class="game-timer"
          id="game-timer"
        >
          ${game.timer}
        </div>

      `
      : "";


  app.innerHTML = `

    <section class="screen game-screen">

      ${gameHeader()}

      ${targetHTML}

      ${timerHTML}


      <div class="game-card play-card">

        <div class="eyebrow">

          ${
            isVote
              ? "VOTE"
              : escapeHTML(
                  game?.title ||
                  "DÉFI"
                )
          }

        </div>


        ${
          isVote
            ? `

              <div class="main-text">

                ${escapeHTML(
                  contentText(
                    session.currentContent
                  )
                )}

              </div>

            `
            : getPublicContentHTML()
        }

      </div>


      <button
        class="primary-btn"
        onclick="advancePhase()"
      >

        ${
          isVote
            ? "VOTER"
            : "TERMINÉ"
        }

      </button>

    </section>
  `;


  if (
    game?.timer
  ) {

    startTimer(
      game.timer
    );
  }
}


/* ============================================================
   CHOIX INTERACTIF
   ============================================================ */

function renderChoiceAction() {

  const content =
    session.currentContent;

  const choices =
    getChoices(content);


  app.innerHTML = `

    <section class="screen game-screen">

      ${gameHeader()}


      <div class="game-card play-card">

        <div class="eyebrow">
          CHOIX IMPOSSIBLE
        </div>

        <div class="main-text">

          ${escapeHTML(
            content?.question ||
            content?.text ||
            "Choisissez."
          )}

        </div>

      </div>


      <div class="choice-grid">

        ${
          choices.length
            ? choices
                .map(
                  (choice, index) => `

                    <button
                      class="choice-btn"
                      onclick="selectChoice(${index})"
                    >
                      ${escapeHTML(
                        typeof choice ===
                        "string"
                          ? choice
                          : (
                              choice.text ||
                              choice.label ||
                              choice.value ||
                              ""
                            )
                      )}
                    </button>

                  `
                )
                .join("")
            : `

                <button
                  class="primary-btn"
                  onclick="advancePhase()"
                >
                  TERMINÉ
                </button>

              `
        }

      </div>

    </section>
  `;
}


function selectChoice(index) {

  const choices =
    getChoices(
      session.currentContent
    );

  const choice =
    choices[index];


  if (
    choice == null
  ) {

    return;
  }


  session.selectedChoice =
    choice;


  /*
   * Aucun écran de confirmation.
   */

  advancePhase();
}


/* ============================================================
   TÉLÉPHONE
   ============================================================ */

function renderPassSecret() {

  app.innerHTML = `

    <section class="screen private-transition">

      <div class="phone-icon">
        ☎
      </div>


      <div class="game-card">

        <div class="eyebrow">
          TÉLÉPHONE
        </div>


        <h1>

          Donne le téléphone à<br>

          ${escapeHTML(
            session.currentActor ||
            "la personne désignée"
          )}

        </h1>


        <p>
          Personne d'autre ne doit
          regarder l'écran.
        </p>

      </div>


      <button
        class="primary-btn"
        onclick="advancePhase()"
      >
        TÉLÉPHONE EN MAIN
      </button>

    </section>
  `;
}


/* ============================================================
   SECRET
   ============================================================ */

function getPrivateContentHTML() {

  const pool =
    session.currentGame?.contentPool;

  const content =
    session.currentContent;


  if (!content) {

    return `

      <p>
        Information secrète indisponible.
      </p>

    `;
  }


  switch (pool) {

    case "FORBIDDEN_WORD":
    case "TRAP_WORD":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.word ||
            content.text ||
            ""
          )}

        </div>

        ${
          Array.isArray(
            content.forbidden
          ) &&
          content.forbidden.length
            ? `

              <p>
                À éviter aussi :
                ${escapeHTML(
                  content.forbidden.join(", ")
                )}
              </p>

            `
            : ""
        }

      `;


    case "GUESS_WORD":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.word ||
            ""
          )}

        </div>

        ${
          content.hint
            ? `

              <p>
                Indice :
                ${escapeHTML(
                  content.hint
                )}
              </p>

            `
            : ""
        }

      `;


    case "DESCRIPTION":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.word ||
            ""
          )}

        </div>

        ${
          content.rule
            ? `

              <p>
                ${escapeHTML(
                  content.rule
                )}
              </p>

            `
            : ""
        }

      `;


    case "STATEMENTS":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.instruction ||
            content.text ||
            ""
          )}

        </div>

        ${
          content.rule
            ? `

              <p>
                ${escapeHTML(
                  content.rule
                )}
              </p>

            `
            : ""
        }

      `;


    case "MISSION":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.mission ||
            content.text ||
            content.action ||
            content
          )}

        </div>

      `;


    case "TRAP_PROMPT":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.prompt ||
            content.text ||
            content.action ||
            content
          )}

        </div>

      `;


    case "MIME":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.action ||
            content.text ||
            content
          )}

        </div>

      `;


    case "EXPRESSION":

      return `

        <div class="secret-value">

          ${escapeHTML(
            content.expression ||
            content.text ||
            content
          )}

        </div>

      `;


    default: {

      const value =
        typeof content ===
        "string"
          ? content
          : (
              content.expression ||
              content.word ||
              content.text ||
              content.instruction ||
              content.mission ||
              ""
            );


      return `

        <div class="secret-value">

          ${escapeHTML(value)}

        </div>

      `;
    }
  }
}


function renderSecretAction() {

  app.innerHTML = `

    <section class="screen private-screen">

      <div class="private-warning">

        SECRET —

        ${escapeHTML(
          session.currentActor ||
          ""
        )}

      </div>


      <div class="secret-card">

        <div class="eyebrow">
          NE PAS MONTRER
        </div>


        ${getPrivateContentHTML()}


        <p class="secret-instruction">

          Réalise le défi sans montrer
          cette information au groupe.

        </p>

      </div>


      <button
        class="primary-btn"
        onclick="secretActionDone()"
      >
        J'AI COMPRIS
      </button>

    </section>
  `;
}


function secretActionDone() {

  if (
    typeof clearPrivateContent ===
    "function"
  ) {

    clearPrivateContent();
  }


  advancePhase();
}


/* ============================================================
   VOTE
   ============================================================ */

function renderVote() {

  const players =
    session.players;

  const content =
    session.currentContent;

  const question =
    content?.question ||
    content?.text ||
    content ||
    "Qui choisissez-vous ?";


  app.innerHTML = `

    <section class="screen game-screen">

      ${gameHeader()}


      <div class="game-card">

        <div class="eyebrow">
          VOTE
        </div>


        <h1>
          ${escapeHTML(question)}
        </h1>


        <p>
          Désignez une seule personne.
        </p>

      </div>


      <div class="choice-grid">

        ${
          players
            .map(
              (player, index) => `

                <button
                  class="choice-btn"
                  onclick="selectVote(${index})"
                >
                  ${escapeHTML(player)}
                </button>

              `
            )
            .join("")
        }

      </div>

    </section>
  `;
}


/* ============================================================
   SÉLECTION VOTE
   ============================================================ */

function selectVote(index) {

  if (
    session.actionLocked
  ) {

    return;
  }


  const player =
    session.players[index];


  if (!player) {
    return;
  }


  session.actionLocked =
    true;


  session.votes = [
    player
  ];


  /*
   * Le vote devient immédiatement
   * la cible du tour.
   */

  session.currentTargets =
    [player];


  session.currentActor =
    player;


  if (
    typeof resetGameVotes ===
    "function"
  ) {

    resetGameVotes();
  }


  if (
    typeof addGameVote ===
    "function"
  ) {

    /*
     * Vote collectif représenté
     * par le groupe.
     */

    addGameVote(
      "__GROUP__",
      player
    );
  }


  if (
    typeof setGameTarget ===
    "function"
  ) {

    setGameTarget(
      player
    );
  }


  if (
    typeof setGameWinner ===
    "function"
  ) {

    setGameWinner(
      player
    );
  }


  session.actionLocked =
    false;


  advancePhase();
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function renderResolve() {

  const game =
    session.currentGame;


  if (
    game?.flow?.includes(
      FLOW_PHASES.VOTE
    )
  ) {

    return renderVoteResult();
  }


  if (
    game?.contentPool ===
    "CHOICE"
  ) {

    return renderChoiceResult();
  }


  if (
    game?.target ===
    TARGET_MODES.ALL
  ) {

    return renderGroupResult();
  }


  return renderSimpleResult();
}


/* ============================================================
   RÉSULTAT VOTE
   ============================================================ */

function renderVoteResult() {

  const target =
    session.currentTargets[0] ||
    session.votes[0] ||
    null;


  if (target) {

    session.currentTargets =
      [target];
  }


  const consequence =
    getConsequence();


  session.consequence =
    consequence;


  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">
          RÉSULTAT
        </div>


        <h1>
          ${escapeHTML(
            target ||
            "Vote terminé"
          )}
        </h1>


        ${
          target
            ? `

              <p>
                Cible du tour :
                <strong>
                  ${escapeHTML(target)}
                </strong>
              </p>

            `
            : ""
        }


        ${
          consequence
            ? `

              <div class="consequence">
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

  const choice =
    session.selectedChoice;


  const text =
    typeof choice ===
    "string"
      ? choice
      : (
          choice?.text ||
          choice?.label ||
          choice?.value ||
          "Choix effectué."
        );


  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">
          CHOIX
        </div>


        <h1>
          ${escapeHTML(text)}
        </h1>


        <p>
          Le groupe a choisi.
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
   RÉSULTAT GROUPE
   ============================================================ */

function renderGroupResult() {

  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">
          RÉSULTAT
        </div>


        <h1>
          Tour terminé.
        </h1>


        <p>
          Tout le groupe a participé.
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
   RÉSULTAT SIMPLE
   ============================================================ */

function renderSimpleResult() {

  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">
          TOUR TERMINÉ
        </div>


        <h1>
          C'est fait.
        </h1>


        <p>
          Prêts pour le prochain défi ?
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
   RÉUSSITE ?
   ============================================================ */

function renderSuccessCheck() {

  const actor =
    session.currentActor ||
    session.currentTargets[0] ||
    "Le joueur";


  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">
          RÉUSSITE ?
        </div>


        <h1>
          ${escapeHTML(actor)}
        </h1>


        <p>
          Le défi a-t-il été réussi ?
        </p>

      </div>


      <div class="choice-grid">

        <button
          class="choice-btn success-choice"
          onclick="resolveSuccess(true)"
        >
          OUI
        </button>


        <button
          class="choice-btn failure-choice"
          onclick="resolveSuccess(false)"
        >
          NON
        </button>

      </div>

    </section>
  `;
}


/* ============================================================
   RÉUSSITE / ÉCHEC
   ============================================================ */

function resolveSuccess(success) {

  if (
    session.actionLocked
  ) {

    return;
  }


  session.actionLocked =
    true;

  session.success =
    Boolean(success);


  if (
    typeof setGameSuccess ===
    "function"
  ) {

    setGameSuccess(
      session.success
    );
  }


  if (
    success
  ) {

    session.consequence =
      null;

  } else {

    session.consequence =
      getConsequence();
  }


  session.actionLocked =
    false;


  renderSuccessResult();
}


function renderSuccessResult() {

  const actor =
    session.currentActor ||
    session.currentTargets[0] ||
    "Le joueur";


  const consequence =
    session.consequence;


  app.innerHTML = `

    <section class="screen result-screen">

      <div class="game-card result-card">

        <div class="eyebrow">

          ${
            session.success
              ? "RÉUSSI"
              : "ÉCHEC"
          }

        </div>


        <h1>

          ${
            session.success
              ? "Bien joué."
              : "Raté."
          }

        </h1>


        <p>
          ${escapeHTML(actor)}
        </p>


        ${
          consequence
            ? `

              <div class="consequence">
                ${escapeHTML(
                  consequence
                )}
              </div>

            `
            : `

              <p>
                Aucun gage.
              </p>

            `
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
   CONSÉQUENCE
   ============================================================ */

function getConsequence() {

  return (
    CONFIG.PENALTIES?.DEFAULT ||
    "1 gorgée ou une alternative sans alcool"
  );
}


/* ============================================================
   TIMER
   ============================================================ */

function startTimer(seconds) {

  stopTimer();


  session.timerRemaining =
    seconds;


  updateTimerUI();


  session.timer =
    setInterval(
      () => {

        session.timerRemaining--;

        updateTimerUI();


        if (
          session.timerRemaining <= 0
        ) {

          stopTimer();

          timerExpired();
        }

      },
      1000
    );
}


function updateTimerUI() {

  const element =
    document.getElementById(
      "game-timer"
    );


  if (!element) {
    return;
  }


  element.textContent =
    session.timerRemaining;
}


function stopTimer() {

  if (
    session.timer
  ) {

    clearInterval(
      session.timer
    );
  }


  session.timer =
    null;

  session.timerRemaining =
    null;
}


function timerExpired() {

  /*
   * Le temps est écoulé.
   * On envoie directement vers
   * la résolution du défi.
   */

  if (
    session.currentPhase ===
    FLOW_PHASES.ACTION
  ) {

    advancePhase();
  }
}


/* ============================================================
   DEBUG / VALIDATION
   ============================================================ */

function validateApplication() {

  const errors =
    [];


  if (
    !Array.isArray(GAMES)
  ) {

    errors.push(
      "GAMES n'est pas disponible."
    );
  }


  if (
    typeof FLOW_PHASES ===
    "undefined"
  ) {

    errors.push(
      "FLOW_PHASES n'est pas disponible."
    );
  }


  if (
    typeof GAME_FLOW ===
    "undefined"
  ) {

    errors.push(
      "GAME_FLOW n'est pas disponible."
    );
  }


  if (
    typeof QUESTIONS ===
    "undefined"
  ) {

    errors.push(
      "QUESTIONS n'est pas disponible."
    );
  }


  if (
    errors.length
  ) {

    console.error(
      "ERREURS APPLICATION :",
      errors
    );

    return false;
  }


  console.log(
    `SOIRÉE BUILD ${APP_VERSION} — ${GAMES.length} jeux chargés.`
  );


  if (
    typeof validateGames ===
    "function"
  ) {

    const result =
      validateGames();


    if (
      result &&
      !result.valid
    ) {

      console.error(
        "ERREURS JEUX :",
        result.errors
      );

      return false;
    }
  }


  return true;
}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

  document
    .querySelector(".toast")
    ?.remove();


  const element =
    document.createElement(
      "div"
    );


  element.className =
    "toast";


  element.textContent =
    message;


  document.body.appendChild(
    element
  );


  setTimeout(
    () =>
      element.remove(),
    2200
  );
}


/* ============================================================
   INITIALISATION
   ============================================================ */

loadSession();

validateApplication();

render();
