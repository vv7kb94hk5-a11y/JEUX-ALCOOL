/* ============================================================
   SOIRÉE — PARTY ENGINE CONFIG
   BUILD 02.0
   ============================================================ */

const CONFIG = {

    /* ========================================================
       JOUEURS
       ======================================================== */

    PLAYERS: {
        MIN: 3,
        MAX: 12
    },


    /* ========================================================
       COOLDOWNS
       Nombre de tours avant qu'un élément puisse revenir
       ======================================================== */

    COOLDOWN: {
        GAME: 6,
        QUESTION: 10,
        EVENT: 8,
        PLAYER: 3
    },


    /* ========================================================
       DIVERSITÉ
       ======================================================== */

    DIVERSITY: {
        MAX_SAME_FAMILY: 2,
        MAX_SAME_INTERACTION: 2,
        MAX_SAME_TARGET: 2,
        MAX_SAME_DURATION: 3
    },


    /* ========================================================
       PROBABILITÉS
       ======================================================== */

    PROBABILITY: {
        CHAOS: 0.12,
        EVENT: 0.18,
        RANDOMNESS: 0.25
    },


    /* ========================================================
       ROTATION DES JOUEURS
       ======================================================== */

    ROTATION: {
        AVOID_RECENT_PLAYER: true,
        RECENT_PLAYER_LIMIT: 3,
        PRIORITIZE_UNUSED_PLAYERS: true
    },


    /* ========================================================
       INTENSITÉ
       Ces valeurs modifient les préférences du moteur.
       Elles ne bloquent pas les jeux.
       ======================================================== */

    INTENSITY: {

        COOL: {
            preferredIntensity: 1,
            chaosMultiplier: 0.5,
            hotMultiplier: 0.4
        },

        CLASSIQUE: {
            preferredIntensity: 2,
            chaosMultiplier: 1,
            hotMultiplier: 1
        },

        CHAUD: {
            preferredIntensity: 3,
            chaosMultiplier: 1.2,
            hotMultiplier: 1.5
        },

        CHAOS: {
            preferredIntensity: 3,
            chaosMultiplier: 2,
            hotMultiplier: 1.5
        }

    },


    /* ========================================================
       PÉNALITÉS
       Toujours légères et optionnelles.
       ======================================================== */

    PENALTIES: {
        DEFAULT: "1 petite gorgée ou alternative sans alcool",
        MAX: 2
    },


    /* ========================================================
       SESSION
       ======================================================== */

    SESSION: {
        SAVE_TO_LOCAL_STORAGE: true,
        STORAGE_KEY: "soiree_party_session",
        MAX_HISTORY: 30
    },


    /* ========================================================
       PERFORMANCE
       ======================================================== */

    ENGINE: {
        MIN_CANDIDATES: 3,
        MAX_CANDIDATES: 12,
        WEIGHT_RANDOMNESS: true
    }

};


/* ============================================================
   HELPERS
   ============================================================ */

function getIntensityConfig(intensity) {
    return (
        CONFIG.INTENSITY[intensity] ||
        CONFIG.INTENSITY.CLASSIQUE
    );
}


function getConfigValue(path, fallback = null) {

    const parts = path.split(".");

    let value = CONFIG;

    for (const part of parts) {

        if (
            value === undefined ||
            value === null ||
            !(part in value)
        ) {
            return fallback;
        }

        value = value[part];
    }

    return value;
}
