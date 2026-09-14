/* ============================================================
   SOIRÉE — CONTENT DATABASE
   BUILD 07.0
   ============================================================ */

const QUESTIONS = {


    /* ========================================================
       VOTE
       ======================================================== */

    VOTE: [

        "Qui pourrait disparaître pendant une soirée sans prévenir personne ?",

        "Qui pourrait finir célèbre sans que personne ne sache vraiment pourquoi ?",

        "Qui pourrait envoyer un message à la mauvaise personne ?",

        "Qui pourrait survivre le plus longtemps sur une île déserte ?",

        "Qui pourrait tomber amoureux le plus rapidement ?",

        "Qui pourrait mentir avec le plus d'assurance ?",

        "Qui pourrait devenir riche en premier ?",

        "Qui pourrait faire la plus grosse connerie ce soir ?",

        "Qui pourrait être le meilleur espion ?",

        "Qui pourrait partir vivre à l'autre bout du monde sur un coup de tête ?"

    ],


    /* ========================================================
       MAJORITÉ
       ======================================================== */

    MAJORITY: [

        "Qui est le plus susceptible d'arriver en retard ?",

        "Qui est le plus susceptible de répondre immédiatement à un message ?",

        "Qui est le plus susceptible de garder un secret ?",

        "Qui est le plus susceptible de faire rire tout le monde ?",

        "Qui est le plus susceptible de prendre une décision complètement imprévisible ?",

        "Qui est le plus susceptible de convaincre tout le monde qu'il a raison ?"

    ],


    /* ========================================================
       CIBLE
       ======================================================== */

    TARGET: [

        "Désignez quelqu'un qui semble toujours avoir une excuse.",

        "Désignez quelqu'un à qui vous ne confieriez jamais votre téléphone déverrouillé.",

        "Désignez quelqu'un qui pourrait être un excellent acteur.",

        "Désignez quelqu'un qui pourrait vous trahir dans un jeu de bluff.",

        "Désignez quelqu'un qui semble cacher quelque chose.",

        "Désignez quelqu'un qui pourrait vous convaincre de faire n'importe quoi."

    ],


    /* ========================================================
       CONNAISSANCE
       ======================================================== */

    KNOWLEDGE: [

        "Qui connaît le mieux les habitudes de la personne à sa gauche ?",

        "Qui connaît le mieux les goûts de la personne en face de lui ?",

        "Qui saurait deviner le choix de chacun dans cette pièce ?",

        "Qui connaît le mieux le groupe depuis le début de la soirée ?"

    ],


    /* ========================================================
       SUSPECT
       ======================================================== */

    SUSPECT: [

        "Qui semble le plus susceptible de mentir maintenant ?",

        "Qui cache probablement quelque chose au groupe ?",

        "Qui serait le plus difficile à lire pendant un interrogatoire ?",

        "Qui pourrait réussir à bluffer tout le monde ?",

        "Qui a le comportement le plus suspect depuis le début de la partie ?"

    ],


    /* ========================================================
       CATÉGORIES
       ======================================================== */

    CATEGORY: [

        "Marques de voitures",

        "Villes françaises",

        "Pays",

        "Films",

        "Séries",

        "Plats",

        "Métiers",

        "Animaux",

        "Objets dans une maison",

        "Célébrités",

        "Sports",

        "Applications"

    ],


    /* ========================================================
       MOTS
       ======================================================== */

    WORD: [

        "Plage",

        "Avion",

        "Téléphone",

        "Pizza",

        "Voiture",

        "Fantôme",

        "Mariage",

        "Prison",

        "Argent",

        "Vacances",

        "École",

        "Anniversaire"

    ],


    /* ========================================================
       MOT INTERDIT
       ======================================================== */

    FORBIDDEN_WORD: [

        {
            word: "oui",
            forbidden: ["ouais", "yes"]
        },

        {
            word: "non",
            forbidden: ["nan", "no"]
        },

        {
            word: "soirée",
            forbidden: ["fête"]
        },

        {
            word: "boire",
            forbidden: ["alcool"]
        },

        {
            word: "moi",
            forbidden: ["je"]
        },

        {
            word: "toi",
            forbidden: ["tu"]
        }

    ],


    /* ========================================================
       BLUFF
       ======================================================== */

    BLUFF: [

        "Raconte une anecdote improbable. Le groupe doit décider si elle est vraie.",

        "Affirme quelque chose sur toi que personne ici ne peut facilement vérifier.",

        "Raconte une histoire vraie en ajoutant un détail complètement faux.",

        "Invente une rencontre célèbre et raconte-la avec suffisamment de conviction pour être cru.",

        "Donne une affirmation surprenante sur toi. Le groupe vote : vrai ou faux ?"

    ],


    /* ========================================================
       DEUX VÉRITÉS, UN MENSONGE
       ======================================================== */

    STATEMENTS: [

        "Donne trois affirmations sur toi : deux vraies et une fausse.",

        "Donne trois anecdotes : deux vraies et une inventée.",

        "Donne trois choses que tu as déjà faites : deux vraies et une fausse."

    ],


    /* ========================================================
       QUESTIONS CHAUDES
       ======================================================== */

    HOT: [

        {
            intensity: 2,
            text: "Quelle est ta plus grosse honte en soirée ?"
        },

        {
            intensity: 2,
            text: "Quelle est la chose la plus gênante que tu aies envoyée par message ?"
        },

        {
            intensity: 2,
            text: "Quelle est la dernière fois où tu as menti pour éviter quelqu'un ?"
        },

        {
            intensity: 3,
            text: "Qui dans cette pièce pourrait le plus facilement te faire craquer ?"
        },

        {
            intensity: 3,
            text: "Quel est ton plus gros red flag ?"
        },

        {
            intensity: 3,
            text: "Quelle est la chose la plus folle que tu aies faite par attirance pour quelqu'un ?"
        },

        {
            intensity: 3,
            text: "Quel est le pire mensonge que tu aies raconté à quelqu'un que tu aimais ?"
        }

    ],


    /* ========================================================
       CHOIX
       ======================================================== */

    CHOICE: [

        "Préférerais-tu pouvoir lire les pensées ou voir le futur ?",

        "Préférerais-tu être extrêmement riche ou extrêmement célèbre ?",

        "Préférerais-tu ne plus jamais utiliser ton téléphone ou ne plus jamais voyager ?",

        "Préférerais-tu connaître toute la vérité ou modifier une seule erreur du passé ?",

        "Préférerais-tu être incapable de mentir ou incapable de dire toute la vérité ?",

        "Préférerais-tu avoir toujours raison ou toujours avoir de la chance ?"

    ],


    /* ========================================================
       VÉRITÉ DE GROUPE
       ======================================================== */

    GROUP_TRUTH: [

        "Chacun donne une première impression honnête qu'il a eue sur quelqu'un ici.",

        "Chacun dit une qualité qu'il apprécie chez la personne à sa droite.",

        "Chacun donne une chose que le groupe ignore probablement sur lui.",

        "Chacun désigne une personne avec qui il partirait en vacances."

    ],


    /* ========================================================
       EXPRESSIONS
       ======================================================== */

    EXPRESSION: [

        "Avoir le cœur sur la main",

        "Tomber dans les pommes",

        "Donner sa langue au chat",

        "Poser un lapin",

        "Avoir une mémoire de poisson rouge"

    ],


    /* ========================================================
       MISSIONS SECRÈTES
       ======================================================== */

    MISSION: [

        "Place naturellement le mot « banane » dans une conversation.",

        "Fais rire une personne sans qu'elle comprenne que c'était ta mission.",

        "Obtiens discrètement un « pourquoi ? » de quelqu'un.",

        "Fais parler quelqu'un d'un film sans lui poser directement la question."

    ],


    /* ========================================================
       DEVINE MON MOT
       ======================================================== */

    GUESS_WORD: [

        "Téléphone",

        "Vacances",

        "Fantôme",

        "Pizza",

        "Mariage",

        "Prison",

        "Plage",

        "Argent"

    ],


    /* ========================================================
       DESCRIPTION
       ======================================================== */

    DESCRIPTION: [

        "Décris un animal sans prononcer son nom ni faire son bruit.",

        "Décris une célébrité sans donner son métier.",

        "Décris un objet présent dans la pièce sans le montrer."

    ],


    /* ========================================================
       MIME
       ======================================================== */

    MIME: [

        "Faire du ski",

        "Réparer une voiture",

        "Être coincé dans un ascenseur",

        "Chercher ses clés",

        "Faire semblant d'être un robot"

    ],


    /* ========================================================
       PIÈGE
       ======================================================== */

    TRAP_PROMPT: [

        "Fais raconter au groupe une histoire sur son dernier voyage.",

        "Fais dire le mot « vraiment » à quelqu'un.",

        "Fais poser une question à la personne à ta gauche."

    ],


    /* ========================================================
       MOT PIÈGE
       ======================================================== */

    TRAP_WORD: [

        {
            word: "vraiment"
        },

        {
            word: "genre"
        },

        {
            word: "franchement"
        },

        {
            word: "exactement"
        }

    ],


    /* ========================================================
       IMPROVISATION
       ======================================================== */

    IMPRO: [

        "Vends un objet banal comme s'il coûtait 10 000 €.",

        "Défends une opinion absurde pendant 20 secondes.",

        "Fais une publicité improvisée pour la personne à ta droite."

    ]

};
