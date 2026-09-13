/* ============================================================
   SOIRÉE — PARTY ENGINE
   BUILD 03.0
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

    round: 0
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
    return [...array].sort(() => Math.random() - 0.5);
}


function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ============================================================
   PLAYER ENGINE
   ============================================================ */

function getAvailablePlayers() {

    if (!session.players.length) {
        return [];
    }

    const recentLimit =
        CONFIG.ROTATION.RECENT_PLAYER_LIMIT;

    const recent =
        session.playerHistory.slice(-recentLimit);

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

    const available = getAvailablePlayers();

    const player = randomItem(available);

    if (player) {
        session.playerHistory.push(player);
    }

    return player;
}


function chooseTwoPlayers() {

    const available = getAvailablePlayers();

    if (available.length < 2) {
        return shuffle(session.players).slice(0, 2);
    }

    const selected = available.slice(0, 2);

    selected.forEach(player => {
        session.playerHistory.push(player);
    });

    return selected;
}


function choosePair() {

    const available = shuffle(session.players);

    if (available.length < 2) {
        return available;
    }

    return available.slice(0, 2);
}


function getAllPlayers() {
    return [...session.players];
}


/* ============================================================
   GAME ENGINE — FILTRAGE
   ============================================================ */

function isGameOnCooldown(game) {

    const cooldown =
        game.cooldown ||
        CONFIG.COOLDOWN.GAME;

    const recentGames =
        session.history.slice(-cooldown);

    return recentGames.includes(game.id);
}


function isFamilyOverused(game) {

    const maxSame =
        CONFIG.DIVERSITY.MAX_SAME_FAMILY;

    const recent =
        session.history.slice(-maxSame);

    const recentGames =
        recent
            .map(id =>
                GAMES.find(game => game.id === id)
            )
            .filter(Boolean);

    if (recentGames.length < maxSame) {
        return false;
    }

    return recentGames.every(
        item => item.family === game.family
    );
}


function isCompatible(game) {

    if (session.players.length < game.minPlayers) {
        return false;
    }

    if (session.players.length > game.maxPlayers) {
        return false;
    }

    if (game.requiresWriting) {
        return false;
    }

    return true;
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


    /* Si le filtre est trop strict,
       on enlève uniquement le cooldown. */

    if (!candidates.length) {

        candidates =
            GAMES.filter(game =>
                isCompatible(game)
            );
    }


    return candidates;
}


/* ============================================================
   GAME ENGINE — SCORE
   ============================================================ */

function scoreGame(game) {

    let score = 100;

    const intensityConfig =
        getIntensityConfig(session.intensity);


    /* INTENSITÉ */

    const distance =
        Math.abs(
            game.intensity -
            intensityConfig.preferredIntensity
        );

    score -= distance * 18;


    /* FAMILLE */

    if (isFamilyOverused(game)) {
        score -= 60;
    }


    /* INTERACTION */

    const lastGame =
        session.currentGame;

    if (
        lastGame &&
        lastGame.interaction === game.interaction
    ) {
        score -= 15;
    }


    /* MÊME CIBLE */

    if (
        lastGame &&
        lastGame.targetType === game.targetType
    ) {
        score -= 8;
    }


    /* CHAOS */

    if (game.family === "CHAOS") {

        score +=
            20 *
            intensityConfig.chaosMultiplier;
    }


    /* HOT */

    if (game.family === "PERSONNEL") {

        score +=
            10 *
            intensityConfig.hotMultiplier;
    }


    /* ALÉATOIRE */

    if (CONFIG.ENGINE.WEIGHT_RANDOMNESS) {

        score +=
            Math.random() *
            100 *
            CONFIG.PROBABILITY.RANDOMNESS;
    }


    return Math.max(score, 1);
}


/* ============================================================
   GAME ENGINE — SÉLECTION
   ============================================================ */

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
            (sum, item) => sum + item.score,
            0
        );


    let random =
        Math.random() * total;


    for (const item of scored) {

        random -= item.score;

        if (random <= 0) {
            return item.game;
        }
    }


    return scored[0].game;
}


/* ============================================================
   CONTENT ENGINE
   ============================================================ */

function getContentForGame(game) {

    if (!game) {
        return null;
    }


    const type =
        game.contentType;


    switch (type) {

        case "QUESTION":
            return randomItem(
                QUESTIONS.VOTE
            );


        case "CATEGORY":
            return randomItem(
                QUESTIONS.CATEGORY
            );


        case "WORD":
            return randomItem(
                QUESTIONS.WORD
            );


        case "STATEMENTS":
            return randomItem(
                QUESTIONS.STATEMENTS
            );


        case "BLUFF":
            return randomItem(
                QUESTIONS.BLUFF
            );


        case "HOT":

            return getHotQuestion();


        case "WOULD_YOU_RATHER":
            return randomItem(
                QUESTIONS.CHOICE
            );


        case "CHOICE":
            return randomItem(
                QUESTIONS.CHOICE
            );


        case "GROUP_TRUTH":
            return randomItem(
                QUESTIONS.GROUP_TRUTH
            );


        case "EXPRESSION":
            return randomItem(
                QUESTIONS.EXPRESSION
            );


        case "MIME":
            return randomItem(
                QUESTIONS.MIME
            );


        case "IMPRO":
            return randomItem(
                QUESTIONS.IMPRO
            );


        case "DUO":
            return randomItem(
                QUESTIONS.DUO
            );


        case "MISSION":
            return randomItem(
                QUESTIONS.MISSION
            );


        case "SECRET_RULE":
            return randomItem(
                QUESTIONS.SECRET_RULE
            );


        case "DUEL":
            return randomItem(
                QUESTIONS.WORD
            );


        case "GROUP":
            return randomItem(
                QUESTIONS.CATEGORY
            );


        case "CHAOS":
            return getChaosContent();


        default:
            return null;
    }
}


/* ============================================================
   HOT FILTER
   ============================================================ */

function getHotQuestion() {

    const pool =
        QUESTIONS.HOT || [];

    const maximum =
        session.intensity === "COOL"
            ? 2
            : 3;

    const filtered =
        pool.filter(
            question =>
                question.intensity <= maximum
        );

    return randomItem(
        filtered.length
            ? filtered
            : pool
    );
}


/* ============================================================
   CHAOS CONTENT
   ============================================================ */

function getChaosContent() {

    const options = [
        ...QUESTIONS.CATEGORY,
        ...QUESTIONS.WORD,
        ...QUESTIONS.CHOICE,
        ...QUESTIONS.MIME
    ];

    return randomItem(options);
}


/* ============================================================
   TARGET ENGINE
   ============================================================ */

function chooseTargets(game) {

    switch (game.targetType) {

        case "ONE":
            return [choosePlayer()];

        case "TWO":
            return chooseTwoPlayers();

        case "PAIR":
            return choosePair();

        case "ALL":
            return getAllPlayers();

        case "RANDOM":
            return [choosePlayer()];

        case "NONE":
        default:
            return [];
    }
}


/* ============================================================
   PREPARE ROUND
   ============================================================ */

function prepareRound() {

    const game =
        chooseGame();

    if (!game) {
        return null;
    }


    const content =
        getContentForGame(game);


    const targets =
        chooseTargets(game);


    session.currentGame =
        game;

    session.currentContent =
        content;

    session.currentTargets =
        targets;

    session.round++;


    session.history.push(game.id);


    if (
        session.history.length >
        CONFIG.SESSION.MAX_HISTORY
    ) {
        session.history.shift();
    }


    return {
        game,
        content,
        targets
    };
}


/* ============================================================
   GAME TEXT
   ============================================================ */

function getContentText(game, content) {

    if (!content) {
        return "Préparez-vous...";
    }


    switch (game.contentType) {

        case "CATEGORY":
            return `
                <strong>Catégorie :</strong>
                ${escapeHTML(content.category)}
                <br><br>
                Chacun doit répondre rapidement.
            `;


        case "WORD":
            return `
                Le mot est :
                <strong>${escapeHTML(content.word)}</strong>
            `;


        case "HOT":
        case "QUESTION":
        case "CHOICE":
        case "WOULD_YOU_RATHER":
        case "GROUP_TRUTH":
            return escapeHTML(
                content.text
            );


        case "STATEMENTS":
            return escapeHTML(
                content.instruction
            );


        case "BLUFF":
            return escapeHTML(
                content.prompt
            );


        case "EXPRESSION":
            return `
                Fais deviner :
                <strong>
                    ${escapeHTML(content.expression)}
                </strong>
            `;


        case "MIME":
            return escapeHTML(
                content.action
            );


        case "IMPRO":
            return escapeHTML(
                content.prompt
            );


        case "DUO":
            return escapeHTML(
                content.prompt
            );


        case "MISSION":
            return `
                <strong>MISSION SECRÈTE</strong>
                <br><br>
                ${escapeHTML(content.mission)}
            `;


        case "SECRET_RULE":
            return `
                <strong>RÈGLE SECRÈTE</strong>
                <br><br>
                ${escapeHTML(content.rule)}
            `;


        case "DUEL":
            return `
                <strong>DUEL</strong>
                <br><br>
                Le premier à répondre correctement gagne.
            `;


        case "CHAOS":
        case "GROUP":
            return formatGenericContent(content);


        default:
            return "À vous de jouer.";
    }
}


function formatGenericContent(content) {

    if (content.text) {
        return escapeHTML(content.text);
    }

    if (content.word) {
        return `
            Mot :
            <strong>${escapeHTML(content.word)}</strong>
        `;
    }

    if (content.category) {
        return `
            Catégorie :
            <strong>${escapeHTML(content.category)}</strong>
        `;
    }

    if (content.action) {
        return escapeHTML(content.action);
    }

    return "À vous de jouer.";
}


/* ============================================================
   TARGET DISPLAY
   ============================================================ */

function getTargetHTML(targets) {

    if (!targets.length) {
        return "";
    }


    if (targets.length === 1) {

        return `
            <div class="game-target">
                ${escapeHTML(targets[0])}
            </div>
        `;
    }


    return `
        <div class="game-target-list">
            ${targets
                .map(
                    player => `
                        <span class="game-target">
                            ${escapeHTML(player)}
                        </span>
                    `
                )
                .join("")
            }
        </div>
    `;
}


/* ============================================================
   PENALTY
   ============================================================ */

function getPenaltyText(game) {

    if (!game) {
        return "";
    }


    switch (game.family) {

        case "VOTE":
            return "La personne désignée prend 1 petite gorgée ou choisit une alternative sans alcool.";

        case "RAPIDITÉ":
            return "Le dernier à répondre prend 1 petite gorgée ou choisit une alternative sans alcool.";

        case "BLUFF":
            return "Si le bluff est découvert : 1 petite gorgée ou alternative sans alcool.";

        case "DEVINETTE":
            return "Si personne ne trouve : 1 petite gorgée ou alternative sans alcool.";

        case "PERSONNEL":
            return "La personne peut répondre ou prendre 1 petite gorgée / alternative sans alcool.";

        case "CHAOS":
            return "Le groupe applique la règle du défi, avec une pénalité maximale légère.";

        default:
            return "1 petite gorgée ou alternative sans alcool.";
    }
}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

    app.innerHTML = `
        <div class="app-shell">

            <section class="screen home-screen">

                <div>
                    <div class="logo">
                        SOIRÉE
                    </div>

                    <div class="subtitle">
                        PARTY GAME
                    </div>
                </div>

                <div class="home-actions">

                    <button
                        class="button button-primary"
                        id="playButton"
                    >
                        JOUER
                    </button>

                    <button
                        class="button button-secondary"
                        id="optionsButton"
                    >
                        ⚙ OPTIONS
                    </button>

                </div>

            </section>

        </div>
    `;


    document
        .getElementById("playButton")
        .addEventListener(
            "click",
            () => navigate("PLAYERS")
        );


    document
        .getElementById("optionsButton")
        .addEventListener(
            "click",
            () => {
                alert(
                    "Les options seront ajoutées dans un prochain BUILD."
                );
            }
        );
}


/* ============================================================
   PLAYERS
   ============================================================ */

function renderPlayers() {

    const playersHTML =
        session.players.length

            ? session.players
                .map(
                    (player, index) => `
                        <div class="player">

                            <span class="player-name">
                                ${escapeHTML(player)}
                            </span>

                            <button
                                class="player-remove"
                                data-index="${index}"
                                aria-label="Supprimer ${escapeHTML(player)}"
                            >
                                ×
                            </button>

                        </div>
                    `
                )
                .join("")

            : `
                <div class="card">
                    <p style="color: var(--text-soft);">
                        Ajoutez au moins 3 joueurs pour commencer.
                    </p>
                </div>
            `;


    app.innerHTML = `
        <div class="app-shell">

            <section class="screen">

                <header class="screen-header">

                    <h1 class="screen-title">
                        QUI JOUE ?
                    </h1>

                    <span class="screen-counter">
                        ${session.players.length}/12
                    </span>

                </header>

                <div class="player-list">
                    ${playersHTML}
                </div>

                <button
                    class="button button-secondary"
                    id="addPlayerButton"
                >
                    + AJOUTER UN JOUEUR
                </button>

                <div style="flex: 1;"></div>

                <button
                    class="button button-primary"
                    id="continueButton"
                    ${session.players.length < 3
                        ? "disabled"
                        : ""}
                >
                    CONTINUER
                </button>

            </section>

        </div>
    `;


    document
        .getElementById("addPlayerButton")
        .addEventListener(
            "click",
            addPlayer
        );


    document
        .getElementById("continueButton")
        .addEventListener(
            "click",
            () => navigate("INTENSITY")
        );


    document
        .querySelectorAll(".player-remove")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    session.players.splice(
                        index,
                        1
                    );

                    renderPlayers();
                }
            );

        });
}


/* ============================================================
   ADD PLAYER
   ============================================================ */

function addPlayer() {

    if (
        session.players.length >=
        CONFIG.PLAYERS.MAX
    ) {

        alert(
            `Maximum : ${CONFIG.PLAYERS.MAX} joueurs.`
        );

        return;
    }


    const name =
        prompt("Nom du joueur :");


    if (!name) {
        return;
    }


    const cleanName =
        name.trim();


    if (!cleanName) {
        return;
    }


    if (
        session.players.some(
            player =>
                player.toLowerCase() ===
                cleanName.toLowerCase()
        )
    ) {

        alert(
            "Ce joueur existe déjà."
        );

        return;
    }


    session.players.push(
        cleanName
    );


    renderPlayers();
}


/* ============================================================
   INTENSITY
   ============================================================ */

function renderIntensity() {

    app.innerHTML = `
        <div class="app-shell">

            <section class="screen">

                <header class="screen-header">

                    <h1 class="screen-title">
                        TYPE DE SOIRÉE
                    </h1>

                </header>


                <div class="intensity-list">

                    <button
                        class="intensity-option"
                        data-intensity="COOL"
                    >
                        <div class="intensity-name">
                            🟢 COOL
                        </div>

                        <div class="intensity-description">
                            Léger, drôle et accessible.
                        </div>
                    </button>


                    <button
                        class="intensity-option"
                        data-intensity="CLASSIQUE"
                    >
                        <div class="intensity-name">
                            🟡 CLASSIQUE
                        </div>

                        <div class="intensity-description">
                            Le mode équilibré.
                        </div>
                    </button>


                    <button
                        class="intensity-option"
                        data-intensity="CHAUD"
                    >
                        <div class="intensity-name">
                            🟠 CHAUD
                        </div>

                        <div class="intensity-description">
                            Plus personnel et provocateur.
                        </div>
                    </button>


                    <button
                        class="intensity-option"
                        data-intensity="CHAOS"
                    >
                        <div class="intensity-name">
                            🔴 CHAOS
                        </div>

                        <div class="intensity-description">
                            Plus de surprises et de changements.
                        </div>
                    </button>

                </div>


                <div style="flex: 1;"></div>


                <button
                    class="button button-primary"
                    id="startButton"
                >
                    COMMENCER
                </button>

            </section>

        </div>
    `;


    document
        .querySelectorAll(".intensity-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    session.intensity =
                        button.dataset.intensity;


                    document
                        .querySelectorAll(
                            ".intensity-option"
                        )
                        .forEach(
                            option => {
                                option.style.borderColor =
                                    "var(--border)";
                            }
                        );


                    button.style.borderColor =
                        "var(--accent)";
                }
            );

        });


    document
        .getElementById("startButton")
        .addEventListener(
            "click",
            startGame
        );
}


/* ============================================================
   START GAME
   ============================================================ */

function startGame() {

    session.history = [];
    session.playerHistory = [];
    session.currentGame = null;
    session.currentContent = null;
    session.currentTargets = [];
    session.round = 0;

    prepareRound();

    navigate("GAME");
}


/* ============================================================
   GAME SCREEN
   ============================================================ */

function renderGame() {

    const game =
        session.currentGame;


    const content =
        session.currentContent;


    if (!game) {

        app.innerHTML = `
            <div class="app-shell">
                <section class="screen result-screen">

                    <div class="result-label">
                        ERREUR
                    </div>

                    <div class="result-player">
                        Aucun jeu
                    </div>

                    <button
                        class="button button-primary"
                        id="backButton"
                    >
                        RETOUR
                    </button>

                </section>
            </div>
        `;


        document
            .getElementById("backButton")
            .addEventListener(
                "click",
                () => navigate("HOME")
            );

        return;
    }


    const targetHTML =
        getTargetHTML(
            session.currentTargets
        );


    const contentHTML =
        getContentText(
            game,
            content
        );


    app.innerHTML = `
        <div class="app-shell">

            <section class="screen game-screen">

                <div class="game-content">

                    <div class="game-family">
                        ${escapeHTML(game.family)}
                    </div>


                    <h1 class="game-title">
                        ${escapeHTML(game.name)}
                    </h1>


                    ${targetHTML}


                    <div class="game-card">

                        <p class="game-question">
                            ${contentHTML}
                        </p>

                    </div>


                    <div
                        class="game-penalty"
                        style="
                            margin-top: 16px;
                            color: var(--text-soft);
                            font-size: 14px;
                            line-height: 1.4;
                        "
                    >
                        ${escapeHTML(
                            getPenaltyText(game)
                        )}
                    </div>

                </div>


                <div class="game-footer">

                    <button
                        class="button button-primary"
                        id="nextButton"
                    >
                        SUIVANT →
                    </button>


                    <button
                        class="button button-secondary"
                        id="quitButton"
                    >
                        QUITTER
                    </button>

                </div>

            </section>

        </div>
    `;


    document
        .getElementById("nextButton")
        .addEventListener(
            "click",
            nextRound
        );


    document
        .getElementById("quitButton")
        .addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Quitter la partie ?"
                    )
                ) {
                    navigate("HOME");
                }

            }
        );
}


/* ============================================================
   NEXT ROUND
   ============================================================ */

function nextRound() {

    prepareRound();

    renderGame();
}


/* ============================================================
   RENDER
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
            renderHome();
    }
}


/* ============================================================
   START APPLICATION
   ============================================================ */

render();
