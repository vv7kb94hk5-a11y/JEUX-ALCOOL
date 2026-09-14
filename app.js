/* ============================================================
   SOIRÉE — APP
   BUILD 08.1
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

    currentActor: null,

    currentTargets: [],

    currentPair: [],

    rotationOrder: [],

    rotationIndex: 0,

    currentPhase: null,

    round: 0,

    selectedPlayers: [],

    votes: {},

    selectedChoice: null,

    result: null,

    penaltyPlayer: null

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
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function shuffle(array) {

    return [...array]
        .sort(
            () => Math.random() - 0.5
        );

}


function normalizeContent(content) {

    if (content == null) {
        return {};
    }

    if (typeof content === "string") {
        return {
            text: content
        };
    }

    return content;

}


function contentText(content) {

    const item =
        normalizeContent(content);

    return (
        item.text ||
        item.instruction ||
        item.question ||
        item.prompt ||
        item.challenge ||
        item.word ||
        item.expression ||
        ""
    );

}


function showToast(message) {

    let toast =
        document.getElementById(
            "soiree-toast"
        );

    if (!toast) {

        toast =
            document.createElement("div");

        toast.id =
            "soiree-toast";

        toast.className =
            "toast";

        document.body.appendChild(
            toast
        );

    }

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

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
                    session.playerHistory.slice(
                        -20
                    )

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
            CONFIG.INTENSITY?.[
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

    session.screen =
        screen;

    render();

}


/* ============================================================
   JOUEURS
   ============================================================ */

function getAvailablePlayers() {

    const limit =
        CONFIG?.ROTATION?.RECENT_PLAYER_LIMIT || 3;

    const recent =
        session.playerHistory.slice(
            -limit
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

    let list =
        getAvailablePlayers();

    if (list.length < 2) {

        list =
            shuffle(
                session.players
            );

    }

    const pair =
        list.slice(0, 2);

    pair.forEach(
        player => {

            if (player) {

                session.playerHistory.push(
                    player
                );

            }

        }
    );

    return pair;

}


/* ============================================================
   CHOIX DU JEU
   ============================================================ */

function getCompatibleGames() {

    if (
        !Array.isArray(GAMES)
    ) {
        return [];
    }

    return GAMES.filter(
        game =>

            session.players.length >=
                (game.minPlayers || 3)

            &&

            session.players.length <=
                (game.maxPlayers || 99)
    );

}


function chooseGame() {

    let candidates =
        getCompatibleGames();

    if (!candidates.length) {
        return null;
    }


    /*
     * Évite les répétitions immédiates.
     */

    const recent =
        session.history.slice(-3);

    const filtered =
        candidates.filter(
            game =>
                !recent.includes(
                    game.id
                )
        );

    if (filtered.length) {
        candidates = filtered;
    }


    /*
     * Évite de répéter le même type.
     */

    const recentTypes =
        session.history
            .slice(-2)
            .map(id => {

                const game =
                    getGameById(id);

                return game?.type;

            })
            .filter(Boolean);

    const diverse =
        candidates.filter(
            game =>
                !recentTypes.includes(
                    game.type
                )
        );

    if (diverse.length) {
        candidates =
            diverse;
    }


    return randomItem(
        candidates
    );

}


function getGameById(id) {

    return GAMES.find(
        game =>
            game.id === id
    ) || null;

}


/* ============================================================
   CONTENU
   ============================================================ */

function getContentForGame(game) {

    const pool =
        QUESTIONS?.[
            game.contentPool
        ];

    if (
        !Array.isArray(pool) ||
        !pool.length
    ) {

        console.error(
            `Pool absent : ${game.contentPool}`
        );

        return null;

    }


    if (
        game.contentPool ===
        "HOT"
    ) {

        const maxIntensity =

            session.intensity === "COOL"
                ? 1

                : session.intensity === "CLASSIQUE"
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


    return randomItem(
        pool
    );

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

    session.rotationOrder =
        [];

    session.rotationIndex =
        0;

    session.selectedPlayers =
        [];


    /*
     * ACTEUR
     */

    switch (game.actor) {

        case ACTOR_MODES.ONE:

            session.currentActor =
                choosePlayer();

            break;


        case ACTOR_MODES.TWO:

            session.currentPair =
                chooseTwoPlayers();

            session.currentTargets =
                [...session.currentPair];

            session.currentActor =
                session.currentPair[0] ||
                null;

            break;


        case ACTOR_MODES.ROTATION:

            session.rotationOrder =
                shuffle(
                    session.players
                );

            session.rotationIndex =
                0;

            session.currentActor =
                session.rotationOrder[0] ||
                null;

            break;


        case ACTOR_MODES.ALL:

            session.currentTargets =
                [...session.players];

            break;

    }


    /*
     * CIBLE ONE indépendante de l'acteur.
     */

    if (
        game.target ===
        TARGET_MODES.ONE
    ) {

        if (
            session.currentActor &&
            game.actor ===
                ACTOR_MODES.ONE
        ) {

            const alternatives =
                session.players.filter(
                    player =>
                        player !==
                        session.currentActor
                );

            session.currentTargets = [

                randomItem(
                    alternatives.length
                        ? alternatives
                        : session.players
                )

            ];

        }

        else if (
            !session.currentTargets.length
        ) {

            const target =
                choosePlayer();

            if (target) {

                session.currentTargets =
                    [target];

            }

        }

    }


    /*
     * CIBLE TWO.
     */

    if (
        game.target ===
        TARGET_MODES.TWO
    ) {

        if (
            session.currentTargets.length !== 2
        ) {

            session.currentPair =
                chooseTwoPlayers();

            session.currentTargets =
                [...session.currentPair];

        }

    }


    /*
     * TARGET: VOTE
     *
     * IMPORTANT :
     * aucune cible n'est créée ici.
     */

}


/* ============================================================
   PRÉPARER UN TOUR
   ============================================================ */

function prepareRound() {

    const game =
        chooseGame();

    if (!game) {
        return null;
    }


    const validation =
        typeof validateGameDefinition ===
            "function"
            ? validateGameDefinition(game)
            : {
                valid: true,
                errors: []
            };


    if (!validation.valid) {

        console.error(
            "Jeu invalide",
            game.id,
            validation.errors
        );

        return null;

    }


    session.currentGame =
        game;

    session.currentContent =
        getContentForGame(game);


    if (
        !session.currentContent
    ) {

        console.error(
            "Contenu introuvable",
            game.contentPool
        );

        return null;

    }


    assignRoles(
        game
    );


    session.round++;


    session.history.push(
        game.id
    );


    session.votes =
        {};

    session.selectedChoice =
        null;

    session.result =
        null;

    session.penaltyPlayer =
        null;


    /*
     * Nouveau moteur.
     */

    resetGameFlow();


    startGameFlow(

        game,

        {

            actor:
                session.currentActor,

            targets:
                session.currentTargets,

            participants:
                session.currentPair.length
                    ? session.currentPair
                    : session.players,

            secretOwner:
                session.currentTargets[0] ||
                session.currentActor ||
                null,

            content:
                session.currentContent,

            publicContent:
                session.currentContent,

            privateContent:
                session.currentContent

        }

    );


    session.currentPhase =
        getCurrentGamePhase();


    setGameActor(
        session.currentActor
    );

    setGameTargets(
        session.currentTargets
    );

    setGameParticipants(
        session.currentPair.length
            ? session.currentPair
            : session.players
    );

    setSecretOwner(
        session.currentTargets[0] ||
        session.currentActor ||
        null
    );

    setGameContent(
        session.currentContent
    );


    saveSession();


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


    const game =
        prepareRound();

    if (!game) {

        showToast(
            "Impossible de préparer ce tour."
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

        finishRound();

        return;

    }


    session.currentPhase =
        next;

    render();

}


/* ============================================================
   FIN DE TOUR
   ============================================================ */

function finishRound() {

    resetGameFlow();

    session.currentGame =
        null;

    session.currentContent =
        null;

    session.currentActor =
        null;

    session.currentTargets =
        [];

    session.currentPair =
        [];

    session.currentPhase =
        null;

    session.votes =
        {};

    session.result =
        null;

    session.penaltyPlayer =
        null;

    session.screen =
        "HOME";

    saveSession();

    render();

}


/* ============================================================
   INTRO
   ============================================================ */

function renderGameIntro() {

    const game =
        session.currentGame;

    const actor =
        session.currentActor;

    const target =
        session.currentTargets[0];


    /*
     * Un jeu secret avec cible :
     * l'introduction indique simplement
     * qui doit prendre le téléphone.
     */

    let description = "";


    if (
        game.phone === true
    ) {

        description =
            target ||
            actor
                ? `Passe le téléphone à ${
                    escapeHTML(
                        target || actor
                    )
                }.`
                : "Préparez le téléphone.";

    }

    else if (
        game.type ===
        GAME_TYPES.GROUP_VOTE
    ) {

        description =
            "Le groupe va désigner une personne.";

    }

    else if (
        actor
    ) {

        description =
            `${escapeHTML(actor)}, c'est ton tour.`;

    }

    else {

        description =
            "Préparez-vous.";

    }


    return `

        <section class="screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

                <div class="round-label">
                    TOUR ${session.round}
                </div>

            </div>


            <div class="screen-content">

                <div class="eyebrow">
                    ${
                        game.type ===
                        GAME_TYPES.GROUP_VOTE
                            ? "VOTE"

                            : game.type ===
                              GAME_TYPES.BLUFF
                                ? "BLUFF"

                                : game.type ===
                                  GAME_TYPES.SECRET
                                    ? "SECRET"

                                    : "NOUVEAU DÉFI"
                    }
                </div>


                <h1>
                    ${escapeHTML(
                        game.name
                    )}
                </h1>


                <p>
                    ${description}
                </p>


                <button
                    class="primary-button"
                    onclick="beginGame()"
                >
                    COMMENCER
                </button>

            </div>

        </section>

    `;

}


function beginGame() {

    advancePhase();

}


/* ============================================================
   SÉLECTION CIBLE
   ============================================================ */

function renderSelectTarget() {

    /*
     * Pour une cible déjà déterminée :
     * aucune sélection supplémentaire.
     */

    if (
        session.currentTargets.length
    ) {

        advancePhase();

        return "";

    }


    return `

        <section class="screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

            </div>


            <div class="screen-content">

                <div class="eyebrow">
                    CIBLE
                </div>

                <h1>
                    Choisissez un joueur
                </h1>


                <div class="player-list">

                    ${session.players
                        .map(
                            (player, index) => `

                                <button
                                    class="player-button"
                                    onclick="selectTarget(${index})"
                                >
                                    ${escapeHTML(player)}
                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>

        </section>

    `;

}


function selectTarget(index) {

    const player =
        session.players[index];

    if (!player) {
        return;
    }


    session.currentTargets =
        [player];

    session.currentActor =
        player;


    setGameTargets(
        [player]
    );

    setGameActor(
        player
    );


    advancePhase();

}


/* ============================================================
   SÉLECTION DE DEUX JOUEURS
   ============================================================ */

function renderSelectPlayers() {

    const selected =
        session.selectedPlayers;


    return `

        <section class="screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

            </div>


            <div class="screen-content">

                <div class="eyebrow">
                    ${selected.length} / 2
                </div>

                <h1>
                    Choisissez deux joueurs
                </h1>


                <div class="player-list">

                    ${session.players
                        .map(
                            (player, index) => `

                                <button
                                    class="player-button ${
                                        selected.includes(
                                            player
                                        )
                                            ? "selected"
                                            : ""
                                    }"
                                    onclick="toggleSelectedPlayer(${index})"
                                >
                                    ${escapeHTML(player)}
                                </button>

                            `
                        )
                        .join("")}

                </div>


                <button
                    class="primary-button"
                    onclick="confirmSelectedPlayers()"
                    ${
                        selected.length !== 2
                            ? "disabled"
                            : ""
                    }
                >
                    CONTINUER
                </button>

            </div>

        </section>

    `;

}


function toggleSelectedPlayer(index) {

    const player =
        session.players[index];

    if (!player) {
        return;
    }


    if (
        session.selectedPlayers.includes(
            player
        )
    ) {

        session.selectedPlayers =
            session.selectedPlayers.filter(
                item =>
                    item !== player
            );

    }

    else {

        if (
            session.selectedPlayers.length >= 2
        ) {

            showToast(
                "Deux joueurs maximum."
            );

            return;

        }

        session.selectedPlayers.push(
            player
        );

    }


    render();

}


function confirmSelectedPlayers() {

    if (
        session.selectedPlayers.length !== 2
    ) {
        return;
    }


    session.currentPair =
        [...session.selectedPlayers];

    session.currentTargets =
        [...session.selectedPlayers];

    session.currentActor =
        session.selectedPlayers[0];


    setGameParticipants(
        session.currentPair
    );

    setGameTargets(
        session.currentTargets
    );

    setGameActor(
        session.currentActor
    );


    advancePhase();

}


/* ============================================================
   SECRET — PASSAGE TÉLÉPHONE
   ============================================================ */

function renderPrivateHandoff() {

    const target =
        session.currentTargets[0] ||
        session.currentActor;


    return `

        <section class="screen private-screen">

            <div class="screen-content">

                <div class="phone-icon">
                    📱
                </div>

                <div class="eyebrow">
                    SECRET
                </div>

                <h1>
                    ${escapeHTML(
                        target || "Joueur"
                    )}
                </h1>

                <p>
                    Passe le téléphone à cette personne.
                </p>

                <p class="muted">
                    Personne d'autre ne doit regarder.
                </p>


                <button
                    class="primary-button"
                    onclick="revealSecret()"
                >
                    J'AI LE TÉLÉPHONE
                </button>

            </div>

        </section>

    `;

}


function revealSecret() {

    if (
        session.currentGame?.phone !== true
    ) {

        showToast(
            "Ce jeu ne nécessite pas le téléphone."
        );

        return;

    }


    session.screen =
        "SECRET";

    render();

}


/* ============================================================
   SECRET — CONTENU
   ============================================================ */

function renderSecret() {

    const owner =
        session.currentTargets[0] ||
        session.currentActor;


    const content =
        normalizeContent(
            session.currentContent
        );

    const pool =
        session.currentGame?.contentPool;


    let value = "";


    switch (pool) {

        case "FORBIDDEN_WORD":

        case "TRAP_WORD":

            value =
                content.word ||
                content.text ||
                "";

            break;


        case "EXPRESSION":

            value =
                content.expression ||
                content.text ||
                "";

            break;


        case "GUESS_WORD":

            value =
                content.word ||
                content.text ||
                "";

            break;


        case "DESCRIPTION":

            value =
                content.word ||
                content.text ||
                "";

            break;


        case "MIME":

        case "MISSION":

        case "TRAP_PROMPT":

        case "IMPRO":

            value =
                content.text ||
                content.instruction ||
                content.question ||
                content.prompt ||
                "";

            break;


        default:

            value =
                content.text ||
                content.instruction ||
                content.question ||
                content.word ||
                "";

    }


    return `

        <section class="screen private-screen">

            <div class="screen-content">

                <div class="eyebrow">
                    ${escapeHTML(
                        owner || "SECRET"
                    )}
                </div>


                <div class="secret-card">

                    <div class="eyebrow">
                        NE REGARDE QUE TOI
                    </div>

                    <div class="secret-value">
                        ${escapeHTML(value)}
                    </div>

                </div>


                <button
                    class="primary-button"
                    onclick="leaveSecret()"
                >
                    C'EST BON
                </button>

            </div>

        </section>

    `;

}


function leaveSecret() {

    session.screen =
        "GAME";

    advancePhase();

}


/* ============================================================
   CONTENU PUBLIC
   ============================================================ */

function getPublicContentHTML() {

    const game =
        session.currentGame;

    const content =
        normalizeContent(
            session.currentContent
        );


    /*
     * SECRET :
     * ne jamais montrer le contenu.
     */

    if (
        game.phone === true ||
        game.type === GAME_TYPES.SECRET
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    ${escapeHTML(
                        game.name
                    )}
                </div>

                <h2>
                    ${escapeHTML(
                        session.currentTargets[0] ||
                        session.currentActor ||
                        "Joueur"
                    )}
                </h2>

                <p>
                    Fais le défi que tu viens de découvrir.
                </p>

            </div>

        `;

    }


    /*
     * GROUP VOTE
     */

    if (
        game.type ===
        GAME_TYPES.GROUP_VOTE
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    VOTE
                </div>

                <h2>
                    ${escapeHTML(
                        contentText(content)
                    )}
                </h2>

                <p>
                    Tout le monde désigne une personne.
                </p>

            </div>

        `;

    }


    /*
     * BLUFF
     */

    if (
        game.type ===
        GAME_TYPES.BLUFF
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    BLUFF
                </div>

                <h2>
                    ${escapeHTML(
                        contentText(content)
                    )}
                </h2>

                ${
                    session.currentActor
                        ? `
                            <p>
                                ${escapeHTML(
                                    session.currentActor
                                )}
                                joue.
                            </p>
                        `
                        : ""
                }

            </div>

        `;

    }


    /*
     * QUESTION CHAUDE
     */

    if (
        game.contentPool ===
        "HOT"
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    QUESTION
                </div>

                <h2>
                    ${escapeHTML(
                        content.text
                    )}
                </h2>

                ${
                    session.currentTargets[0]
                        ? `
                            <p>
                                ${escapeHTML(
                                    session.currentTargets[0]
                                )}
                                répond.
                            </p>
                        `
                        : ""
                }

            </div>

        `;

    }


    /*
     * CHOIX
     */

    if (
        game.type ===
        GAME_TYPES.CHOICE
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    CHOIX
                </div>

                <h2>
                    ${escapeHTML(
                        content.question ||
                        content.text ||
                        ""
                    )}
                </h2>

            </div>

        `;

    }


    /*
     * GÉNÉRAL
     */

    return `

        <div class="game-card">

            <div class="eyebrow">
                ${escapeHTML(
                    game.name
                )}
            </div>

            <h2>
                ${escapeHTML(
                    contentText(content)
                )}
            </h2>

        </div>

    `;

}


/* ============================================================
   VOTE DU GROUPE
   ============================================================ */

function renderGroupVote() {

    const game =
        session.currentGame;

    const content =
        normalizeContent(
            session.currentContent
        );


    return `

        <section class="screen vote-screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

                <div class="round-label">
                    TOUR ${session.round}
                </div>

            </div>


            <div class="screen-content">

                <div class="eyebrow">
                    VOTE DU GROUPE
                </div>


                <div class="vote-question">

                    ${escapeHTML(
                        contentText(content)
                    )}

                </div>


                <p class="muted">
                    Désignez quelqu'un ensemble,
                    puis confirmez le choix.
                </p>


                <div class="player-list">

                    ${session.players
                        .map(
                            (player, index) => `

                                <button
                                    class="player-button"
                                    onclick="confirmGroupVote(${index})"
                                >
                                    ${escapeHTML(player)}
                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>

        </section>

    `;

}


function confirmGroupVote(index) {

    const candidate =
        session.players[index];

    if (!candidate) {
        return;
    }


    /*
     * Ici le téléphone ne vote pas.
     * L'application enregistre uniquement
     * le choix final du groupe.
     */

    session.votes = {
        GROUP: candidate
    };


    resetGameVotes();


    addGameVote(
        "GROUP",
        candidate
    );


    session.result = {

        type:
            "GROUP_VOTE",

        player:
            candidate

    };


    session.penaltyPlayer =
        candidate;


    setGameWinner(
        candidate
    );

    setGameLoser(
        candidate
    );

    resolveGame({

        winner:
            candidate,

        loser:
            candidate

    });


    goToGamePhase(
        FLOW_PHASES.RESOLVE
    );


    session.currentPhase =
        FLOW_PHASES.RESOLVE;


    render();

}


/* ============================================================
   PLAY
   ============================================================ */

function renderPlay() {

    return `

        <section class="screen game-screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

                <div class="round-label">
                    TOUR ${session.round}
                </div>

            </div>


            <div class="screen-content">

                ${getPublicContentHTML()}


                <button
                    class="primary-button"
                    onclick="completePlay()"
                >
                    TERMINÉ
                </button>

            </div>

        </section>

    `;

}


function completePlay() {

    const game =
        session.currentGame;


    if (!game) {
        return;
    }


    if (
        game.vote !==
        VOTE_MODES.NONE
    ) {

        showToast(
            "Le vote doit être terminé."
        );

        return;

    }


    resolveDirectGame();

}


/* ============================================================
   ROTATION
   ============================================================ */

function renderRotation() {

    return `

        <section class="screen game-screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                >
                    ←
                </button>

                <div class="round-label">
                    ${session.rotationIndex + 1}
                    /
                    ${session.rotationOrder.length}
                </div>

            </div>


            <div class="screen-content">

                ${getPublicContentHTML()}


                <button
                    class="primary-button"
                    onclick="nextRotationPlayer()"
                >
                    J'AI RÉPONDU
                </button>

            </div>

        </section>

    `;

}


function nextRotationPlayer() {

    session.rotationIndex++;


    if (
        session.rotationIndex >=
        session.rotationOrder.length
    ) {

        resolveDirectGame();

        return;

    }


    session.currentActor =
        session.rotationOrder[
            session.rotationIndex
        ];


    setGameActor(
        session.currentActor
    );


    render();

}


/* ============================================================
   RÉSOLUTION DIRECTE
   ============================================================ */

function resolveDirectGame() {

    const game =
        session.currentGame;


    if (!game) {
        return;
    }


    let loser =
        null;


    switch (
        game.penalty
    ) {

        case PENALTIES.ACTOR:

            loser =
                session.currentActor;

            break;


        case PENALTIES.TARGET:

            loser =
                session.currentTargets[0];

            break;


        case PENALTIES.LOSER:

            loser =
                GAME_FLOW.loser;

            break;


        case PENALTIES.VOTED_PLAYER:

            loser =
                session.penaltyPlayer;

            break;

    }


    session.penaltyPlayer =
        loser;


    if (loser) {

        setGameLoser(
            loser
        );

    }


    resolveGame({
        loser
    });


    goToGamePhase(
        FLOW_PHASES.RESOLVE
    );


    session.currentPhase =
        FLOW_PHASES.RESOLVE;


    render();

}


/* ============================================================
   CHOIX
   ============================================================ */

function renderChoice() {

    const content =
        normalizeContent(
            session.currentContent
        );

    const choices =
        content.choices ||
        [];


    return `

        <section class="screen">

            <div class="screen-content">

                <div class="eyebrow">
                    CHOIX
                </div>

                <h1>
                    ${escapeHTML(
                        content.question
                    )}
                </h1>


                <div class="player-list">

                    ${choices
                        .map(
                            (choice, index) => `

                                <button
                                    class="player-button"
                                    onclick="selectChoice(${index})"
                                >
                                    ${escapeHTML(choice)}
                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>

        </section>

    `;

}


function selectChoice(index) {

    const content =
        normalizeContent(
            session.currentContent
        );

    const choices =
        content.choices ||
        [];

    const choice =
        choices[index];

    if (choice == null) {
        return;
    }


    session.selectedChoice =
        choice;


    resolveGame();


    goToGamePhase(
        FLOW_PHASES.RESOLVE
    );


    session.currentPhase =
        FLOW_PHASES.RESOLVE;


    render();

}


/* ============================================================
   RÉSULTAT
   ============================================================ */

function renderResolve() {

    const game =
        session.currentGame;


    const player =
        session.result?.player ||
        session.penaltyPlayer ||
        GAME_FLOW.loser ||
        null;


    /*
     * Pas de pénalité :
     * on termine directement.
     */

    if (
        game.penalty ===
        PENALTIES.NONE
    ) {

        return `

            <section class="screen result-screen">

                <div class="screen-content">

                    <div class="eyebrow">
                        TERMINÉ
                    </div>

                    <h1>
                        ${escapeHTML(
                            game.name
                        )}
                    </h1>


                    <button
                        class="primary-button"
                        onclick="finishRound()"
                    >
                        TOUR SUIVANT
                    </button>

                </div>

            </section>

        `;

    }


    return `

        <section class="screen result-screen">

            <div class="screen-content">

                <div class="eyebrow">
                    RÉSULTAT
                </div>


                ${
                    player

                        ? `

                            <h1>
                                ${escapeHTML(
                                    player
                                )}
                            </h1>

                            <p>
                                C'est la personne désignée.
                            </p>

                        `

                        : `

                            <h1>
                                TOUR TERMINÉ
                            </h1>

                        `
                }


                <button
                    class="primary-button"
                    onclick="goToPenalty()"
                >
                    CONTINUER
                </button>

            </div>

        </section>

    `;

}


/* ============================================================
   PÉNALITÉ
   ============================================================ */

function goToPenalty() {

    goToGamePhase(
        FLOW_PHASES.PENALTY
    );

    session.currentPhase =
        FLOW_PHASES.PENALTY;

    render();

}


function renderPenalty() {

    const player =
        session.penaltyPlayer;


    if (!player) {

        finishRound();

        return "";

    }


    return `

        <section class="screen penalty-screen">

            <div class="screen-content">

                <div class="eyebrow">
                    PÉNALITÉ
                </div>

                <h1>
                    ${escapeHTML(
                        player
                    )}
                </h1>

                <p>
                    ${escapeHTML(
                        CONFIG.PENALTIES.DEFAULT
                    )}
                </p>


                <button
                    class="primary-button"
                    onclick="applyPenalty()"
                >
                    C'EST FAIT
                </button>

            </div>

        </section>

    `;

}


function applyPenalty() {

    finishRound();

}


/* ============================================================
   JOUEURS
   ============================================================ */

function renderPlayers() {

    return `

        <section class="screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="navigate('HOME')"
                >
                    ←
                </button>

                <h2>
                    JOUEURS
                </h2>

            </div>


            <div class="screen-content">

                <div class="player-list">

                    ${
                        session.players.length

                            ? session.players
                                .map(
                                    (player, index) => `

                                        <div class="player-row">

                                            <span>
                                                ${escapeHTML(player)}
                                            </span>

                                            <button
                                                class="small-button"
                                                onclick="removePlayer(${index})"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    `
                                )
                                .join("")

                            : `

                                <div class="empty-state">
                                    Aucun joueur.
                                </div>

                            `
                    }

                </div>


                <button
                    class="primary-button"
                    onclick="openPlayerModal()"
                >
                    + AJOUTER UN JOUEUR
                </button>


                <p class="muted center">
                    ${session.players.length}
                    /
                    ${CONFIG.PLAYERS.MAX}
                </p>

            </div>

        </section>

    `;

}


function openPlayerModal() {

    document
        .getElementById(
            "player-modal"
        )
        ?.remove();


    const modal =
        document.createElement("div");

    modal.id =
        "player-modal";

    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="modal">

            <div class="eyebrow">
                NOUVEAU JOUEUR
            </div>


            <input
                id="player-name-input"
                type="text"
                maxlength="24"
                autocomplete="off"
                placeholder="Prénom"
            >


            <div class="modal-actions">

                <button
                    class="secondary-button"
                    onclick="closePlayerModal()"
                >
                    ANNULER
                </button>

                <button
                    class="primary-button"
                    onclick="addPlayer()"
                >
                    AJOUTER
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const input =
        document.getElementById(
            "player-name-input"
        );


    input?.focus();


    input?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                addPlayer();

            }

        }
    );

}


function closePlayerModal() {

    document
        .getElementById(
            "player-modal"
        )
        ?.remove();

}


function addPlayer() {

    if (
        session.players.length >=
        CONFIG.PLAYERS.MAX
    ) {

        showToast(
            `Maximum ${CONFIG.PLAYERS.MAX} joueurs.`
        );

        return;

    }


    const input =
        document.getElementById(
            "player-name-input"
        );


    const name =
        input?.value
            ?.trim()
            .replace(
                /\s+/g,
                " "
            );


    if (!name) {

        showToast(
            "Entre un prénom."
        );

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

    if (
        !session.players[index]
    ) {
        return;
    }


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

    const levels = [

        {
            id: "COOL",
            name: "COOL",
            description:
                "Tranquille et léger."
        },

        {
            id: "CLASSIQUE",
            name: "CLASSIQUE",
            description:
                "Le rythme normal."
        },

        {
            id: "CHAUD",
            name: "CHAUD",
            description:
                "Plus personnel."
        },

        {
            id: "CHAOS",
            name: "CHAOS",
            description:
                "Sans filtre."
        }

    ];


    return `

        <section class="screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="navigate('HOME')"
                >
                    ←
                </button>

                <h2>
                    INTENSITÉ
                </h2>

            </div>


            <div class="screen-content">

                <div class="intensity-list">

                    ${levels
                        .map(
                            level => `

                                <button
                                    class="intensity-card ${
                                        session.intensity ===
                                        level.id
                                            ? "selected"
                                            : ""
                                    }"
                                    onclick="setIntensity('${level.id}')"
                                >

                                    <strong>
                                        ${level.name}
                                    </strong>

                                    <span>
                                        ${level.description}
                                    </span>

                                </button>

                            `
                        )
                        .join("")}

                </div>

            </div>

        </section>

    `;

}


function setIntensity(value) {

    if (
        !CONFIG.INTENSITY?.[value]
    ) {
        return;
    }


    session.intensity =
        value;

    saveSession();

    render();

}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

    return `

        <section class="screen home-screen">

            <div class="home-content">

                <div class="eyebrow">
                    PARTY GAME
                </div>


                <h1>
                    SOIRÉE
                </h1>


                <p>
                    ${session.players.length}
                    joueur${session.players.length > 1 ? "s" : ""}
                </p>


                <button
                    class="primary-button"
                    onclick="navigate('PLAYERS')"
                >
                    JOUEURS
                </button>


                <button
                    class="secondary-button"
                    onclick="navigate('INTENSITY')"
                >
                    INTENSITÉ
                </button>


                <button
                    class="primary-button large"
                    onclick="startRound()"
                    ${
                        session.players.length <
                        CONFIG.PLAYERS.MIN
                            ? "disabled"
                            : ""
                    }
                >
                    LANCER LA SOIRÉE
                </button>

            </div>

        </section>

    `;

}


/* ============================================================
   ROUTEUR DU JEU
   ============================================================ */

function renderGame() {

    const phase =
        getCurrentGamePhase();


    session.currentPhase =
        phase;


    switch (phase) {

        case FLOW_PHASES.PROMPT:

            return renderGameIntro();


        case FLOW_PHASES.SELECT_TARGET:

            return renderSelectTarget();


        case FLOW_PHASES.SELECT_PLAYERS:

            return renderSelectPlayers();


        case FLOW_PHASES.PRIVATE_REVEAL:

            return renderPrivateHandoff();


        case FLOW_PHASES.GROUP_VOTE:

            return renderGroupVote();


        case FLOW_PHASES.SECRET_VOTE:

            return renderGroupVote();


        case FLOW_PHASES.ROTATION:

            return renderRotation();


        case FLOW_PHASES.GROUP:

            /*
             * Choix particulier.
             */

            if (
                session.currentGame?.type ===
                GAME_TYPES.CHOICE
            ) {

                return renderChoice();

            }

            return renderPlay();


        case FLOW_PHASES.PLAY:

            return renderPlay();


        case FLOW_PHASES.RESOLVE:

            return renderResolve();


        case FLOW_PHASES.PENALTY:

            return renderPenalty();


        default:

            return renderGameIntro();

    }

}


/* ============================================================
   QUITTER
   ============================================================ */

function leaveGame() {

    const confirmed =
        window.confirm(
            "Quitter ce tour ?"
        );

    if (!confirmed) {
        return;
    }


    resetGameFlow();


    session.currentGame =
        null;

    session.currentContent =
        null;

    session.currentTargets =
        [];

    session.currentActor =
        null;

    session.currentPair =
        [];

    session.currentPhase =
        null;

    session.screen =
        "HOME";


    render();

}


/* ============================================================
   RENDER GLOBAL
   ============================================================ */

function render() {

    if (!app) {
        return;
    }


    switch (
        session.screen
    ) {

        case "HOME":

            app.innerHTML =
                renderHome();

            break;


        case "PLAYERS":

            app.innerHTML =
                renderPlayers();

            break;


        case "INTENSITY":

            app.innerHTML =
                renderIntensity();

            break;


        case "GAME":

            app.innerHTML =
                renderGame();

            break;


        case "SECRET":

            app.innerHTML =
                renderSecret();

            break;


        default:

            session.screen =
                "HOME";

            app.innerHTML =
                renderHome();

    }


    window.scrollTo(
        0,
        0
    );

}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

function runAppDiagnostics() {

    const gameReport =
        typeof validateAllGames ===
            "function"
            ? validateAllGames()
            : null;


    const questionReport =
        typeof validateQuestions ===
            "function"
            ? validateQuestions()
            : null;


    const flowReport =
        session.currentGame &&
        typeof validateGameFlow ===
            "function"

            ? validateGameFlow(
                session.currentGame
            )

            : null;


    const report = {

        games:
            gameReport,

        questions:
            questionReport,

        flow:
            flowReport,

        players:
            session.players.length,

        game:
            session.currentGame?.id ||
            null,

        phase:
            session.currentPhase ||
            null

    };


    console.group(
        "SOIRÉE — BUILD 08.1"
    );

    console.log(
        report
    );

    console.groupEnd();


    return report;

}


/* ============================================================
   ERREURS
   ============================================================ */

window.addEventListener(
    "error",
    event => {

        console.error(
            "SOIRÉE ERROR:",
            event.error ||
            event.message
        );

    }
);


/* ============================================================
   INITIALISATION
   ============================================================ */

function initApp() {

    loadSession();

    render();

}


initApp();
