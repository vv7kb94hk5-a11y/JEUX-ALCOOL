/* ============================================================
   SOIRÉE — QUESTIONS
   BUILD 08.0

   RÈGLE :
   Chaque pool possède un format cohérent.

   String :
     contenu directement affichable.

   Object :
     contenu nécessitant plusieurs informations.

   Aucun jeu ne doit devoir deviner la structure
   d'une question.
   ============================================================ */


const QUESTIONS = {


    /* ========================================================
       VOTE DU GROUPE
       ======================================================== */

    VOTE: [

        "Qui serait capable de partir en soirée sans prévenir personne ?",

        "Qui serait le plus susceptible d'arriver complètement en retard ?",

        "Qui pourrait envoyer un message gênant à la mauvaise personne ?",

        "Qui serait capable de survivre le moins longtemps sans son téléphone ?",

        "Qui serait le premier à proposer de continuer la soirée ailleurs ?",

        "Qui pourrait finir la soirée avec une nouvelle histoire improbable ?",

        "Qui serait capable de faire quelque chose de complètement imprévisible ce soir ?",

        "Qui serait le plus susceptible de perdre quelque chose ce soir ?",

        "Qui pourrait devenir célèbre pour une raison complètement absurde ?",

        "Qui serait capable de convaincre tout le monde de faire une mauvaise idée ?"

    ],


    /* ========================================================
       MAJORITÉ
       ======================================================== */

    MAJORITY: [

        "Qui est le plus susceptible de devenir riche ?",

        "Qui pourrait avoir une double vie sans que personne ne le sache ?",

        "Qui serait le plus dangereux avec beaucoup d'argent ?",

        "Qui pourrait partir vivre à l'autre bout du monde sur un coup de tête ?",

        "Qui serait le premier à accepter une aventure complètement folle ?",

        "Qui pourrait devenir célèbre dans le groupe ?"

    ],


    /* ========================================================
       CIBLE DU GROUPE
       ======================================================== */

    TARGET: [

        "Désignez la personne qui serait la plus susceptible de faire ça.",

        "Qui mérite le plus d'être mis au défi maintenant ?",

        "Qui serait le choix le plus évident du groupe ?",

        "Désignez la personne qui connaît le mieux tout le monde ici.",

        "Qui serait la pire personne à avoir comme colocataire ?",

        "Qui serait capable de retourner toute la soirée à lui seul ?"

    ],


    /* ========================================================
       QUI ME CONNAÎT ?
       ======================================================== */

    KNOWLEDGE: [

        {
            question: "Quel est le dernier endroit où j'aimerais partir en vacances ?",
            answerMode: "ORAL"
        },

        {
            question: "Quelle est la chose que je supporte le moins chez les autres ?",
            answerMode: "ORAL"
        },

        {
            question: "Quel serait mon week-end idéal ?",
            answerMode: "ORAL"
        },

        {
            question: "Quelle est la chose que je pourrais acheter sur un coup de tête ?",
            answerMode: "ORAL"
        }

    ],


    /* ========================================================
       SUSPECT
       ======================================================== */

    SUSPECT: [

        "Qui cache probablement quelque chose ce soir ?",

        "Qui pourrait mentir avec le plus de facilité ?",

        "Qui serait le plus difficile à croire dans une enquête ?",

        "Qui pourrait avoir un secret que personne ne connaît ?",

        "Qui serait le plus suspect s'il quittait soudainement la pièce ?"

    ],


    /* ========================================================
       CATÉGORIE EXPRESS
       ======================================================== */

    CATEGORY: [

        "Cite un film avec un acteur connu.",

        "Cite une ville française.",

        "Cite une marque de voiture.",

        "Cite quelque chose qu'on trouve dans une cuisine.",

        "Cite une application de téléphone.",

        "Cite une célébrité.",

        "Cite un sport.",

        "Cite un animal.",

        "Cite une destination de vacances.",

        "Cite une chanson connue.",

        "Cite un métier.",

        "Cite quelque chose qu'on peut trouver dans un bar."

    ],


    /* ========================================================
       ASSOCIATION
       ======================================================== */

    WORD: [

        "Plage",

        "Nuit",

        "Argent",

        "Vacances",

        "Musique",

        "Soirée",

        "Téléphone",

        "Amour",

        "Travail",

        "Alcool",

        "Amitié",

        "Danger"

    ],


    /* ========================================================
       MOT INTERDIT
       ======================================================== */

    FORBIDDEN_WORD: [

        {
            word: "Téléphone",
            forbidden: [
                "portable",
                "mobile",
                "appeler"
            ]
        },

        {
            word: "Argent",
            forbidden: [
                "euros",
                "payer",
                "fric"
            ]
        },

        {
            word: "Plage",
            forbidden: [
                "mer",
                "sable",
                "soleil"
            ]
        },

        {
            word: "Soirée",
            forbidden: [
                "fête",
                "soir",
                "party"
            ]
        },

        {
            word: "Amour",
            forbidden: [
                "couple",
                "aimer",
                "coeur"
            ]
        },

        {
            word: "Travail",
            forbidden: [
                "bureau",
                "emploi",
                "patron"
            ]
        }

    ],


    /* ========================================================
       BLUFF TOTAL
       ======================================================== */

    BLUFF: [

        "Invente une histoire crédible que personne ici ne pourra vérifier.",

        "Raconte une anecdote complètement improbable comme si elle était vraie.",

        "Affirme quelque chose de faux avec suffisamment d'assurance pour convaincre le groupe.",

        "Invente une expérience que tu aurais soi-disant vécue.",

        "Fais croire au groupe que tu connais parfaitement un sujet que tu ne maîtrises pas."

    ],


    /* ========================================================
       DEUX VÉRITÉS, UN MENSONGE
       ======================================================== */

    STATEMENTS: [

        {
            instruction: "Donne trois affirmations sur toi : deux vraies et une fausse.",
            rule: "Le groupe doit trouver laquelle est fausse."
        },

        {
            instruction: "Raconte trois petites anecdotes personnelles : deux vraies et une inventée.",
            rule: "Le groupe vote pour celle qu'il pense être fausse."
        },

        {
            instruction: "Donne trois choses que tu as déjà faites : deux vraies et une fausse.",
            rule: "Le groupe doit identifier le mensonge."
        }

    ],


    /* ========================================================
       QUESTIONS CHAUDES
       ======================================================== */

    HOT: [

        {
            intensity: 1,
            text: "Quelle est la chose la plus gênante que tu aies faite devant quelqu'un que tu voulais impressionner ?"
        },

        {
            intensity: 1,
            text: "Quel est ton plus gros défaut en soirée ?"
        },

        {
            intensity: 2,
            text: "Quelle personne ici pourrais-tu appeler à 3 heures du matin ?"
        },

        {
            intensity: 2,
            text: "Quel est ton plus gros red flag ?"
        },

        {
            intensity: 2,
            text: "Quelle est la chose que tu n'oserais jamais avouer spontanément au groupe ?"
        },

        {
            intensity: 3,
            text: "Avec qui ici pourrais-tu le plus facilement avoir un date ?"
        },

        {
            intensity: 3,
            text: "Quelle est la personne ici qui pourrait le plus facilement te faire craquer ?"
        }

    ],


    /* ========================================================
       CHOIX IMPOSSIBLE
       ======================================================== */

    CHOICE: [

        {
            question: "Tu préfères ne plus jamais boire d'alcool ou ne plus jamais sortir en soirée ?",

            choices: [
                "Plus d'alcool",
                "Plus de soirées"
            ]
        },

        {
            question: "Tu préfères connaître la date de ta mort ou la cause de ta mort ?",

            choices: [
                "La date",
                "La cause"
            ]
        },

        {
            question: "Tu préfères être riche mais inconnu ou célèbre mais pauvre ?",

            choices: [
                "Riche et inconnu",
                "Célèbre et pauvre"
            ]
        },

        {
            question: "Tu préfères pouvoir lire les pensées ou voir le futur ?",

            choices: [
                "Lire les pensées",
                "Voir le futur"
            ]
        },

        {
            question: "Tu préfères ne plus avoir de téléphone ou ne plus avoir Internet ?",

            choices: [
                "Plus de téléphone",
                "Plus d'Internet"
            ]
        },

        {
            question: "Tu préfères revivre ton meilleur souvenir ou effacer ton pire ?",

            choices: [
                "Revivre le meilleur",
                "Effacer le pire"
            ]
        }

    ],


    /* ========================================================
       VÉRITÉ DE GROUPE
       ======================================================== */

    GROUP_TRUTH: [

        "Chacun raconte une chose que personne ici ne sait encore sur lui.",

        "Chacun raconte une petite honte dont il peut rire aujourd'hui.",

        "Chacun raconte une décision complètement impulsive qu'il a déjà prise.",

        "Chacun raconte une chose qu'il aimerait changer chez lui."

    ],


    /* ========================================================
       EXPRESSIONS
       ======================================================== */

    EXPRESSION: [

        "Avoir le cœur sur la main",

        "Tomber dans les pommes",

        "Mettre les pieds dans le plat",

        "Avoir la tête dans les nuages",

        "Donner sa langue au chat",

        "Poser un lapin",

        "Coûter les yeux de la tête",

        "Casser les pieds"

    ],


    /* ========================================================
       MISSIONS SECRÈTES
       ======================================================== */

    MISSION: [

        "Fais dire le mot « vraiment » à quelqu'un sans lui demander directement de le prononcer.",

        "Fais rire une personne du groupe sans qu'elle comprenne que c'était ton objectif.",

        "Obtiens un high-five de quelqu'un sans expliquer pourquoi.",

        "Fais parler quelqu'un de ses dernières vacances.",

        "Amène naturellement quelqu'un à parler de musique.",

        "Fais poser une question à quelqu'un sur toi."

    ],


    /* ========================================================
       MOT À DEVINER
       ======================================================== */

    GUESS_WORD: [

        {
            word: "Pizza",
            hint: "On peut la commander."
        },

        {
            word: "Plage",
            hint: "On y va surtout quand il fait beau."
        },

        {
            word: "Téléphone",
            hint: "Presque tout le monde en possède un."
        },

        {
            word: "Avion",
            hint: "Il permet de voyager très loin."
        },

        {
            word: "Cinéma",
            hint: "On y va pour regarder des films."
        },

        {
            word: "Restaurant",
            hint: "On y va principalement pour manger."
        },

        {
            word: "Musique",
            hint: "Elle peut accompagner toute une soirée."
        },

        {
            word: "Vacances",
            hint: "On les attend généralement avec impatience."
        }

    ],


    /* ========================================================
       DESCRIPTION IMPOSSIBLE
       ======================================================== */

    DESCRIPTION: [

        {
            word: "Pizza",
            rule: "Fais deviner le mot sans utiliser le nom d'un ingrédient."
        },

        {
            word: "Téléphone",
            rule: "Fais deviner l'objet sans dire à quoi il sert directement."
        },

        {
            word: "Plage",
            rule: "Fais deviner l'endroit sans utiliser les mots mer, sable ou soleil."
        }

    ],


    /* ========================================================
       MIME
       ======================================================== */

    MIME: [

        "Faire semblant de conduire",

        "Chercher ses clés partout",

        "Faire du sport",

        "Être réveillé par une alarme",

        "Commander au restaurant"

    ],


    /* ========================================================
       PIÈGE
       ======================================================== */

    TRAP_PROMPT: [

        "Fais parler naturellement la personne de ses vacances.",

        "Fais prononcer à quelqu'un le prénom d'une autre personne.",

        "Fais demander à quelqu'un quelle heure il est."

    ],


    /* ========================================================
       MOT PIÈGE
       ======================================================== */

    TRAP_WORD: [

        {
            word: "Pizza",
            forbidden: [
                "restaurant",
                "fromage",
                "pâte"
            ]
        },

        {
            word: "Vacances",
            forbidden: [
                "voyage",
                "plage",
                "hôtel"
            ]
        },

        {
            word: "Téléphone",
            forbidden: [
                "portable",
                "mobile",
                "écran"
            ]
        },

        {
            word: "Musique",
            forbidden: [
                "chanson",
                "son",
                "écouter"
            ]
        }

    ],


    /* ========================================================
       IMPROVISATION
       ======================================================== */

    IMPRO: [

        "Fais une publicité improvisée pour l'objet le plus proche de toi.",

        "Décris ton voisin comme si tu étais commentateur sportif.",

        "Fais un discours extrêmement sérieux sur un sujet complètement ridicule."

    ]

};


/* ============================================================
   VALIDATION DES POOLS
   ============================================================ */

function validateQuestions() {

    const errors = [];

    Object.entries(
        QUESTIONS
    ).forEach(
        ([poolName, pool]) => {

            if (
                !Array.isArray(pool) ||
                pool.length === 0
            ) {

                errors.push(
                    `${poolName} : pool vide ou invalide`
                );

            }

        }
    );


    /*
     * STATEMENTS doit obligatoirement
     * contenir instruction + rule.
     */

    QUESTIONS.STATEMENTS.forEach(
        (item, index) => {

            if (
                typeof item !== "object" ||
                !item.instruction ||
                !item.rule
            ) {

                errors.push(
                    `STATEMENTS[${index}] : format invalide`
                );

            }

        }
    );


    /*
     * CHOICE doit avoir une question
     * et au moins deux choix.
     */

    QUESTIONS.CHOICE.forEach(
        (item, index) => {

            if (
                !item.question ||
                !Array.isArray(item.choices) ||
                item.choices.length < 2
            ) {

                errors.push(
                    `CHOICE[${index}] : format invalide`
                );

            }

        }
    );


    /*
     * HOT doit avoir texte + intensité.
     */

    QUESTIONS.HOT.forEach(
        (item, index) => {

            if (
                !item.text ||
                typeof item.intensity !== "number"
            ) {

                errors.push(
                    `HOT[${index}] : format invalide`
                );

            }

        }
    );


    /*
     * Pools secrets.
     */

    [
        "FORBIDDEN_WORD",
        "TRAP_WORD"
    ].forEach(
        poolName => {

            QUESTIONS[poolName].forEach(
                (item, index) => {

                    if (
                        !item.word ||
                        !Array.isArray(
                            item.forbidden
                        )
                    ) {

                        errors.push(
                            `${poolName}[${index}] : format invalide`
                        );

                    }

                }
            );

        }
    );


    return {

        valid:
            errors.length === 0,

        errors

    };

}
