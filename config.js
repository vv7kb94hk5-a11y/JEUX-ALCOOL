/* ============================================================
   SOIRÉE — PARTY ENGINE CONFIG
   BUILD 07.0
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
       ======================================================== */

    COOLDOWN: {

        GAME: 5,

        QUESTION: 8,

        PLAYER: 3

    },


    /* ========================================================
       DIVERSITÉ
       ======================================================== */

    DIVERSITY: {

        MAX_SAME_FAMILY: 2

    },


    /* ========================================================
       INTENSITÉ
       ======================================================== */

    INTENSITY: {

        COOL: {

            preferredIntensity: 1,

            chaosMultiplier: 0.35,

            hotMultiplier: 0.25

        },


        CLASSIQUE: {

            preferredIntensity: 2,

            chaosMultiplier: 1,

            hotMultiplier: 1

        },


        CHAUD: {

            preferredIntensity: 3,

            chaosMultiplier: 1.4,

            hotMultiplier: 1.6

        },


        CHAOS: {

            preferredIntensity: 3,

            chaosMultiplier: 2.2,

            hotMultiplier: 2

        }

    },


    /* ========================================================
       PÉNALITÉS
       ======================================================== */

    PENALTIES: {

        DEFAULT:
            "1 gorgée ou une alternative sans alcool",

        MAX: 2

    },


    /* ========================================================
       SESSION
       ======================================================== */

    SESSION: {

        STORAGE_KEY:
            "soiree_party_session_v7",

        SAVE_TO_LOCAL_STORAGE: true,

        MAX_HISTORY: 30

    },


    /* ========================================================
       ROTATION DES JOUEURS
       ======================================================== */

    ROTATION: {

        RECENT_PLAYER_LIMIT: 3

    }

};


/* ============================================================
   HELPER — CONFIGURATION D'INTENSITÉ
   ============================================================ */

function getIntensityConfig(intensity) {

    return (

        CONFIG.INTENSITY[intensity]

        ||

        CONFIG.INTENSITY.CLASSIQUE

    );

}
