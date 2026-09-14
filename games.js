/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 07.0
   ============================================================ */

const GAMES = [

    /* ========================================================
       VOTE
       ======================================================== */

    {
        id: "G001",
        name: "Qui pourrait ?",
        family: "VOTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 1,
        cooldown: 6,
        targetType: "ONE",
        contentPool: "VOTE",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G002",
        name: "Majorité",
        family: "VOTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 1,
        cooldown: 6,
        targetType: "ONE",
        contentPool: "MAJORITY",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G003",
        name: "Cible du groupe",
        family: "VOTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 1,
        cooldown: 7,
        targetType: "ONE",
        contentPool: "TARGET",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G004",
        name: "Qui me connaît ?",
        family: "VOTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 1,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "KNOWLEDGE",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G005",
        name: "Le plus suspect",
        family: "VOTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "SUSPECT",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },


    /* ========================================================
       RAPIDITÉ
       ======================================================== */

    {
        id: "G006",
        name: "Catégorie express",
        family: "RAPIDITE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 7,
        targetType: "ROTATION",
        contentPool: "CATEGORY",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G007",
        name: "Association",
        family: "RAPIDITE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 7,
        targetType: "ROTATION",
        contentPool: "WORD",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G008",
        name: "Mot interdit",
        family: "RAPIDITE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "FORBIDDEN_WORD",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G009",
        name: "Le mot suivant",
        family: "RAPIDITE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 7,
        targetType: "ROTATION",
        contentPool: "WORD",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G010",
        name: "Piège à mot",
        family: "RAPIDITE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 9,
        targetType: "ONE",
        contentPool: "TRAP_WORD",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },


    /* ========================================================
       BLUFF
       ======================================================== */

    {
        id: "G011",
        name: "Deux vérités, un mensonge",
        family: "BLUFF",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 10,
        targetType: "ONE",
        contentPool: "STATEMENTS",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G012",
        name: "Bluff total",
        family: "BLUFF",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 10,
        targetType: "ONE",
        contentPool: "BLUFF",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G013",
        name: "Qui ment ?",
        family: "BLUFF",
        minPlayers: 4,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 10,
        targetType: "TWO",
        contentPool: "BLUFF",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_PLAYERS",
            "PLAY",
            "VOTE",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G014",
        name: "Le piège",
        family: "BLUFF",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 10,
        targetType: "ONE",
        contentPool: "TRAP_PROMPT",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G015",
        name: "Mission secrète",
        family: "BLUFF",
        minPlayers: 4,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 12,
        targetType: "ONE",
        contentPool: "MISSION",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },


    /* ========================================================
       DEVINETTE
       ======================================================== */

    {
        id: "G016",
        name: "Devine mon mot",
        family: "DEVINETTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 9,
        targetType: "ONE",
        contentPool: "GUESS_WORD",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G017",
        name: "Description impossible",
        family: "DEVINETTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 9,
        targetType: "ONE",
        contentPool: "DESCRIPTION",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G018",
        name: "Mime express",
        family: "DEVINETTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "MIME",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },

    {
        id: "G019",
        name: "L'expression",
        family: "DEVINETTE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 9,
        targetType: "ONE",
        contentPool: "EXPRESSION",
        phone: "PASS_TO_TARGET",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PASS_PHONE",
            "PRIVATE_REVEAL",
            "RETURN_PHONE",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },


    /* ========================================================
       PERSONNEL
       ======================================================== */

    {
        id: "G020",
        name: "Question chaude",
        family: "PERSONNEL",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "HOT",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    },


    /* ========================================================
       CHOIX
       ======================================================== */

    {
        id: "G021",
        name: "Choix impossible",
        family: "CHOIX",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 1,
        cooldown: 7,
        targetType: "ALL",
        contentPool: "CHOICE",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "RESULT",
            "NEXT"
        ]
    },


    /* ========================================================
       GROUPE
       ======================================================== */

    {
        id: "G022",
        name: "Vérité de groupe",
        family: "GROUPE",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ALL",
        contentPool: "GROUP_TRUTH",
        phone: "NONE",
        phases: [
            "INTRO",
            "PLAY",
            "RESULT",
            "NEXT"
        ]
    },


    /* ========================================================
       IMPRO
       ======================================================== */

    {
        id: "G023",
        name: "Mission improvisée",
        family: "IMPRO",
        minPlayers: 3,
        maxPlayers: 12,
        intensity: 2,
        cooldown: 8,
        targetType: "ONE",
        contentPool: "IMPRO",
        phone: "NONE",
        phases: [
            "INTRO",
            "SELECT_TARGET",
            "PLAY",
            "RESULT",
            "PENALTY",
            "NEXT"
        ]
    }

];
