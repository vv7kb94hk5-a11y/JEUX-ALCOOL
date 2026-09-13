/* ============================================================
   SOIRÉE — GAME DATABASE
   BUILD 02.0
   30 MÉCANIQUES — 6 FAMILLES
   ============================================================ */

const GAMES = [

    /* ========================================================
       VOTE
       ======================================================== */

    {
        id: "G001",
        name: "Qui pourrait ?",
        family: "VOTE",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 30,
        intensity: 1,
        cooldown: 6,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["vote", "personne", "groupe", "rapide"],
        contentType: "QUESTION"
    },

    {
        id: "G002",
        name: "Majorité",
        family: "VOTE",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 30,
        intensity: 1,
        cooldown: 6,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["vote", "majorite", "prediction", "groupe"],
        contentType: "QUESTION"
    },

    {
        id: "G003",
        name: "Cible du groupe",
        family: "VOTE",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 2,
        cooldown: 7,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["vote", "cible", "personne", "accusation"],
        contentType: "QUESTION"
    },

    {
        id: "G004",
        name: "Qui me connaît ?",
        family: "VOTE",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 40,
        intensity: 1,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["vote", "connaissance", "personnel"],
        contentType: "QUESTION"
    },

    {
        id: "G005",
        name: "Le plus suspect",
        family: "VOTE",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 2,
        cooldown: 7,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["vote", "suspect", "bluff", "groupe"],
        contentType: "QUESTION"
    },


    /* ========================================================
       RAPIDITÉ
       ======================================================== */

    {
        id: "G006",
        name: "Catégorie express",
        family: "RAPIDITÉ",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 1,
        cooldown: 6,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["rapidite", "categorie", "reflexion", "chaine"],
        contentType: "CATEGORY"
    },

    {
        id: "G007",
        name: "Association",
        family: "RAPIDITÉ",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 40,
        intensity: 1,
        cooldown: 6,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["rapidite", "mots", "association", "reflexe"],
        contentType: "WORD"
    },

    {
        id: "G008",
        name: "Mot interdit",
        family: "RAPIDITÉ",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 40,
        intensity: 1,
        cooldown: 7,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["rapidite", "interdit", "parole", "piege"],
        contentType: "WORD"
    },

    {
        id: "G009",
        name: "Le mot suivant",
        family: "RAPIDITÉ",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 1,
        cooldown: 7,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["rapidite", "mots", "chaine", "reflexe"],
        contentType: "WORD"
    },

    {
        id: "G010",
        name: "Piège à mot",
        family: "RAPIDITÉ",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 2,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["rapidite", "piege", "parole", "attention"],
        contentType: "WORD"
    },


    /* ========================================================
       BLUFF
       ======================================================== */

    {
        id: "G011",
        name: "Deux vérités, un mensonge",
        family: "BLUFF",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 60,
        intensity: 1,
        cooldown: 10,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["bluff", "mensonge", "personnel"],
        contentType: "STATEMENTS"
    },

    {
        id: "G012",
        name: "Bluff total",
        family: "BLUFF",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 50,
        intensity: 2,
        cooldown: 9,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["bluff", "mensonge", "conviction"],
        contentType: "BLUFF"
    },

    {
        id: "G013",
        name: "Qui ment ?",
        family: "BLUFF",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 4,
        maxPlayers: 12,
        duration: 55,
        intensity: 2,
        cooldown: 9,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["bluff", "mensonge", "vote", "suspicion"],
        contentType: "BLUFF"
    },

    {
        id: "G014",
        name: "Le piège",
        family: "BLUFF",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 2,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["bluff", "piege", "question", "parole"],
        contentType: "BLUFF"
    },

    {
        id: "G015",
        name: "Mission secrète",
        family: "BLUFF",
        interaction: "PHONE",
        targetType: "ONE",
        minPlayers: 4,
        maxPlayers: 12,
        duration: 90,
        intensity: 2,
        cooldown: 12,
        requiresWriting: false,
        requiresPhonePass: true,
        tags: ["secret", "mission", "bluff", "surveillance"],
        contentType: "MISSION"
    },


    /* ========================================================
       DEVINETTE / CRÉATIVITÉ
       ======================================================== */

    {
        id: "G016",
        name: "Devine mon mot",
        family: "DEVINETTE",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 1,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["devinette", "description", "mot"],
        contentType: "WORD"
    },

    {
        id: "G017",
        name: "Description impossible",
        family: "DEVINETTE",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 50,
        intensity: 1,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["devinette", "description", "creativite"],
        contentType: "WORD"
    },

    {
        id: "G018",
        name: "Mime express",
        family: "DEVINETTE",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 40,
        intensity: 1,
        cooldown: 7,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["mime", "devinette", "corps", "rapide"],
        contentType: "MIME"
    },

    {
        id: "G019",
        name: "L'expression",
        family: "DEVINETTE",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 1,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["expression", "devinette", "mime", "culture"],
        contentType: "EXPRESSION"
    },

    {
        id: "G020",
        name: "Impro impossible",
        family: "DEVINETTE",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 50,
        intensity: 2,
        cooldown: 9,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["impro", "creativite", "parole", "role"],
        contentType: "IMPRO"
    },


    /* ========================================================
       PERSONNEL
       ======================================================== */

    {
        id: "G021",
        name: "Question hot",
        family: "PERSONNEL",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 3,
        cooldown: 10,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["hot", "personnel", "question"],
        contentType: "HOT"
    },

    {
        id: "G022",
        name: "Aveu ou pénalité",
        family: "PERSONNEL",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 40,
        intensity: 3,
        cooldown: 10,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["hot", "aveu", "personnel", "choix"],
        contentType: "HOT"
    },

    {
        id: "G023",
        name: "Tu préfères ?",
        family: "PERSONNEL",
        interaction: "NARRATOR",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 2,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["choix", "personnel", "question"],
        contentType: "WOULD_YOU_RATHER"
    },

    {
        id: "G024",
        name: "Ton choix",
        family: "PERSONNEL",
        interaction: "GROUP",
        targetType: "ONE",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 35,
        intensity: 2,
        cooldown: 8,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["choix", "vote", "personnel"],
        contentType: "CHOICE"
    },

    {
        id: "G025",
        name: "Vérité de groupe",
        family: "PERSONNEL",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 2,
        cooldown: 9,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["verite", "groupe", "personnel", "discussion"],
        contentType: "GROUP_TRUTH"
    },


    /* ========================================================
       CHAOS
       ======================================================== */

    {
        id: "G026",
        name: "Duo improbable",
        family: "CHAOS",
        interaction: "GROUP",
        targetType: "PAIR",
        minPlayers: 4,
        maxPlayers: 12,
        duration: 60,
        intensity: 2,
        cooldown: 10,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["duo", "chaos", "impro", "interaction"],
        contentType: "DUO"
    },

    {
        id: "G027",
        name: "Revanche",
        family: "CHAOS",
        interaction: "NARRATOR",
        targetType: "TWO",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 2,
        cooldown: 10,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["revanche", "duel", "competition", "chaos"],
        contentType: "DUEL"
    },

    {
        id: "G028",
        name: "Tout le monde",
        family: "CHAOS",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 45,
        intensity: 2,
        cooldown: 9,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["groupe", "tous", "chaos", "rapidite"],
        contentType: "GROUP"
    },

    {
        id: "G029",
        name: "Chaos total",
        family: "CHAOS",
        interaction: "GROUP",
        targetType: "ALL",
        minPlayers: 3,
        maxPlayers: 12,
        duration: 60,
        intensity: 3,
        cooldown: 12,
        requiresWriting: false,
        requiresPhonePass: false,
        tags: ["chaos", "surprise", "groupe", "mix"],
        contentType: "CHAOS"
    },

    {
        id: "G030",
        name: "Règle secrète",
        family: "CHAOS",
        interaction: "PHONE",
        targetType: "ALL",
        minPlayers: 4,
        maxPlayers: 12,
        duration: 90,
        intensity: 3,
        cooldown: 12,
        requiresWriting: false,
        requiresPhonePass: true,
        tags: ["secret", "regle", "chaos", "surprise"],
        contentType: "SECRET_RULE"
    }

];
