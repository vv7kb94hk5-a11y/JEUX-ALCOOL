/* ============================================================
   SOIRÉE — GAME FLOW
   BUILD 07.0
   Source unique du déroulement d'un jeu.
   ============================================================ */

const GAME_FLOW = {

    currentGame: null,

    currentPhaseIndex: 0,

    currentPhase: null,

    currentActor: null,

    currentTarget: null,

    currentPlayers: [],

    currentPrivateContent: null,

    currentPublicContent: null,

    startedAt: null,

    finishedAt: null

};


/* ============================================================
   TYPES DE PHASES
   ============================================================ */

const GAME_PHASES = {

    INTRO: {
        type: "PUBLIC"
    },

    SELECT_TARGET: {
        type: "PUBLIC"
    },

    SELECT_PLAYERS: {
        type: "PUBLIC"
    },

    PASS_PHONE: {
        type: "PRIVATE_TRANSITION"
    },

    PRIVATE_REVEAL: {
        type: "PRIVATE"
    },

    RETURN_PHONE: {
        type: "PRIVATE_TRANSITION"
    },

    PLAY: {
        type: "PUBLIC"
    },

    VOTE: {
        type: "PUBLIC"
    },

    RESULT: {
        type: "PUBLIC"
    },

    PENALTY: {
        type: "PUBLIC"
    },

    NEXT: {
        type: "PUBLIC"
    }

};


/* ============================================================
   DÉMARRER UN FLOW
   ============================================================ */

function startGameFlow(game, players) {

    if (
        !game ||
        !Array.isArray(players) ||
        players.length < game.minPlayers
    ) {

        return false;

    }


    GAME_FLOW.currentGame = game;

    GAME_FLOW.currentPhaseIndex = 0;

    GAME_FLOW.currentPhase =
        game.phases[0] || "INTRO";

    GAME_FLOW.currentPlayers =
        [...players];

    GAME_FLOW.currentActor = null;

    GAME_FLOW.currentTarget = null;

    GAME_FLOW.currentPrivateContent = null;

    GAME_FLOW.currentPublicContent = null;

    GAME_FLOW.startedAt = Date.now();

    GAME_FLOW.finishedAt = null;


    return true;

}


/* ============================================================
   PHASE SUIVANTE
   ============================================================ */

function nextGamePhase() {

    const phases =
        GAME_FLOW.currentGame?.phases;


    if (!phases) {

        return null;

    }


    /* --------------------------------------------------------
       FIN DU FLOW
       -------------------------------------------------------- */

    if (
        GAME_FLOW.currentPhaseIndex >=
        phases.length - 1
    ) {

        GAME_FLOW.finishedAt =
            Date.now();

        /*
         * Sécurité :
         * aucune information privée ne doit
         * rester en mémoire après la fin.
         */

        GAME_FLOW.currentPrivateContent =
            null;


        return null;

    }


    /* --------------------------------------------------------
       PHASE SUIVANTE
       -------------------------------------------------------- */

    GAME_FLOW.currentPhaseIndex++;

    GAME_FLOW.currentPhase =
        phases[
            GAME_FLOW.currentPhaseIndex
        ];


    return GAME_FLOW.currentPhase;

}


/* ============================================================
   ALLER DIRECTEMENT À UNE PHASE
   ============================================================ */

function goToGamePhase(id) {

    const phases =
        GAME_FLOW.currentGame?.phases || [];


    const index =
        phases.indexOf(id);


    if (index < 0) {

        return false;

    }


    GAME_FLOW.currentPhaseIndex =
        index;

    GAME_FLOW.currentPhase =
        id;


    return true;

}


/* ============================================================
   ACTEUR
   ============================================================ */

function setCurrentActor(player) {

    GAME_FLOW.currentActor =
        player || null;

}


/* ============================================================
   CIBLE
   ============================================================ */

function setCurrentTarget(player) {

    GAME_FLOW.currentTarget =
        player || null;

}


/* ============================================================
   JOUEURS ACTIFS
   ============================================================ */

function setCurrentPlayers(players) {

    GAME_FLOW.currentPlayers =
        Array.isArray(players)
            ? [...players]
            : [];

}


/* ============================================================
   CONTENU PUBLIC
   ============================================================ */

function setPublicContent(content) {

    GAME_FLOW.currentPublicContent =
        content || null;

}


/* ============================================================
   CONTENU PRIVÉ
   ============================================================ */

function setPrivateContent(content) {

    GAME_FLOW.currentPrivateContent =
        content || null;

}


/* ============================================================
   EFFACER LE CONTENU PRIVÉ
   ============================================================ */

function clearPrivateContent() {

    GAME_FLOW.currentPrivateContent =
        null;

}


/* ============================================================
   VÉRIFIER SI LA PHASE EST PRIVÉE
   ============================================================ */

function isPrivatePhase() {

    return (
        GAME_PHASES[
            GAME_FLOW.currentPhase
        ]?.type === "PRIVATE"
    );

}


/* ============================================================
   RESET COMPLET
   ============================================================ */

function resetGameFlow() {

    GAME_FLOW.currentGame = null;

    GAME_FLOW.currentPhaseIndex = 0;

    GAME_FLOW.currentPhase = null;

    GAME_FLOW.currentActor = null;

    GAME_FLOW.currentTarget = null;

    GAME_FLOW.currentPlayers = [];

    GAME_FLOW.currentPrivateContent = null;

    GAME_FLOW.currentPublicContent = null;

    GAME_FLOW.startedAt = null;

    GAME_FLOW.finishedAt = null;

}
