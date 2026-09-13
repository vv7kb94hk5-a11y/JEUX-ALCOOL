/* ============================================================
   SOIRÉE — PARTY ENGINE
   BUILD 04.0

   Architecture :
   GAME
   → PHASES
   → ROLES
   → SCREENS
   → ACTIONS

   IMPORTANT :
   Les informations privées ne sont jamais affichées
   dans l'écran public.
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

    voteChoices: [],

    selectedChoice: null

};


/* ============================================================
   NAVIGATION
   ============================================================ */

function navigate(screen) {

    session.screen = screen;

    render();

}


/* ============================================================
   UTILITAIRES
   ============================================================ */

function randomItem(array) {

    if (!array || !array.length) {
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


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ============================================================
   STOCKAGE
   ============================================================ */

function saveSession() {

    if (!CONFIG.SESSION.SAVE_TO_LOCAL_STORAGE) {
        return;
    }

    try {

        localStorage.setItem(
            CONFIG.SESSION.STORAGE_KEY,
            JSON.stringify({
                players: session.players,
                intensity: session.intensity,
                history: session.history,
                playerHistory: session.playerHistory
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

    if (!CONFIG.SESSION.SAVE_TO_LOCAL_STORAGE) {
        return;
    }

    try {

        const raw = localStorage.getItem(
            CONFIG.SESSION.STORAGE_KEY
        );

        if (!raw) {
            return;
        }

        const saved = JSON.parse(raw);

        if (Array.isArray(saved.players)) {
            session.players = saved.players;
        }

        if (saved.intensity) {
            session.intensity = saved.intensity;
        }

        if (Array.isArray(saved.history)) {
            session.history = saved.history;
        }

        if (Array.isArray(saved.playerHistory)) {
            session.playerHistory =
                saved.playerHistory;
        }

    } catch (error) {

        console.warn(
            "Session précédente illisible.",
            error
        );

    }

}


/* ============================================================
   JOUEURS
   ============================================================ */

function getAvailablePlayers() {

    const recent =
        session.playerHistory.slice(
            -CONFIG.ROTATION.RECENT_PLAYER_LIMIT
        );

    let available =
        session.players.filter(
            player => !recent.includes(player)
        );

    if (!available.length) {
        available = [...session.players];
    }

    return shuffle(available);

}


function choosePlayer() {

    const available =
        getAvailablePlayers();

    const player =
        randomItem(available);

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

    if (available.length >= 2) {

        const players =
            available.slice(0, 2);

        players.forEach(player => {

            session.playerHistory.push(
                player
            );

        });

        return players;

    }

    return shuffle(
        session.players
    ).slice(0, 2);

}


function choosePair() {

    return shuffle(
        session.players
    ).slice(0, 2);

}


function getAllPlayers() {

    return [...session.players];

}


/* ============================================================
   JEUX
   ============================================================ */

function isCompatible(game) {

    return (
        session.players.length >= game.minPlayers &&
        session.players.length <= game.maxPlayers
    );

}


function isGameOnCooldown(game) {

    const cooldown =
        game.cooldown ||
        CONFIG.COOLDOWN.GAME;

    return session.history
        .slice(-cooldown)
        .includes(game.id);

}


function isFamilyOverused(game) {

    const limit =
        CONFIG.DIVERSITY.MAX_SAME_FAMILY;

    const recent =
        session.history
            .slice(-limit)
            .map(id =>
                GAMES.find(
                    game => game.id === id
                )
            )
            .filter(Boolean);

    if (recent.length < limit) {
        return false;
    }

    return recent.every(
        item =>
            item.family === game.family
    );

}


function getCandidates() {

    let candidates =
        GAMES.filter(game => {

            if (!isCompatible(game)) {
                return false;
            }

            if (isGameOnCooldown(game)) {
                return false;
            }

            return true;

        });

    if (!candidates.length) {

        candidates =
            GAMES.filter(
                game =>
                    isCompatible(game)
            );

    }

    return candidates;

}


function scoreGame(game) {

    let score = 100;

    const intensity =
        getIntensityConfig(
            session.intensity
        );

    const distance =
        Math.abs(
            game.intensity -
            intensity.preferredIntensity
        );

    score -= distance * 18;

    if (isFamilyOverused(game)) {
        score -= 60;
    }

    if (
        session.currentGame &&
        session.currentGame.family ===
        game.family
    ) {

        score -= 15;

    }

    if (game.family === "CHAOS") {

        score +=
            20 *
            intensity.chaosMultiplier;

    }

    if (game.family === "PERSONNEL") {

        score +=
            10 *
            intensity.hotMultiplier;

    }

    score +=
        Math.random() *
        100 *
        CONFIG.PROBABILITY.RANDOMNESS;

    return Math.max(
        score,
        1
    );

}


function chooseGame() {

    const candidates =
        getCandidates();

    if (!candidates.length) {
        return null;
    }

    const scored =
        candidates.map(game => ({
            game,
            score: scoreGame(game)
        }));

    const total =
        scored.reduce(
            (sum, item) =>
                sum + item.score,
            0
        );

    let value =
        Math.random() * total;

    for (const item of scored) {

        value -= item.score;

        if (value <= 0) {
            return item.game;
        }

    }

    return scored[0].game;

}


/* ============================================================
   CONTENU
   ============================================================ */

function getContentForGame(game) {

    if (!game) {
        return null;
    }

    const pool =
        game.contentPool;

    if (!pool) {
        return null;
    }

    if (pool === "HOT") {
        return getHotQuestion();
    }

    if (pool === "CHAOS") {
        return getChaosContent();
    }

    return randomItem(
        QUESTIONS[pool] || []
    );

}


function getHotQuestion() {

    const pool =
        QUESTIONS.HOT || [];

    const maximum =
        session.intensity === "COOL"
            ? 2
            : 3;

    const filtered =
        pool.filter(
            item =>
                item.intensity <= maximum
        );

    return randomItem(
        filtered.length
            ? filtered
            : pool
    );

}


function getChaosContent() {

    const sources = [

        ...(QUESTIONS.CATEGORY || []),
        ...(QUESTIONS.CHOICE || []),
        ...(QUESTIONS.MIME || []),
        ...(QUESTIONS.IMPRO || []),
        ...(QUESTIONS.DUO || [])

    ];

    return randomItem(sources);

}


/* ============================================================
   RÔLES
   ============================================================ */

function assignRoles(game) {

    session.currentActor = null;

    session.currentTargets = [];

    session.currentPair = [];

    if (!game) {
        return;
    }


    switch (game.targetType) {

        case "ONE":

            session.currentActor =
                choosePlayer();

            session.currentTargets =
                [session.currentActor];

            break;


        case "TWO_PLAYERS":
        case "TWO":

            session.currentPair =
                chooseTwoPlayers();

            session.currentTargets =
                [...session.currentPair];

            session.currentActor =
                session.currentPair[0];

            break;


        case "PAIR":

            session.currentPair =
                choosePair();

            session.currentTargets =
                [...session.currentPair];

            session.currentActor =
                session.currentPair[0];

            break;


        case "ALL":

            session.currentTargets =
                getAllPlayers();

            break;


        case "ROTATION":

            session.currentActor =
                choosePlayer();

            session.currentTargets =
                [session.currentActor];

            break;


        default:

            session.currentTargets = [];

    }

}


/* ============================================================
   PRÉPARATION D'UNE PARTIE
   ============================================================ */

function prepareRound() {

    const game =
        chooseGame();

    if (!game) {
        return null;
    }

    const content =
        getContentForGame(game);

    session.currentGame =
        game;

    session.currentContent =
        content;

    assignRoles(game);

    session.currentPhase =
        game.phases?.[0] || "INTRO";

    session.currentGame =
        game;

    session.round++;

    session.history.push(
        game.id
    );

    if (
        session.history.length >
        CONFIG.SESSION.MAX_HISTORY
    ) {

        session.history.shift();

    }

    session.voteChoices = [];

    session.selectedChoice = null;

    saveSession();

    return game;

}


/* ============================================================
   FLOW
   ============================================================ */

function startRound() {

    const game =
        prepareRound();

    if (!game) {
        return;
    }

    GAME_FLOW.resetGameFlow();

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

    if (session.currentPair.length) {

        setCurrentPlayers(
            session.currentPair
        );

    }

    setPublicContent(
        session.currentContent
    );

    setPrivateContent(null);

    syncPhase();

    session.screen =
        "GAME";

    render();

}


function syncPhase() {

    const phase =
        GAME_FLOW.currentPhase;

    session.currentPhase =
        phase;

    render();

}


function advancePhase() {

    const next =
        nextGamePhase();

    if (!next) {

        session.screen =
            "HOME";

        render();

        return;

    }

    syncPhase();

}


/* ============================================================
   CONTENU TEXTUEL
   ============================================================ */

function getContentText() {

    const game =
        session.currentGame;

    const content =
        session.currentContent;

    if (!game || !content) {
        return "Préparez-vous.";
    }


    switch (game.contentPool) {

        case "VOTE":
        case "MAJORITY":
        case "TARGET":
        case "KNOWLEDGE":
        case "SUSPECT":
        case "HOT":
        case "CHOICE":
        case "WOULD_YOU_RATHER":
        case "GROUP_TRUTH":

            return escapeHTML(
                content.text
            );


        case "CATEGORY":

            return `
                <div class="game-label">
                    CATÉGORIE
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.category
                    )}
                </div>

                <div class="game-subtext">
                    Répondez chacun votre tour.
                </div>
            `;


        case "WORD":

            return `
                <div class="game-label">
                    MOT
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.word
                    )}
                </div>
            `;


        case "FORBIDDEN_WORD":

            return `
                <div class="game-label">
                    MOT À ÉVITER
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.word
                    )}
                `;


        case "TRAP_WORD":

            return `
                <div class="game-label">
                    MOT SECRET
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.word
                    )}
                </div>

                <div class="game-subtext">
                    Interdits :
                    ${content.forbidden
                        .map(
                            word =>
                                escapeHTML(word)
                        )
                        .join(", ")
                    }
                </div>
            `;


        case "TRAP_PROMPT":
        case "DESCRIPTION":
        case "IMPRO":
        case "DUO":
        case "BLUFF":

            return escapeHTML(
                content.prompt
            );


        case "GUESS_WORD":

            return `
                <div class="game-label">
                    MOT SECRET
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.word
                    )}
                </div>
            `;


        case "EXPRESSION":

            return `
                <div class="game-label">
                    EXPRESSION
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.expression
                    )}
                </div>
            `;


        case "MIME":

            return escapeHTML(
                content.action
            );


        case "MISSION":

            return `
                <div class="game-label">
                    MISSION
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.mission
                    )}
                </div>
            `;


        case "SECRET_RULE":

            return `
                <div class="game-label">
                    RÈGLE
                </div>

                <div class="game-main-text">
                    ${escapeHTML(
                        content.rule
                    )}
                </div>
            `;


        case "STATEMENTS":

            return escapeHTML(
                content.instruction
            );


        case "CHAOS":

            return formatGenericContent(
                content
            );


        case "GROUP":

            return formatGenericContent(
                content
            );


        case "DUEL":

            return `
                Le duel commence.
                <br><br>
                Le premier joueur à réussir
                remporte le point.
            `;


        default:

            return "À vous de jouer.";

    }

}


function formatGenericContent(content) {

    if (content.text) {
        return escapeHTML(
            content.text
        );
    }

    if (content.prompt) {
        return escapeHTML(
            content.prompt
        );
    }

    if (content.category) {
        return escapeHTML(
            content.category
        );
    }

    if (content.action) {
        return escapeHTML(
            content.action
        );
    }

    return "À vous de jouer.";

}


/* ============================================================
   PHASE INTRO
   ============================================================ */

function renderIntro() {

    const game =
        session.currentGame;

    app.innerHTML = `

        <section class="game-screen">

            <div class="game-header">

                <span>
                    TOUR ${session.round}
                </span>

                <span>
                    ${escapeHTML(
                        game.family
                    )}
                </span>

            </div>

            <div class="game-card">

                <div class="game-kicker">
                    NOUVEAU DÉFI
                </div>

                <h1>
                    ${escapeHTML(
                        game.name
                    )}
                </h1>

                <p>
                    Préparez-vous.
                    Lisez les instructions
                    avant de commencer.
                </p>

            </div>

            <button
                class="primary-btn"
                onclick="advancePhase()"
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

    const target =
        session.currentTargets[0];

    app.innerHTML = `

        <section class="game-screen">

            <div class="game-card">

                <div class="game-kicker">
                    CIBLE
                </div>

                <h1>
                    ${escapeHTML(target)}
                </h1>

                <p>
                    ${escapeHTML(
                        session.currentGame.name
                    )}
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
   SÉLECTION JOUEURS
   ============================================================ */

function renderSelectPlayers() {

    const players =
        session.currentPair.length
            ? session.currentPair
            : session.currentTargets;

    app.innerHTML = `

        <section class="game-screen">

            <div class="game-card">

                <div class="game-kicker">
                    JOUEURS
                </div>

                <h1>
                    ${players
                        .map(
                            player =>
                                escapeHTML(player)
                        )
                        .join(" + ")
                    }
                </h1>

                <p>
                    Vous êtes les joueurs
                    désignés pour ce défi.
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

    const target =
        session.currentActor ||
        session.currentTargets[0];

    const mode =
        session.currentGame.phone?.mode;

    let title =
        "DONNE LE TÉLÉPHONE";

    if (mode === "PASS_TO_TARGET") {

        title =
            `DONNE LE TÉLÉPHONE À ${escapeHTML(
                target
            )}`;

    }

    if (mode === "PASS_TO_PLAYER") {

        title =
            `DONNE LE TÉLÉPHONE À ${escapeHTML(
                target
            )}`;

    }

    if (mode === "PASS_TO_PAIR") {

        title =
            "DONNE LE TÉLÉPHONE AU DUO";

    }

    app.innerHTML = `

        <section class="private-transition">

            <div class="private-icon">
                🔒
            </div>

            <div class="game-kicker">
                INFORMATION PRIVÉE
            </div>

            <h1>
                ${title}
            </h1>

            <p>
                Les autres joueurs ne doivent
                pas regarder l'écran.
            </p>

            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                LE TÉLÉPHONE EST PRÊT
            </button>

        </section>

    `;

}


/* ============================================================
   CONTENU PRIVÉ
   ============================================================ */

function getPrivateContentHTML() {

    const content =
        session.currentContent;

    const pool =
        session.currentGame.contentPool;

    if (!content) {
        return "";
    }


    switch (pool) {

        case "MISSION":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        TA MISSION
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.mission
                        )}
                    </div>

                </div>
            `;


        case "SECRET_RULE":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        TA RÈGLE
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.rule
                        )}
                    </div>

                </div>
            `;


        case "FORBIDDEN_WORD":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        TON MOT INTERDIT
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.word
                        )}
                    </div>

                    <div class="secret-subtext">
                        À éviter :
                        ${content.forbidden
                            .map(
                                word =>
                                    escapeHTML(word)
                            )
                            .join(", ")
                        }
                    </div>

                </div>
            `;


        case "TRAP_WORD":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        TON PIÈGE
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.word
                        )}
                    </div>

                    <div class="secret-subtext">
                        Mots associés interdits :
                        ${content.forbidden
                            .map(
                                word =>
                                    escapeHTML(word)
                            )
                            .join(", ")
                        }
                    </div>

                </div>
            `;


        case "TRAP_PROMPT":
        case "DESCRIPTION":
        case "IMPRO":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        TON DÉFI
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.prompt
                        )}
                    </div>

                </div>
            `;


        case "GUESS_WORD":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        MOT À FAIRE DEVINER
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.word
                        )}
                    </div>

                </div>
            `;


        case "MIME":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        À MIMER
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.action
                        )}
                    </div>

                </div>
            `;


        case "EXPRESSION":

            return `
                <div class="secret-card">

                    <div class="secret-label">
                        EXPRESSION
                    </div>

                    <div class="secret-text">
                        ${escapeHTML(
                            content.expression
                        )}
                    </div>

                </div>
            `;


        default:

            return `
                <div class="secret-card">

                    <div class="secret-text">
                        Information secrète.
                    </div>

                </div>
            `;

    }

}


/* ============================================================
   RÉVÉLATION PRIVÉE
   ============================================================ */

function renderPrivateReveal() {

    const target =
        session.currentActor ||
        session.currentTargets[0];

    app.innerHTML = `

        <section class="private-screen">

            <div class="private-top">

                <div class="private-icon">
                    🔒
                </div>

                <div class="private-label">
                    ÉCRAN PRIVÉ
                </div>

            </div>

            <h1>
                ${escapeHTML(target)}
            </h1>

            <p>
                Cette information est uniquement
                pour toi.
            </p>

            ${getPrivateContentHTML()}

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
   SORTIE ÉCRAN PRIVÉ
   ============================================================ */

function leavePrivateReveal() {

    /*
       IMPORTANT :
       on supprime immédiatement le contenu privé
       de l'état GAME_FLOW avant de revenir au public.
    */

    clearPrivateContent();

    session.currentPrivateContent =
        null;

    nextGamePhase();

    render();

}


/* ============================================================
   RETOUR DU TÉLÉPHONE
   ============================================================ */

function renderReturnPhone() {

    app.innerHTML = `

        <section class="private-transition">

            <div class="private-icon">
                ✓
            </div>

            <div class="game-kicker">
                SECRET TERMINÉ
            </div>

            <h1>
                REDONNE LE TÉLÉPHONE
            </h1>

            <p>
                L'information secrète
                ne doit plus être visible.
            </p>

            <button
                class="primary-btn"
                onclick="finishPrivateTransition()"
            >
                TÉLÉPHONE RENDU
            </button>

        </section>

    `;

}


function finishPrivateTransition() {

    clearPrivateContent();

    session.currentPrivateContent =
        null;

    nextGamePhase();

    render();

}


/* ============================================================
   JEU PUBLIC
   ============================================================ */

function renderPlay() {

    const game =
        session.currentGame;

    const targetHTML =
        session.currentTargets.length
            ? `
                <div class="game-target">
                    ${session.currentTargets
                        .map(
                            player =>
                                escapeHTML(player)
                        )
                        .join(" • ")
                    }
                </div>
            `
            : "";

    app.innerHTML = `

        <section class="game-screen">

            <div class="game-header">

                <span>
                    ${escapeHTML(
                        game.family
                    )}
                </span>

                <span>
                    TOUR ${session.round}
                </span>

            </div>

            <div class="game-card">

                <div class="game-kicker">
                    ${escapeHTML(
                        game.name
                    )}
                </div>

                ${targetHTML}

                <div class="game-content">
                    ${getContentText()}
                </div>

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

        <section class="game-screen">

            <div class="game-card">

                <div class="game-kicker">
                    VOTE
                </div>

                <h1>
                    Qui choisissez-vous ?
                </h1>

                <p>
                    Votez à voix haute.
                    Le narrateur valide le résultat.
                </p>

            </div>

            <div class="vote-list">

                ${players
                    .map(
                        player => `
                            <button
                                class="choice-btn"
                                onclick="selectVote('${escapeHTML(player)}')"
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


function selectVote(player) {

    session.voteChoices.push(player);

    session.selectedChoice =
        player;

    nextGamePhase();

    render();

}


/* ============================================================
   CHOIX
   ============================================================ */

function renderChoice() {

    const game =
        session.currentGame;

    app.innerHTML = `

        <section class="game-screen">

            <div class="game-card">

                <div class="game-kicker">
                    CHOIX
                </div>

                <div class="game-content">
                    ${getContentText()}
                </div>

            </div>

            <div class="choice-grid">

                <button
                    class="choice-btn"
                    onclick="chooseOption('A')"
                >
                    A
                </button>

                <button
                    class="choice-btn"
                    onclick="chooseOption('B')"
                >
                    B
                </button>

            </div>

        </section>

    `;

}


function chooseOption(choice) {

    session.selectedChoice =
        choice;

    nextGamePhase();

    render();

}


/* ============================================================
   RESULTAT
   ============================================================ */

function renderResult() {

    const game =
        session.currentGame;

    let resultText =
        "Le défi est terminé.";

    if (session.selectedChoice) {

        resultText =
            `Choix : ${escapeHTML(
                session.selectedChoice
            )}`;

    }

    if (session.currentPair.length) {

        resultText =
            `${escapeHTML(
                session.currentPair[0]
            )}
            contre
            ${escapeHTML(
                session.currentPair[1]
            )}`;

    }

    app.innerHTML = `

        <section class="result-screen">

            <div class="game-kicker">
                RÉSULTAT
            </div>

            <h1>
                ${escapeHTML(
                    game.name
                )}
            </h1>

            <div class="result-card">

                ${resultText}

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

function getPenaltyText() {

    const family =
        session.currentGame?.family;

    switch (family) {

        case "VOTE":

            return "La personne désignée prend 1 petite gorgée ou choisit une alternative sans alcool.";

        case "RAPIDITE":

            return "Le dernier à répondre prend 1 petite gorgée ou choisit une alternative sans alcool.";

        case "BLUFF":

            return "Le bluffeur découvert prend 1 petite gorgée ou choisit une alternative sans alcool.";

        case "DEVINETTE":

            return "Si personne ne trouve, 1 petite gorgée ou alternative sans alcool.";

        case "PERSONNEL":

            return "Répondre ou prendre 1 petite gorgée / alternative sans alcool.";

        case "CHAOS":

            return "Appliquez la pénalité du défi, sans dépasser une pénalité légère.";

        default:

            return "1 petite gorgée ou alternative sans alcool.";

    }

}


function renderPenalty() {

    app.innerHTML = `

        <section class="result-screen">

            <div class="game-kicker">
                PÉNALITÉ
            </div>

            <h1>
                À vous de décider
            </h1>

            <div class="result-card">

                ${escapeHTML(
                    getPenaltyText()
                )}

            </div>

            <button
                class="primary-btn"
                onclick="advancePhase()"
            >
                OK
            </button>

        </section>

    `;

}


/* ============================================================
   NEXT
   ============================================================ */

function renderNext() {

    app.innerHTML = `

        <section class="result-screen">

            <div class="game-kicker">
                TOUR TERMINÉ
            </div>

            <h1>
                Prêts pour la suite ?
            </h1>

            <button
                class="primary-btn"
                onclick="startRound()"
            >
                JEU SUIVANT
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
   GAME ROUTER
   ============================================================ */

function renderGame() {

    const phase =
        GAME_FLOW.currentPhase ||
        session.currentPhase ||
        "INTRO";

    switch (phase) {

        case "INTRO":
            renderIntro();
            break;

        case "SELECT_ROLES":
            renderSelectPlayers();
            break;

        case "SELECT_TARGET":
            renderSelectTarget();
            break;

        case "SELECT_PLAYERS":
            renderSelectPlayers();
            break;

        case "PASS_PHONE":
            renderPassPhone();
            break;

        case "PRIVATE_REVEAL":
            renderPrivateReveal();
            break;

        case "RETURN_PHONE":
            renderReturnPhone();
            break;

        case "PLAY":
            renderPlay();
            break;

        case "VOTE":
            renderVote();
            break;

        case "CHOICE":
            renderChoice();
            break;

        case "RESULT":
            renderResult();
            break;

        case "PENALTY":
            renderPenalty();
            break;

        case "NEXT":
            renderNext();
            break;

        default:
            renderPlay();

    }

}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

    app.innerHTML = `

        <section class="home">

            <div class="logo">
                SOIRÉE
            </div>

            <div class="subtitle">
                PARTY GAME
            </div>

            <button
                class="primary-btn"
                onclick="navigate('PLAYERS')"
            >
                JOUER
            </button>

            <button
                class="secondary-btn"
                onclick="navigate('PLAYERS')"
            >
                OPTIONS
            </button>

        </section>

    `;

}


/* ============================================================
   JOUEURS
   ============================================================ */

function renderPlayers() {

    app.innerHTML = `

        <section class="players-screen">

            <div class="screen-header">

                <button
                    class="back-btn"
                    onclick="navigate('HOME')"
                >
                    ←
                </button>

                <div>
                    JOUEURS
                </div>

            </div>

            <div class="players-count">
                ${session.players.length}
                / ${CONFIG.PLAYERS.MAX}
            </div>

            <div class="player-list">

                ${
                    session.players.length
                        ? session.players
                            .map(
                                (player, index) => `
                                    <div class="player-row">

                                        <span>
                                            ${escapeHTML(
                                                player
                                            )}
                                        </span>

                                        <button
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
                                Ajoutez les joueurs.
                            </div>
                        `
                }

            </div>

            <button
                class="secondary-btn"
                onclick="addPlayer()"
                ${
                    session.players.length >=
                    CONFIG.PLAYERS.MAX
                        ? "disabled"
                        : ""
                }
            >
                + AJOUTER UN JOUEUR
            </button>

            <button
                class="primary-btn"
                onclick="goToIntensity()"
                ${
                    session.players.length <
                    CONFIG.PLAYERS.MIN
                        ? "disabled"
                        : ""
                }
            >
                CONTINUER
            </button>

        </section>

    `;

}


function addPlayer() {

    if (
        session.players.length >=
        CONFIG.PLAYERS.MAX
    ) {
        return;
    }

    const name =
        prompt("Prénom du joueur :");

    if (!name) {
        return;
    }

    const clean =
        name.trim();

    if (!clean) {
        return;
    }

    if (
        session.players.some(
            player =>
                player.toLowerCase() ===
                clean.toLowerCase()
        )
    ) {

        alert(
            "Ce joueur est déjà présent."
        );

        return;

    }

    session.players.push(
        clean
    );

    saveSession();

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

function goToIntensity() {

    navigate("INTENSITY");

}


function renderIntensity() {

    const options = [

        {
            id: "COOL",
            title: "COOL",
            text: "Tranquille"
        },

        {
            id: "CLASSIQUE",
            title: "CLASSIQUE",
            text: "Équilibré"
        },

        {
            id: "CHAUD",
            title: "CHAUD",
            text: "Plus intense"
        },

        {
            id: "CHAOS",
            title: "CHAOS",
            text: "Sans filtre"
        }

    ];

    app.innerHTML = `

        <section class="intensity-screen">

            <div class="screen-header">

                <button
                    class="back-btn"
                    onclick="navigate('PLAYERS')"
                >
                    ←
                </button>

                <div>
                    INTENSITÉ
                </div>

            </div>

            <div class="intensity-list">

                ${options
                    .map(
                        option => `
                            <button
                                class="
                                    intensity-card
                                    ${
                                        session.intensity ===
                                        option.id
                                            ? "selected"
                                            : ""
                                    }
                                "
                                onclick="selectIntensity('${option.id}')"
                            >

                                <strong>
                                    ${option.title}
                                </strong>

                                <span>
                                    ${option.text}
                                </span>

                            </button>
                        `
                    )
                    .join("")
                }

            </div>

            <button
                class="primary-btn"
                onclick="beginParty()"
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


function beginParty() {

    if (
        session.players.length <
        CONFIG.PLAYERS.MIN
    ) {

        navigate("PLAYERS");

        return;

    }

    startRound();

}


/* ============================================================
   RENDER PRINCIPAL
   ============================================================ */

function render() {

    switch (session.screen) {

        case "HOME":

            renderHome();

            break;


        case "PLAYERS":

            renderPlayers();

            break;


        case "INTENSITY":

            renderIntensity();

            break;


        case "GAME":

            renderGame();

            break;


        default:

            session.screen =
                "HOME";

            renderHome();

    }

}


/* ============================================================
   INITIALISATION
   ============================================================ */

loadSession();

render();
