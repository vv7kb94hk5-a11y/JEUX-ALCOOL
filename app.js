/* ============================================================
   SOIRÉE — APP
   BUILD 08.0
   ------------------------------------------------------------
   Application mobile-first
   Nouveau moteur de jeu :
   - pas de cible inventée pour les votes collectifs
   - pas de vote automatique
   - pas de résultat prématuré
   - téléphone uniquement pour les secrets
   - pas de fuite de contenu privé
   - une action principale par écran
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
        Math.floor(Math.random() * array.length)
    ];

}


function shuffle(array) {

    return [...array]
        .sort(() => Math.random() - 0.5);

}


function getQuestionPool(name) {

    if (
        typeof QUESTIONS === "undefined" ||
        !QUESTIONS
    ) {
        return [];
    }

    const pool = QUESTIONS[name];

    return Array.isArray(pool)
        ? pool
        : [];

}


function normalizeContent(content) {

    if (content == null) {
        return {
            text: ""
        };
    }

    if (typeof content === "string") {
        return {
            text: content
        };
    }

    if (typeof content === "object") {
        return content;
    }

    return {
        text: String(content)
    };

}


function contentText(content) {

    const item = normalizeContent(content);

    return (
        item.text ||
        item.instruction ||
        item.question ||
        item.prompt ||
        item.word ||
        item.expression ||
        item.challenge ||
        ""
    );

}


function showToast(message) {

    let toast = document.getElementById("soiree-toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "soiree-toast";

        toast.className = "toast";

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);

}


/* ============================================================
   SAUVEGARDE
   ============================================================ */

function saveSession() {

    if (
        typeof CONFIG === "undefined" ||
        !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
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
        typeof CONFIG === "undefined" ||
        !CONFIG.SESSION?.SAVE_TO_LOCAL_STORAGE
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
   NAVIGATION PRINCIPALE
   ============================================================ */

function navigate(screen) {

    session.screen = screen;

    render();

}


/* ============================================================
   JOUEURS
   ============================================================ */

function getAvailablePlayers() {

    const limit =
        CONFIG?.ROTATION?.RECENT_PLAYER_LIMIT || 3;

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

    const list =
        getAvailablePlayers();

    let pair =
        list.slice(0, 2);

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


function chooseRotationOrder() {

    return shuffle(
        session.players
    );

}


/* ============================================================
   SÉLECTION DU JEU
   ============================================================ */

function getCompatibleGames() {

    if (
        typeof GAMES === "undefined" ||
        !Array.isArray(GAMES)
    ) {
        return [];
    }

    return GAMES.filter(game => {

        return (
            session.players.length >=
                (game.minPlayers || 3)

            &&

            session.players.length <=
                (game.maxPlayers || 99)
        );

    });

}


function chooseGame() {

    let candidates =
        getCompatibleGames();

    if (!candidates.length) {
        return null;
    }

    /*
     * Évite de rejouer immédiatement
     * au même jeu.
     */

    const recentGames =
        session.history.slice(-3);

    const filtered =
        candidates.filter(
            game =>
                !recentGames.includes(
                    game.id
                )
        );

    if (filtered.length) {
        candidates = filtered;
    }


    /*
     * Diversité des familles.
     */

    const recentFamilies =
        session.history
            .slice(-2)
            .map(id => {

                const game =
                    getGameById(id);

                return game?.type || null;

            })
            .filter(Boolean);


    const diverse =
        candidates.filter(
            game =>
                !recentFamilies.includes(
                    game.type
                )
        );


    if (diverse.length) {
        candidates = diverse;
    }


    /*
     * Petite pondération par intensité.
     */

    const intensity =
        typeof getIntensityConfig === "function"
            ? getIntensityConfig(
                session.intensity
            )
            : {
                preferredIntensity: 2
            };


    const scored =
        candidates.map(game => {

            let score = 100;

            if (
                typeof game.intensity ===
                "number"
            ) {

                score -=
                    Math.abs(
                        game.intensity -
                        intensity.preferredIntensity
                    ) * 15;

            }

            score +=
                Math.random() * 40;

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
        Math.random() * total;


    for (const item of scored) {

        roll -= item.score;

        if (roll <= 0) {
            return item.game;
        }

    }


    return scored[0].game;

}


function getGameById(id) {

    if (
        typeof GAMES === "undefined"
    ) {
        return null;
    }

    return GAMES.find(
        game => game.id === id
    ) || null;

}


/* ============================================================
   CONTENU
   ============================================================ */

function getContentForGame(game) {

    if (!game) {
        return null;
    }

    const pool =
        getQuestionPool(
            game.contentPool
        );

    if (!pool.length) {

        console.warn(
            `Aucun contenu pour ${game.contentPool}`
        );

        return null;

    }


    /*
     * HOT :
     * filtre selon l'intensité.
     */

    if (
        game.contentPool === "HOT"
    ) {

        const max =
            session.intensity === "COOL"
                ? 1
                : session.intensity === "CLASSIQUE"
                    ? 2
                    : 3;

        const filtered =
            pool.filter(item =>
                typeof item === "object" &&
                (
                    item.intensity == null ||
                    item.intensity <= max
                )
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
   ------------------------------------------------------------
   IMPORTANT :
   Les jeux GROUP_VOTE n'ont PAS de cible préalable.
   ============================================================ */

function assignRoles(game) {

    session.currentActor = null;

    session.currentTargets = [];

    session.currentPair = [];

    session.selectedPlayers = [];


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
                session.currentPair[0] || null;

            break;


        case ACTOR_MODES.ROTATION:

            session.rotationOrder =
                chooseRotationOrder();

            session.rotationIndex = 0;

            session.currentActor =
                session.rotationOrder[0] || null;

            break;


        case ACTOR_MODES.ALL:

            session.currentTargets =
                [...session.players];

            break;


        case ACTOR_MODES.NONE:

        default:

            break;

    }


    /*
     * Une cible classique ONE/TWO est attribuée
     * uniquement si le contrat du jeu le demande.
     *
     * TARGET: VOTE reste vide jusqu'à la résolution.
     */

    if (
        game.target === TARGET_MODES.ONE &&
        !session.currentTargets.length
    ) {

        if (
            game.actor === ACTOR_MODES.NONE
        ) {

            const target =
                choosePlayer();

            session.currentTargets =
                target
                    ? [target]
                    : [];

        }

    }


    if (
        game.target === TARGET_MODES.TWO &&
        session.currentTargets.length < 2
    ) {

        session.currentPair =
            chooseTwoPlayers();

        session.currentTargets =
            [...session.currentPair];

    }


    /*
     * Pour un jeu TARGET_CHALLENGE avec acteur + cible,
     * on évite si possible que ce soit la même personne.
     */

    if (
        game.actor === ACTOR_MODES.ONE &&
        game.target === TARGET_MODES.ONE
    ) {

        const actor =
            session.currentActor;

        let target =
            choosePlayer();

        if (
            target === actor &&
            session.players.length > 1
        ) {

            target =
                session.players.find(
                    player =>
                        player !== actor
                );

        }

        session.currentTargets =
            target
                ? [target]
                : [];

    }

}


/* ============================================================
   PRÉPARATION DU TOUR
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
        getContentForGame(game);

    session.votes = {};

    session.selectedChoice = null;

    session.result = null;

    session.penaltyPlayer = null;


    assignRoles(game);


    session.round++;


    session.history.push(
        game.id
    );


    /*
     * Nouveau GAME_FLOW.
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

    setGameContent(
        session.currentContent
    );


    saveSession();


    return game;

}


/* ============================================================
   DÉMARRAGE
   ============================================================ */

function startRound() {

    if (
        session.players.length <
        CONFIG.PLAYERS.MIN
    ) {

        showToast(
            `Ajoute au moins ${CONFIG.PLAYERS.MIN} joueurs.`
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
   PHASES
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


function goPhase(phase) {

    if (
        goToGamePhase(phase)
    ) {

        session.currentPhase =
            phase;

        render();

    }

}


/* ============================================================
   FIN DE TOUR
   ============================================================ */

function finishRound() {

    session.currentPhase = null;

    session.currentGame = null;

    session.currentContent = null;

    session.currentActor = null;

    session.currentTargets = [];

    session.currentPair = [];

    session.votes = {};

    session.result = null;

    session.penaltyPlayer = null;

    saveSession();

    session.screen =
        "HOME";

    render();

}


/* ============================================================
   SECRET
   ============================================================ */

function getPrivateContentHTML() {

    const content =
        normalizeContent(
            session.currentContent
        );

    const pool =
        session.currentGame?.contentPool;


    if (!session.currentContent) {

        return `
            <div class="game-card">
                <p>
                    Le secret est indisponible.
                </p>
            </div>
        `;

    }


    let value = "";


    if (
        pool === "FORBIDDEN_WORD" ||
        pool === "TRAP_WORD"
    ) {

        value =
            content.word ||
            content.text ||
            "";

    }

    else if (
        pool === "EXPRESSION"
    ) {

        value =
            content.expression ||
            content.text ||
            content.word ||
            "";

    }

    else if (
        pool === "GUESS_WORD"
    ) {

        value =
            content.word ||
            content.text ||
            "";

    }

    else {

        value =
            content.text ||
            content.instruction ||
            content.question ||
            content.prompt ||
            content.challenge ||
            content.word ||
            content.expression ||
            "";

    }


    return `

        <div class="secret-card">

            <div class="eyebrow">
                SECRET
            </div>

            <div class="secret-value">
                ${escapeHTML(value)}
            </div>

        </div>

    `;

}


/* ============================================================
   PUBLIC CONTENT
   ------------------------------------------------------------
   JAMAIS afficher le contenu privé ici.
   ============================================================ */

function getPublicContentHTML() {

    const game =
        session.currentGame;

    const content =
        normalizeContent(
            session.currentContent
        );


    if (!game) {
        return "";
    }


    /*
     * Pour les jeux secrets :
     * le groupe ne voit jamais la réponse.
     */

    if (
        game.type === GAME_TYPES.SECRET ||
        game.phone === true
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    ${escapeHTML(game.name)}
                </div>

                <h2>
                    ${escapeHTML(
                        session.currentActor ||
                        session.currentTargets[0] ||
                        "À toi"
                    )}
                </h2>

                <p>
                    Ton secret est sur le téléphone.
                </p>

            </div>

        `;

    }


    /*
     * GROUP_VOTE
     */

    if (
        game.type === GAME_TYPES.GROUP_VOTE
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    VOTE DU GROUPE
                </div>

                <h2>
                    ${escapeHTML(
                        contentText(content)
                    )}
                </h2>

                <p>
                    Tout le monde vote en même temps.
                </p>

            </div>

        `;

    }


    /*
     * ROTATION
     */

    if (
        game.type === GAME_TYPES.ROTATION
    ) {

        return `

            <div class="game-card">

                <div class="eyebrow">
                    ${escapeHTML(game.name)}
                </div>

                <h2>
                    ${escapeHTML(
                        contentText(content)
                    )}
                </h2>

                <p>
                    ${escapeHTML(
                        session.currentActor || ""
                    )}
                    , à toi.
                </p>

            </div>

        `;

    }


    /*
     * BLUFF
     */

    if (
        game.type === GAME_TYPES.BLUFF
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

                <p>
                    ${escapeHTML(
                        session.currentActor || ""
                    )}
                    joue. Le groupe devra trancher.
                </p>

            </div>

        `;

    }


    /*
     * Jeu classique.
     */

    return `

        <div class="game-card">

            <div class="eyebrow">
                ${escapeHTML(game.name)}
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
   PASSAGE DU TÉLÉPHONE
   ------------------------------------------------------------
   UN SEUL écran.
   Pas de "rends le téléphone" supplémentaire.
   ============================================================ */

function renderPrivateHandoff() {

    const target =
        session.currentTargets[0] ||
        session.currentActor;

    return `

        <section class="screen private-screen">

            <div class="screen-top">

                <button
                    class="icon-button"
                    onclick="leaveGame()"
                    aria-label="Quitter"
                >
                    ←
                </button>

            </div>

            <div class="screen-content">

                <div class="phone-icon">
                    📱
                </div>

                <div class="eyebrow">
                    SECRET
                </div>

                <h1>
                    ${escapeHTML(target || "Joueur")}
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


/* ============================================================
   RÉVÉLATION SECRÈTE
   ============================================================ */

function revealSecret() {

    /*
     * Sécurité :
     * la phase doit être PRIVATE_REVEAL.
     */

    if (
        session.currentGame?.phone !== true
    ) {

        showToast(
            "Ce jeu ne nécessite pas le téléphone."
        );

        return;

    }


    if (
        getCurrentGamePhase() !==
        FLOW_PHASES.PRIVATE_REVEAL
    ) {

        showToast(
            "Cette information n'est pas disponible ici."
        );

        return;

    }


    session.screen =
        "SECRET";

    render();

}


/* ============================================================
   QUITTER LE SECRET
   ============================================================ */

function leaveSecret() {

    /*
     * Le secret n'est jamais copié dans un écran public.
     */

    session.screen =
        "GAME";

    advancePhase();

}


/* ============================================================
   VOTE COLLECTIF
   ------------------------------------------------------------
   Le groupe vote PHYSIQUEMENT.
   L'application ne compte pas à la place des joueurs.
   Un seul joueur confirme ensuite le résultat.
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
                    VOTE
                </div>

                <h1>
                    ${escapeHTML(game.name)}
                </h1>

                <div class="vote-question">

                    ${escapeHTML(
                        contentText(content)
                    )}

                </div>

                <p class="muted">
                    Votez tous en même temps,
                    puis indiquez le joueur choisi.
                </p>


                <div class="player-list">

                    ${session.players
                        .map((player, index) => `

                            <button
                                class="player-button"
                                onclick="confirmGroupVote(${index})"
                            >
                                <span>
                                    ${escapeHTML(player)}
                                </span>
                            </button>

                        `)
                        .join("")}

                </div>

            </div>

        </section>

    `;

}


/* ============================================================
   CONFIRMATION DU VOTE
   ============================================================ */

function confirmGroupVote(index) {

    const candidate =
        session.players[index];

    if (!candidate) {
        return;
    }


    /*
     * Le groupe a physiquement voté.
     * L'application enregistre seulement
     * le résultat collectif.
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
        type: "GROUP_VOTE",
        player: candidate
    };


    resolveGroupVote(
        candidate
    );

}


/* ============================================================
   RÉSOLUTION DU VOTE
   ============================================================ */

function resolveGroupVote(candidate) {

    const game =
        session.currentGame;

    if (!game) {
        return;
    }


    setGameWinner(
        candidate
    );


    /*
     * Le "perdant" est la personne désignée.
     */

    if (
        game.penalty ===
        PENALTIES.VOTED_PLAYER
    ) {

        setGameLoser(
            candidate
        );

        session.penaltyPlayer =
            candidate;

    }


    resolveGame({
        winner: candidate,
        loser:
            session.penaltyPlayer
    });


    session.currentPhase =
        "RESOLVE";

    render();

}


/* ============================================================
   RÉSOLUTION D'UN JEU SANS VOTE
   ============================================================ */

function resolveDirectGame() {

    const game =
        session.currentGame;

    if (!game) {
        return;
    }


    let loser = null;


    if (
        game.penalty ===
        PENALTIES.ACTOR
    ) {

        loser =
            session.currentActor;

    }

    else if (
        game.penalty ===
        PENALTIES.TARGET
    ) {

        loser =
            session.currentTargets[0];

    }


    session.penaltyPlayer =
        loser;


    setGameLoser(
        loser
    );


    resolveGame({
        loser
    });


    session.currentPhase =
        "RESOLVE";

    render();

}


/* ============================================================
   ROTATION
   ============================================================ */

function finishRotationTurn() {

    const game =
        session.currentGame;

    if (!game) {
        return;
    }


    resolveDirectGame();

}


/* ============================================================
   CHOIX
   ============================================================ */

function selectChoice(index) {

    const content =
        normalizeContent(
            session.currentContent
        );


    let choices =
        content.choices ||
        content.options;


    if (
        !Array.isArray(choices)
    ) {

        showToast(
            "Choix indisponibles."
        );

        return;

    }


    const choice =
        choices[index];

    if (choice == null) {
        return;
    }


    session.selectedChoice =
        choice;


    resolveGame();

    session.currentPhase =
        "RESOLVE";

    render();

}


/* ============================================================
   JEU TERMINÉ
   ============================================================ */

function completePlay() {

    const game =
        session.currentGame;

    if (!game) {
        return;
    }


    /*
     * Les votes ne doivent pas être
     * validés avec "terminé".
     */

    if (
        game.vote !== VOTE_MODES.NONE
    ) {

        if (
            game.vote ===
            VOTE_MODES.GROUP
        ) {

            showToast(
                "Le groupe doit d'abord voter."
            );

        }

        return;

    }


    resolveDirectGame();

}


/* ============================================================
   PÉNALITÉ
   ============================================================ */

function applyPenalty() {

    const player =
        session.penaltyPlayer;

    if (!player) {

        finishRound();

        return;

    }


    session.result = {

        ...(session.result || {}),

        penalty:
            player

    };


    finishRound();

}


/* ============================================================
   ÉCRANS
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
                    ${session.players.length < CONFIG.PLAYERS.MIN ? "disabled" : ""}
                >
                    LANCER LA SOIRÉE
                </button>

            </div>

        </section>

    `;

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

                    ${session.players.length

                        ? session.players
                            .map((player, index) => `

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

                            `)
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
                    onclick="openAddPlayer()"
                >
                    + AJOUTER UN JOUEUR
                </button>


                <p class="muted center">
                    ${session.players.length}
                    / ${CONFIG.PLAYERS.MAX}
                </p>

            </div>

        </section>

    `;

}


function openAddPlayer() {

    openPlayerModal();

}


function openPlayerModal() {

    let modal =
        document.getElementById(
            "player-modal"
        );


    if (modal) {

        modal.remove();

    }


    modal =
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
            .replace(/\s+/g, " ");


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

                    ${levels.map(level => `

                        <button
                            class="intensity-card ${
                                session.intensity === level.id
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

                    `).join("")}

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
   INTRO DU JEU
   ------------------------------------------------------------
   Plus de faux écran "tour terminé".
   ============================================================ */

function renderGameIntro() {

    const game =
        session.currentGame;


    const actor =
        session.currentActor ||
        session.currentTargets[0];


    return `

        <section class="screen game-intro-screen">

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
                    ${escapeHTML(
                        game.type === GAME_TYPES.GROUP_VOTE
                            ? "VOTE"
                            : game.type === GAME_TYPES.BLUFF
                                ? "BLUFF"
                                : game.type === GAME_TYPES.SECRET
                                    ? "SECRET"
                                    : "NOUVEAU DÉFI"
                    )}
                </div>


                <h1>
                    ${escapeHTML(game.name)}
                </h1>


                ${
                    actor
                        ? `
                            <p class="target-label">
                                ${escapeHTML(actor)}
                            </p>
                        `
                        : ""
                }


                <button
                    class="primary-button"
                    onclick="startGameAction()"
                >
                    COMMENCER
                </button>

            </div>

        </section>

    `;

}


/* ============================================================
   ACTION DE DÉMARRAGE
   ============================================================ */

function startGameAction() {

    const game =
        session.currentGame;

    if (!game) {
        return;
    }


    /*
     * Le premier écran peut être directement
     * l'action utile.
     */

    if (
        game.flow.includes(
            FLOW_PHASES.SELECT_TARGET
        ) &&
        game.flow[0] ===
            FLOW_PHASES.SELECT_TARGET
    ) {

        /*
         * La cible a déjà été attribuée
         * par le moteur.
         * On passe directement à la suite.
         */

        advancePhase();

        return;

    }


    advancePhase();

}


/* ============================================================
   ÉCRAN SELECT TARGET
   ------------------------------------------------------------
   Utilisé uniquement quand une sélection réelle
   doit être faite à l'écran.
   ============================================================ */

function renderSelectTarget() {

    const game =
        session.currentGame;


    /*
     * Pour ONE, la cible est déjà déterminée.
     * On ne fait donc pas apparaître un écran
     * de sélection artificiel.
     */

    if (
        game.target ===
        TARGET_MODES.ONE &&
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
                    CHOISISSEZ
                </div>

                <h1>
                    Qui joue ?
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
   SELECT TWO
   ============================================================ */

function renderSelectPlayers() {

    const selected =
        session.selectedPlayers || [];


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
                    ${selected.length}/2
                </div>

                <h1>
                    Choisissez deux joueurs
                </h1>


                <div class="player-list">

                    ${session.players
                        .map((player, index) => {

                            const active =
                                selected.includes(
                                    player
                                );

                            return `

                                <button
                                    class="player-button ${
                                        active
                                            ? "selected"
                                            : ""
                                    }"
                                    onclick="toggleSelectedPlayer(${index})"
                                >
                                    ${escapeHTML(player)}
                                </button>

                            `;

                        })
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
                item => item !== player
            );

    }

    else {

        if (
            session.selectedPlayers.length >= 2
        ) {

            showToast(
                "Choisis seulement deux joueurs."
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
   PLAY
   ============================================================ */

function renderPlay() {

    const game =
        session.currentGame;


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


                ${
                    game.timer
                        ? `
                            <div class="timer">
                                ${game.timer}s
                            </div>
                        `
                        : ""
                }


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


/* ============================================================
   ROTATION
   ============================================================ */

function renderRotation() {

    const actor =
        session.currentActor;


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
                    onclick="finishRotationTurn()"
                >
                    J'AI RÉPONDU
                </button>

            </div>

        </section>

    `;

}


/* ============================================================
   RESOLVE
   ============================================================ */

function renderResolve() {

    const game =
        session.currentGame;


    const player =
        session.result?.player ||
        session.penaltyPlayer ||
        GAME_FLOW.loser ||
        GAME_FLOW.winner ||
        null;


    /*
     * Jeu sans pénalité :
     * pas d'écran résultat artificiel.
     */

    if (
        game.penalty === PENALTIES.NONE
    ) {

        return `

            <section class="screen result-screen">

                <div class="screen-content">

                    <div class="eyebrow">
                        TERMINÉ
                    </div>

                    <h1>
                        ${escapeHTML(game.name)}
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
                                ${escapeHTML(player)}
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

    session.currentPhase =
        FLOW_PHASES.PENALTY;

    goToGamePhase(
        FLOW_PHASES.PENALTY
    );

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
                    ${escapeHTML(player)}
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


/* ============================================================
   SECRET SCREEN
   ============================================================ */

function renderSecret() {

    const owner =
        session.currentTargets[0] ||
        session.currentActor;


    return `

        <section class="screen private-screen">

            <div class="screen-top">

                <div class="eyebrow">
                    ${escapeHTML(
                        owner || "SECRET"
                    )}
                </div>

            </div>


            <div class="screen-content">

                ${getPrivateContentHTML()}


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


/* ============================================================
   GAME ROUTER
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

            /*
             * Uniquement pour un vrai secret.
             */

            if (
                session.currentGame?.phone !== true
            ) {

                advancePhase();

                return "";

            }

            return renderPrivateHandoff();


        case FLOW_PHASES.GROUP_VOTE:

            return renderGroupVote();


        case FLOW_PHASES.SECRET_VOTE:

            /*
             * Aucun jeu actuel ne demande encore
             * de vote secret.
             */

            return renderGroupVote();


        case FLOW_PHASES.ROTATION:

            return renderRotation();


        case FLOW_PHASES.GROUP:

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
   QUITTER LE JEU
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

    session.currentGame = null;

    session.currentContent = null;

    session.currentTargets = [];

    session.currentActor = null;

    session.currentPair = [];

    session.votes = {};

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


    switch (session.screen) {

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

            break;

    }


    /*
     * Remonte toujours en haut
     * lors d'un changement d'écran.
     */

    window.scrollTo(
        0,
        0
    );

}


/* ============================================================
   DIAGNOSTIC
   ============================================================ */

function runAppDiagnostics() {

    const report = {

        games:
            typeof validateAllGames ===
            "function"
                ? validateAllGames()
                : null,

        flow:
            session.currentGame
                ? validateGameFlow(
                    session.currentGame
                )
                : null,

        players:
            session.players.length,

        currentGame:
            session.currentGame?.id || null,

        phase:
            session.currentPhase || null

    };


    console.group(
        "SOIRÉE — BUILD 08.0 DIAGNOSTIC"
    );

    console.log(
        report
    );

    console.groupEnd();


    return report;

}


/* ============================================================
   INITIALISATION
   ============================================================ */

function initApp() {

    loadSession();

    render();

}


/* ============================================================
   PROTECTION CONTRE LES ERREURS DE RENDU
   ============================================================ */

window.addEventListener(
    "error",
    event => {

        console.error(
            "SOIRÉE ERROR:",
            event.error || event.message
        );

    }
);


/* ============================================================
   DÉMARRAGE
   ============================================================ */

initApp();
