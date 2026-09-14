/* ============================================================
   SOIRÉE — APP
   BUILD 07.0
   ============================================================ */

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

    selectedChoice: null

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

    return [...array]
        .sort(() => Math.random() - 0.5);

}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

function saveSession() {

    if (!CONFIG.SESSION.SAVE_TO_LOCAL_STORAGE) {

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

    }

    catch (error) {

        console.warn(
            "Sauvegarde impossible",
            error
        );

    }

}


/* ============================================================
   CHARGEMENT
   ============================================================ */

function loadSession() {

    if (!CONFIG.SESSION.SAVE_TO_LOCAL_STORAGE) {

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
            CONFIG.INTENSITY[
                saved.intensity
            ]
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

    }

    catch (error) {

        console.warn(
            "Session illisible",
            error
        );

    }

}


/* ============================================================
   NAVIGATION
   ============================================================ */

function navigate(screen) {

    session.screen = screen;

    render();

}


/* ============================================================
   ROTATION DES JOUEURS
   ============================================================ */

function getAvailablePlayers() {

    const recent =
        session.playerHistory.slice(
            -CONFIG.ROTATION.RECENT_PLAYER_LIMIT
        );


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

    const list =
        getAvailablePlayers();


    const pair =
        list.slice(0, 2);


    pair.forEach(
        player =>
            session.playerHistory.push(
                player
            )
    );


    if (pair.length === 2) {

        return pair;

    }


    return shuffle(
        session.players
    ).slice(0, 2);

}


/* ============================================================
   SÉLECTION D'UN JEU
   ============================================================ */

function chooseGame() {

    let candidates =
        GAMES.filter(game => {

            if (
                session.players.length <
                game.minPlayers
            ) {

                return false;

            }


            if (
                session.players.length >
                game.maxPlayers
            ) {

                return false;

            }


            if (
                session.history
                    .slice(-game.cooldown)
                    .includes(game.id)
            ) {

                return false;

            }


            return true;

        });


    /*
     * Si tous les jeux sont temporairement
     * bloqués par leur cooldown, on repart
     * sur les jeux compatibles.
     */

    if (!candidates.length) {

        candidates =
            GAMES.filter(game =>

                session.players.length >=
                game.minPlayers &&

                session.players.length <=
                game.maxPlayers

            );

    }


    if (!candidates.length) {

        return null;

    }


    const intensity =
        getIntensityConfig(
            session.intensity
        );


    const scored =
        candidates.map(game => {

            let score =
                100 -
                Math.abs(
                    game.intensity -
                    intensity.preferredIntensity
                ) * 20;


            /*
             * Diversité des familles.
             */

            const recentFamilies =
                session.history
                    .slice(-2)
                    .map(id =>
                        GAMES.find(
                            game =>
                                game.id === id
                        )?.family
                    )
                    .filter(Boolean);


            if (
                recentFamilies.filter(
                    family =>
                        family === game.family
                ).length >=
                CONFIG.DIVERSITY.MAX_SAME_FAMILY
            ) {

                score -= 60;

            }


            /*
             * Évite deux jeux de même famille
             * autant que possible.
             */

            if (
                session.currentGame?.family ===
                game.family
            ) {

                score -= 20;

            }


            /*
             * Les jeux personnels deviennent
             * plus présents avec l'intensité.
             */

            if (
                game.family ===
                "PERSONNEL"
            ) {

                score +=
                    15 *
                    intensity.hotMultiplier;

            }


            /*
             * Les jeux d'impro deviennent
             * plus présents en mode chaos.
             */

            if (
                game.family ===
                "IMPRO"
            ) {

                score +=
                    10 *
                    intensity.chaosMultiplier;

            }


            /*
             * Petite part d'aléatoire.
             */

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


    /*
     * Tirage pondéré.
     */

    const total =
        scored.reduce(
            (sum, item) =>
                sum + item.score,
            0
        );


    let roll =
        Math.random() * total;


    for (
        const item of scored
    ) {

        roll -= item.score;


        if (roll <= 0) {

            return item.game;

        }

    }


    return scored[0].game;

}


/* ============================================================
   CONTENU DU JEU
   ============================================================ */

function getContentForGame(game) {

    const pool =
        QUESTIONS[
            game.contentPool
        ];


    if (!pool) {

        return null;

    }


    /*
     * Les questions chaudes dépendent
     * du niveau d'intensité.
     */

    if (
        game.contentPool ===
        "HOT"
    ) {

        const maxIntensity =
            session.intensity === "COOL"
                ? 2
                : 3;


        const filtered =
            pool.filter(
                item =>
                    item.intensity <=
                    maxIntensity
            );


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

    session.currentActor = null;

    session.currentTargets = [];

    session.currentPair = [];


    switch (
        game.targetType
    ) {


        case "ONE":

        case "ROTATION": {

            session.currentActor =
                choosePlayer();


            session.currentTargets = [
                session.currentActor
            ];


            break;

        }


        case "TWO": {

            session.currentPair =
                chooseTwoPlayers();


            session.currentTargets = [
                ...session.currentPair
            ];


            session.currentActor =
                session.currentPair[0];


            break;

        }


        case "ALL": {

            session.currentTargets = [
                ...session.players
            ];


            break;

        }

    }

}


/* ============================================================
   PRÉPARATION D'UN TOUR
   ============================================================ */

function prepareRound() {

    const game =
        chooseGame();


    if (!game) {

        return null;

    }


    session.currentGame =
        game;


    session.currentContent =
        getContentForGame(
            game
        );


    assignRoles(game);


    session.currentPhase =
        game.phases[0] ||
        "INTRO";


    session.round++;


    session.history.push(
        game.id
    );


    session.votes = [];

    session.selectedChoice =
        null;


    saveSession();


    /*
     * Synchronisation avec GAME_FLOW.
     */

    resetGameFlow();


    startGameFlow(
        game,
        session.players
    );


    setCurrentActor(
        session.currentActor
    );


    setCurrentTarget(
        session.currentTargets[0]
    );


    setCurrentPlayers(
        session.currentPair.length
            ? session.currentPair
            : session.players
    );


    setPublicContent(
        session.currentContent
    );


    return game;

}


/* ============================================================
   DÉMARRER UN TOUR
   ============================================================ */

function startRound() {

    if (
        session.players.length <
        CONFIG.PLAYERS.MIN
    ) {

        showToast(
            `Il faut au moins ${CONFIG.PLAYERS.MIN} joueurs.`
        );

        return;

    }


    if (!prepareRound()) {

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

    const next =
        nextGamePhase();


    if (!next) {

        session.screen =
            "HOME";


        render();

        return;

    }


    session.currentPhase =
        next;


    render();

}


/* ============================================================
   INTRODUCTION FUSIONNÉE
   ============================================================ */

function beginMergedIntro() {

    /*
     * Pour les jeux ayant une cible unique,
     * le nom de la cible est déjà présenté
     * dans l'introduction.
     *
     * On saute donc l'écran SELECT_TARGET
     * sans supprimer cette phase du flow.
     */

    if (
        session.currentGame?.phases[1] ===
        "SELECT_TARGET"
    ) {

        advancePhase();

        advancePhase();

    }

    else {

        advancePhase();

    }

}


/* ============================================================
   CONTENU PRIVÉ
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


    /*
     * MOT INTERDIT / PIÈGE À MOT
     */

    if (
        pool === "FORBIDDEN_WORD" ||
        pool === "TRAP_WORD"
    ) {

        return `

            <div class="secret-value">

                ${escapeHTML(
                    content.word
                )}

            </div>

            ${
                content.forbidden?.length

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

    }


    /*
     * MISSIONS / DÉFIS SECRETS
     */

    if (
        pool === "MISSION" ||
        pool === "TRAP_PROMPT" ||
        pool === "DESCRIPTION" ||
        pool === "MIME" ||
        pool === "IMPRO"
    ) {

        return `

            <div class="secret-value">

                ${escapeHTML(
                    typeof content === "string"
                        ? content
                        : JSON.stringify(content)
                )}

            </div>

        `;

    }


    /*
     * MOT À DEVINER / EXPRESSION
     */

    if (
        pool === "GUESS_WORD" ||
        pool === "EXPRESSION"
    ) {

        const value =
            typeof content === "string"

                ? content

                : (
                    content.expression ||
                    content.word ||
                    ""
                );


        return `

            <div class="secret-value">

                ${escapeHTML(value)}

            </div>

        `;

    }


    return `

        <div class="secret-value">

            ${escapeHTML(
                content.text ||
                content.word ||
                content.instruction ||
                ""
            )}

        </div>

    `;

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
        !content
    ) {

        return `
            <p>
                Préparez-vous.
            </p>
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

                    ${escapeHTML(content)}

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

                    ${escapeHTML(content)}

                </div>

                <p>
                    À vous de jouer.
                </p>

            `;


        case "HOT":

        case "VOTE":

        case "MAJORITY":

        case "TARGET":

        case "KNOWLEDGE":

        case "SUSPECT":

        case "CHOICE":

        case "GROUP_TRUTH":

            return `

                <div class="main-text">

                    ${escapeHTML(
                        content.text ||
                        content
                    )}

                </div>

            `;


        case "STATEMENTS":

            return `

                <div class="main-text">

                    ${escapeHTML(
                        content.instruction
                    )}

                </div>

            `;


        case "BLUFF":

            return `

                <div class="main-text">

                    ${escapeHTML(content)}

                </div>

            `;


        /*
         * IMPORTANT :
         * aucune information secrète
         * n'est affichée ici.
         */

        case "FORBIDDEN_WORD":

        case "TRAP_WORD":

            return `

                <div class="eyebrow">
                    MISSION SECRÈTE
                </div>

                <div class="main-text">
                    Restez attentifs.
                </div>

                <p>
                    ${escapeHTML(
                        session.currentActor
                    )}
                    possède une information secrète.
                </p>

            `;


        case "MISSION":

        case "TRAP_PROMPT":

        case "DESCRIPTION":

        case "MIME":

        case "GUESS_WORD":

        case "EXPRESSION":

        case "IMPRO":

            return `

                <div class="eyebrow">
                    DÉFI SECRET
                </div>

                <div class="main-text">
                    Le joueur désigné connaît son défi.
                </div>

                <p>
                    Le groupe doit jouer sans voir
                    l'information privée.
                </p>

            `;


        default:

            return `

                <div class="main-text">
                    À vous de jouer.
                </div>

            `;

    }

}


/* ============================================================
   RENDER GLOBAL
   ============================================================ */

function render() {

    if (
        session.screen ===
        "HOME"
    ) {

        return renderHome();

    }


    if (
        session.screen ===
        "PLAYERS"
    ) {

        return renderPlayers();

    }


    if (
        session.screen ===
        "INTENSITY"
    ) {

        return renderIntensity();

    }


    if (
        session.screen ===
        "OPTIONS"
    ) {

        return renderOptions();

    }


    if (
        session.screen ===
        "GAME"
    ) {

        return renderGame();

    }

}


/* ============================================================
   ACCUEIL
   ============================================================ */

function renderHome() {

    app.innerHTML = `

        <section class="home screen">

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

                ${session.players.length}
                /
                ${CONFIG.PLAYERS.MAX}

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
                        autofocus
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
                        >
                            AJOUTER
                        </button>

                    </div>

                </form>

            </div>

        `

    );


    setTimeout(
        () =>
            document
                .getElementById(
                    "player-name"
                )
                ?.focus(),
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
            "Plus personnel et plus imprévisible."
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
                                    class="intensity-card
                                    ${
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
                Version BUILD 07.0
            </p>

        </section>

    `;

}


function clearSavedSession() {

    try {

        localStorage.removeItem(
            CONFIG.SESSION.STORAGE_KEY
        );

    }

    catch (error) {}



    session.players = [];

    session.history = [];

    session.playerHistory = [];

    session.intensity =
        "CLASSIQUE";


    render();

}


/* ============================================================
   RENDER DU JEU
   ============================================================ */

function renderGame() {

    const phase =
        session.currentPhase;


    if (
        phase ===
        "INTRO"
    ) {

        return renderIntro();

    }


    if (
        phase ===
        "SELECT_TARGET"
    ) {

        return renderSelectTarget();

    }


    if (
        phase ===
        "SELECT_PLAYERS"
    ) {

        return renderSelectPlayers();

    }


    if (
        phase ===
        "PASS_PHONE"
    ) {

        return renderPassPhone();

    }


    if (
        phase ===
        "PRIVATE_REVEAL"
    ) {

        return renderPrivateReveal();

    }


    if (
        phase ===
        "RETURN_PHONE"
    ) {

        return renderReturnPhone();

    }


    if (
        phase ===
        "PLAY"
    ) {

        return renderPlay();

    }


    if (
        phase ===
        "VOTE"
    ) {

        return renderVote();

    }


    if (
        phase ===
        "RESULT"
    ) {

        return renderResult();

    }


    if (
        phase ===
        "PENALTY"
    ) {

        return renderPenalty();

    }


    if (
        phase ===
        "NEXT"
    ) {

        return renderNext();

    }


    session.screen =
        "HOME";


    render();

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
                    session.currentGame?.family || ""
                )}
            </span>

        </header>

    `;

}


/* ============================================================
   INTRO
   ============================================================ */

function renderIntro() {

    const game =
        session.currentGame;


    const singleTarget =
        game?.phases[1] ===
        "SELECT_TARGET";


    const target =
        session.currentTargets[0];


    app.innerHTML = `

        <section class="screen game-screen">

            ${gameHeader()}


            <div class="game-card intro-card">

                <div class="eyebrow">
                    NOUVEAU DÉFI
                </div>


                <h1>

                    ${escapeHTML(
                        singleTarget
                            ? target
                            : (
                                game?.name ||
                                "À vous de jouer"
                            )
                    )}

                </h1>


                <p>

                    ${escapeHTML(
                        singleTarget
                            ? game.name
                            : "Préparez-vous."
                    )}

                </p>

            </div>


            <button
                class="primary-btn"
                onclick="beginMergedIntro()"
            >
                COMMENCER
            </button>

        </section>

    `;

}


/* ============================================================
   SÉLECTION CIBLE
   ============================================================ */

function renderSelectTarget() {

    app.innerHTML = `

        <section class="screen game-screen">

            ${gameHeader()}


            <div class="game-card">

                <div class="eyebrow">
                    JOUEUR DÉSIGNÉ
                </div>


                <h1>
                    ${escapeHTML(
                        session.currentTargets[0]
                    )}
                </h1>


                <p>
                    Cette personne est au centre du défi.
                </p>

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                CONTINUER
            </button>

        </section>

    `;

}


/* ============================================================
   SÉLECTION DE DEUX JOUEURS
   ============================================================ */

function renderSelectPlayers() {

    const pair =
        session.currentPair;


    app.innerHTML = `

        <section class="screen game-screen">

            ${gameHeader()}


            <div class="game-card">

                <div class="eyebrow">
                    DUO
                </div>


                <h1>

                    ${pair
                        .map(escapeHTML)
                        .join(" & ")
                    }

                </h1>


                <p>
                    Ces deux joueurs participent à ce tour.
                </p>

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                CONTINUER
            </button>

        </section>

    `;

}


/* ============================================================
   PASSAGE DU TÉLÉPHONE
   ============================================================ */

function renderPassPhone() {

    app.innerHTML = `

        <section class="screen private-transition">

            <div class="phone-icon">
                ⌕
            </div>


            <div class="game-card">

                <div class="eyebrow">
                    TÉLÉPHONE
                </div>


                <h1>

                    Donne le téléphone à<br>

                    ${escapeHTML(
                        session.currentActor
                    )}

                </h1>


                <p>
                    Personne d'autre ne doit regarder l'écran.
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
   RÉVÉLATION PRIVÉE
   ============================================================ */

function renderPrivateReveal() {

    /*
     * Le contenu secret n'est injecté
     * dans l'écran qu'ici.
     */

    setPrivateContent(
        session.currentContent
    );


    app.innerHTML = `

        <section class="screen private-screen">

            <div class="private-warning">

                SECRET —
                ${escapeHTML(
                    session.currentActor
                )}

            </div>


            <div class="secret-card">

                <div class="eyebrow">
                    NE PAS MONTRER
                </div>


                ${getPrivateContentHTML()}

            </div>


            <button
                class="primary-btn"
                onclick="leavePrivateReveal()"
            >
                J'AI COMPRIS
            </button>

        </section>

    `;

}


/* ============================================================
   FIN DU SECRET
   ============================================================ */

function leavePrivateReveal() {

    /*
     * Suppression immédiate du contenu secret.
     */

    clearPrivateContent();


    advancePhase();

}


/* ============================================================
   RETOUR DU TÉLÉPHONE
   ============================================================ */

function renderReturnPhone() {

    app.innerHTML = `

        <section class="screen private-transition">

            <div class="game-card">

                <div class="eyebrow">
                    FIN DU SECRET
                </div>


                <h1>
                    Rends le téléphone au groupe.
                </h1>


                <p>
                    Le contenu secret ne doit plus être affiché.
                </p>

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                TÉLÉPHONE RENDU
            </button>

        </section>

    `;

}


/* ============================================================
   JEU PUBLIC
   ============================================================ */

function renderPlay() {

    app.innerHTML = `

        <section class="screen game-screen">

            ${gameHeader()}


            <div class="target-line">

                ${
                    session.currentTargets.length

                        ? session.currentTargets
                            .map(escapeHTML)
                            .join(" • ")

                        : ""
                }

            </div>


            <div class="game-card play-card">

                ${getPublicContentHTML()}

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                TERMINÉ
            </button>

        </section>

    `;

}


/* ============================================================
   VOTE
   ============================================================ */

function renderVote() {

    const players =
        session.players;


    app.innerHTML = `

        <section class="screen game-screen">

            ${gameHeader()}


            <div class="game-card">

                <div class="eyebrow">
                    VOTE
                </div>


                <h1>
                    Qui choisissez-vous ?
                </h1>


                <p>
                    Le groupe vote pour une personne.
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


function selectVote(index) {

    const player =
        session.players[index];


    if (!player) {

        return;

    }


    session.votes.push(
        player
    );


    advancePhase();

}


/* ============================================================
   RÉSULTAT
   ============================================================ */

function renderResult() {

    const target =
        session.currentTargets[0];


    const vote =
        session.votes[
            session.votes.length - 1
        ];


    const same =
        target &&
        vote === target;


    app.innerHTML = `

        <section class="screen result-screen">

            <div class="game-card result-card">

                <div class="eyebrow">
                    RÉSULTAT
                </div>


                <h1>

                    ${
                        same
                            ? "Bien vu."
                            : "Le vote est tombé."
                    }

                </h1>


                <p>

                    ${
                        same

                            ? `${escapeHTML(target)}
                               était bien la cible.`

                            : `Cible du tour :
                               ${escapeHTML(
                                   target || "—"
                               )}.`
                    }

                </p>

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                CONTINUER
            </button>

        </section>

    `;

}


/* ============================================================
   PÉNALITÉ
   ============================================================ */

function renderPenalty() {

    app.innerHTML = `

        <section class="screen result-screen">

            <div class="game-card">

                <div class="eyebrow">
                    PÉNALITÉ
                </div>


                <h1>
                    À toi de choisir.
                </h1>


                <p>
                    ${escapeHTML(
                        CONFIG.PENALTIES.DEFAULT
                    )}
                </p>

            </div>


            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                C'EST FAIT
            </button>

        </section>

    `;

}


/* ============================================================
   TOUR SUIVANT
   ============================================================ */

function renderNext() {

    app.innerHTML = `

        <section class="screen result-screen">

            <div class="game-card">

                <div class="eyebrow">
                    TOUR TERMINÉ
                </div>


                <h1>
                    Prêts pour la suite ?
                </h1>


                <p>
                    ${escapeHTML(
                        session.currentGame?.name || ""
                    )}
                </p>

            </div>


            <button
                class="primary-btn"
                onclick="startRound()"
            >
                TOUR SUIVANT
            </button>


            <button
                class="secondary-btn"
                onclick="navigate('HOME')"
            >
                QUITTER
            </button>

        </section>

    `;

}


/* ============================================================
   TOAST
   ============================================================ */

function showToast(message) {

    document
        .querySelector(".toast")
        ?.remove();


    const element =
        document.createElement("div");


    element.className =
        "toast";


    element.textContent =
        message;


    document.body.appendChild(
        element
    );


    setTimeout(
        () => element.remove(),
        2200
    );

}


/* ============================================================
   INITIALISATION
   ============================================================ */

loadSession();

render();
