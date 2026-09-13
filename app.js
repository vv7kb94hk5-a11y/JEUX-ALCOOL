/* ============================================================
   SOIRÉE — APP CORE
   BUILD 01.3
   ============================================================ */

const app = document.getElementById("app");

/* ============================================================
   SESSION
   ============================================================ */

const session = {
    players: [],
    intensity: "CLASSIQUE",
    screen: "HOME"
};

/* ============================================================
   NAVIGATION
   ============================================================ */

function navigate(screen) {
    session.screen = screen;
    render();
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
        .addEventListener("click", () => {
            navigate("PLAYERS");
        });

    document
        .getElementById("optionsButton")
        .addEventListener("click", () => {
            alert("Les options arriveront bientôt.");
        });
}

/* ============================================================
   PLAYERS
   ============================================================ */

function renderPlayers() {

    const playersHTML = session.players.length
        ? session.players.map((player, index) => `
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
        `).join("")
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
                    ${session.players.length < 3 ? "disabled" : ""}
                >
                    CONTINUER
                </button>

            </section>

        </div>
    `;

    document
        .getElementById("addPlayerButton")
        .addEventListener("click", addPlayer);

    document
        .getElementById("continueButton")
        .addEventListener("click", () => {
            navigate("INTENSITY");
        });

    document
        .querySelectorAll(".player-remove")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(
                    button.dataset.index
                );

                session.players.splice(index, 1);

                renderPlayers();
            });
        });
}

/* ============================================================
   ADD PLAYER
   ============================================================ */

function addPlayer() {

    if (session.players.length >= 12) {
        alert("Maximum : 12 joueurs.");
        return;
    }

    const name = prompt("Nom du joueur :");

    if (!name) {
        return;
    }

    const cleanName = name.trim();

    if (!cleanName) {
        return;
    }

    session.players.push(cleanName);

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
                            Plus personnel et plus provocateur.
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
                            Plus d'événements et de surprises.
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

            button.addEventListener("click", () => {

                session.intensity =
                    button.dataset.intensity;

                document
                    .querySelectorAll(".intensity-option")
                    .forEach(option => {
                        option.style.borderColor =
                            "var(--border)";
                    });

                button.style.borderColor =
                    "var(--accent)";
            });
        });

    document
        .getElementById("startButton")
        .addEventListener("click", () => {

            navigate("GAME");

        });
}

/* ============================================================
   GAME PLACEHOLDER
   ============================================================ */

function renderGame() {

    app.innerHTML = `
        <div class="app-shell">

            <section class="screen game-screen">

                <div class="game-content">

                    <div class="game-family">
                        PARTY ENGINE
                    </div>

                    <h1 class="game-title">
                        PRÉPAREZ-VOUS
                    </h1>

                    <div class="game-card">

                        <p class="game-question">
                            Le moteur de jeu arrive
                            à l'étape suivante.
                        </p>

                    </div>

                </div>

                <div class="game-footer">

                    <button
                        class="button button-primary"
                        id="nextButton"
                    >
                        SUIVANT →
                    </button>

                </div>

            </section>

        </div>
    `;

    document
        .getElementById("nextButton")
        .addEventListener("click", () => {

            alert(
                "Le Party Engine sera connecté dans le prochain BUILD."
            );

        });
}

/* ============================================================
   SECURITY
   ============================================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ============================================================
   START APPLICATION
   ============================================================ */

render();
