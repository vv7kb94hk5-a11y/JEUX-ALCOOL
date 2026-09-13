/* ============================================================
   SOIRÉE — QUESTION DATABASE
   BUILD 02.0
   CONTENU DE BASE
   ============================================================ */

const QUESTIONS = {

    /* ========================================================
       VOTE
       ======================================================== */

    VOTE: [
        {
            id: "V001",
            text: "Qui pourrait disparaître pendant une soirée sans prévenir personne ?"
        },
        {
            id: "V002",
            text: "Qui pourrait finir célèbre sans que personne ne sache vraiment pourquoi ?"
        },
        {
            id: "V003",
            text: "Qui pourrait envoyer un message à la mauvaise personne ?"
        },
        {
            id: "V004",
            text: "Qui pourrait survivre le plus longtemps sur une île déserte ?"
        },
        {
            id: "V005",
            text: "Qui pourrait tomber amoureux le plus rapidement ?"
        },
        {
            id: "V006",
            text: "Qui pourrait mentir avec le plus d'assurance ?"
        },
        {
            id: "V007",
            text: "Qui pourrait devenir riche en premier ?"
        },
        {
            id: "V008",
            text: "Qui pourrait faire la plus grosse connerie ce soir ?"
        },
        {
            id: "V009",
            text: "Qui pourrait être le meilleur espion ?"
        },
        {
            id: "V010",
            text: "Qui pourrait partir vivre à l'autre bout du monde sur un coup de tête ?"
        }
    ],


    /* ========================================================
       MAJORITÉ
       ======================================================== */

    MAJORITE: [
        {
            id: "M001",
            text: "Qui est le plus susceptible de répondre immédiatement à un message ?"
        },
        {
            id: "M002",
            text: "Qui est le plus susceptible d'arriver en retard ?"
        },
        {
            id: "M003",
            text: "Qui est le plus susceptible de garder un secret ?"
        },
        {
            id: "M004",
            text: "Qui est le plus susceptible de mentir pour éviter une soirée ?"
        },
        {
            id: "M005",
            text: "Qui est le plus susceptible de faire rire tout le monde ?"
        },
        {
            id: "M006",
            text: "Qui est le plus susceptible de se faire remarquer partout où il va ?"
        },
        {
            id: "M007",
            text: "Qui est le plus susceptible de prendre une décision complètement imprévisible ?"
        },
        {
            id: "M008",
            text: "Qui est le plus susceptible de convaincre tout le monde qu'il a raison ?"
        }
    ],


    /* ========================================================
       CIBLE
       ======================================================== */

    CIBLE: [
        {
            id: "C001",
            text: "Désignez quelqu'un qui semble toujours avoir une excuse."
        },
        {
            id: "C002",
            text: "Désignez quelqu'un à qui vous ne confieriez jamais votre téléphone déverrouillé."
        },
        {
            id: "C003",
            text: "Désignez quelqu'un qui pourrait être un excellent acteur."
        },
        {
            id: "C004",
            text: "Désignez quelqu'un qui pourrait vous trahir dans un jeu de bluff."
        },
        {
            id: "C005",
            text: "Désignez quelqu'un qui semble cacher quelque chose."
        },
        {
            id: "C006",
            text: "Désignez quelqu'un qui serait capable de vous convaincre de faire n'importe quoi."
        }
    ],


    /* ========================================================
       CONNAISSANCE
       ======================================================== */

    CONNAISSANCE: [
        {
            id: "K001",
            text: "Qui connaît le mieux les habitudes de la personne à sa gauche ?"
        },
        {
            id: "K002",
            text: "Qui connaît le mieux les goûts de la personne en face de lui ?"
        },
        {
            id: "K003",
            text: "Qui saurait deviner le choix de chacun dans cette pièce ?"
        },
        {
            id: "K004",
            text: "Qui connaît le mieux le groupe depuis le début de la soirée ?"
        },
        {
            id: "K005",
            text: "Qui saurait le mieux décrire la personnalité de chaque joueur ?"
        }
    ],


    /* ========================================================
       SUSPECT
       ======================================================== */

    SUSPECT: [
        {
            id: "S001",
            text: "Qui semble le plus susceptible de mentir maintenant ?"
        },
        {
            id: "S002",
            text: "Qui cache probablement quelque chose au groupe ?"
        },
        {
            id: "S003",
            text: "Qui serait le plus difficile à lire pendant un interrogatoire ?"
        },
        {
            id: "S004",
            text: "Qui pourrait réussir à bluffer tout le monde ?"
        },
        {
            id: "S005",
            text: "Qui a le comportement le plus suspect depuis le début de la partie ?"
        }
    ],


    /* ========================================================
       CATÉGORIES
       ======================================================== */

    CATEGORY: [
        {
            id: "CA001",
            category: "Marques de voitures"
        },
        {
            id: "CA002",
            category: "Villes françaises"
        },
        {
            id: "CA003",
            category: "Pays"
        },
        {
            id: "CA004",
            category: "Films"
        },
        {
            id: "CA005",
            category: "Séries"
        },
        {
            id: "CA006",
            category: "Plats"
        },
        {
            id: "CA007",
            category: "Métiers"
        },
        {
            id: "CA008",
            category: "Animaux"
        },
        {
            id: "CA009",
            category: "Objets que l'on trouve dans une maison"
        },
        {
            id: "CA010",
            category: "Célébrités"
        },
        {
            id: "CA011",
            category: "Sports"
        },
        {
            id: "CA012",
            category: "Applications"
        }
    ],


    /* ========================================================
       MOTS
       ======================================================== */

    WORD: [
        {
            id: "W001",
            word: "Plage"
        },
        {
            id: "W002",
            word: "Avion"
        },
        {
            id: "W003",
            word: "Téléphone"
        },
        {
            id: "W004",
            word: "Pizza"
        },
        {
            id: "W005",
            word: "Voiture"
        },
        {
            id: "W006",
            word: "Fantôme"
        },
        {
            id: "W007",
            word: "Mariage"
        },
        {
            id: "W008",
            word: "Prison"
        },
        {
            id: "W009",
            word: "Argent"
        },
        {
            id: "W010",
            word: "Vacances"
        },
        {
            id: "W011",
            word: "École"
        },
        {
            id: "W012",
            word: "Anniversaire"
        }
    ],


    /* ========================================================
       MOTS INTERDITS
       ======================================================== */

    FORBIDDEN_WORD: [
        {
            id: "F001",
            word: "oui",
            forbidden: ["ouais", "yes"]
        },
        {
            id: "F002",
            word: "non",
            forbidden: ["nan", "no"]
        },
        {
            id: "F003",
            word: "soirée",
            forbidden: ["fête"]
        },
        {
            id: "F004",
            word: "boire",
            forbidden: ["alcool"]
        },
        {
            id: "F005",
            word: "moi",
            forbidden: ["je"]
        },
        {
            id: "F006",
            word: "toi",
            forbidden: ["tu"]
        }
    ],


    /* ========================================================
       BLUFF
       ======================================================== */

    BLUFF: [
        {
            id: "B001",
            prompt: "Raconte une anecdote improbable. Le groupe doit décider si elle est vraie."
        },
        {
            id: "B002",
            prompt: "Affirme quelque chose sur toi que personne ici ne peut facilement vérifier."
        },
        {
            id: "B003",
            prompt: "Raconte une histoire vraie en ajoutant un détail complètement faux."
        },
        {
            id: "B004",
            prompt: "Invente une rencontre célèbre et raconte-la avec suffisamment de conviction pour être cru."
        },
        {
            id: "B005",
            prompt: "Donne une affirmation surprenante sur toi. Le groupe doit voter : vrai ou faux ?"
        },
        {
            id: "B006",
            prompt: "Raconte ton pire mensonge raconté à quelqu'un."
        }
    ],


    /* ========================================================
       STATEMENTS
       ======================================================== */

    STATEMENTS: [
        {
            id: "ST001",
            instruction: "Donne trois affirmations sur toi : deux vraies et une fausse."
        },
        {
            id: "ST002",
            instruction: "Donne trois anecdotes : deux vraies et une inventée."
        },
        {
            id: "ST003",
            instruction: "Donne trois choses que tu as déjà faites : deux vraies et une fausse."
        },
        {
            id: "ST004",
            instruction: "Donne trois choses que tu aimerais faire : deux vraies et une fausse."
        }
    ],


    /* ========================================================
       HOT
       ======================================================== */

    HOT: [
        {
            id: "H001",
            intensity: 2,
            text: "Quelle est la personne de cette pièce que tu connaissais le moins avant ce soir ?"
        },
        {
            id: "H002",
            intensity: 2,
            text: "Quelle est ta plus grosse honte en soirée ?"
        },
        {
            id: "H003",
            intensity: 2,
            text: "Quelle est la chose la plus gênante que tu aies envoyée par message ?"
        },
        {
            id: "H004",
            intensity: 2,
            text: "Quelle est la dernière fois où tu as menti pour éviter quelqu'un ?"
        },
        {
            id: "H005",
            intensity: 3,
            text: "Qui dans cette pièce pourrait le plus facilement te faire craquer ?"
        },
        {
            id: "H006",
            intensity: 3,
            text: "Quelle est la décision la plus impulsive que tu aies prise pour quelqu'un ?"
        },
        {
            id: "H007",
            intensity: 3,
            text: "As-tu déjà regretté d'avoir embrassé quelqu'un ?"
        },
        {
            id: "H008",
            intensity: 3,
            text: "Quel est ton plus gros red flag ?"
        },
        {
            id: "H009",
            intensity: 3,
            text: "Quelle est la chose la plus folle que tu aies faite par attirance pour quelqu'un ?"
        },
        {
            id: "H010",
            intensity: 3,
            text: "Quel est le pire mensonge que tu aies raconté à quelqu'un que tu aimais ?"
        }
    ],


    /* ========================================================
       CHOIX
       ======================================================== */

    CHOICE: [
        {
            id: "CH001",
            text: "Préférerais-tu pouvoir lire les pensées ou voir le futur ?"
        },
        {
            id: "CH002",
            text: "Préférerais-tu être extrêmement riche ou extrêmement célèbre ?"
        },
        {
            id: "CH003",
            text: "Préférerais-tu ne plus jamais utiliser ton téléphone ou ne plus jamais voyager ?"
        },
        {
            id: "CH004",
            text: "Préférerais-tu connaître toute la vérité ou pouvoir modifier une seule erreur du passé ?"
        },
        {
            id: "CH005",
            text: "Préférerais-tu être incapable de mentir ou incapable de dire toute la vérité ?"
        },
        {
            id: "CH006",
            text: "Préférerais-tu vivre sans musique ou sans films ?"
        },
        {
            id: "CH007",
            text: "Préférerais-tu être aimé par tout le monde ou respecté par tout le monde ?"
        },
        {
            id: "CH008",
            text: "Préférerais-tu avoir toujours raison ou toujours avoir de la chance ?"
        }
    ],


    /* ========================================================
       VÉRITÉ DE GROUPE
       ======================================================== */

    GROUP_TRUTH: [
        {
            id: "GT001",
            text: "Chacun donne une première impression honnête qu'il a eue sur quelqu'un ici."
        },
        {
            id: "GT002",
            text: "Chacun dit une qualité qu'il apprécie chez la personne à sa droite."
        },
        {
            id: "GT003",
            text: "Chacun donne une chose que le groupe ignore probablement sur lui."
        },
        {
            id: "GT004",
            text: "Chacun désigne une personne avec qui il partirait en vacances."
        },
        {
            id: "GT005",
            text: "Chacun dit qui il appellerait en premier en cas de gros problème."
        }
    ],


    /* ========================================================
       EXPRESSIONS
       ======================================================== */

    EXPRESSION: [
        {
            id: "E001",
            expression: "Avoir le cœur sur la main"
        },
        {
            id: "E002",
            expression: "Tomber dans les pommes"
        },
        {
            id: "E003",
            expression: "Donner sa langue au chat"
        },
        {
            id: "E004",
            expression: "Poser un lapin"
        },
        {
            id: "E005",
            expression: "Avoir une mémoire de poisson rouge"
        },
        {
            id: "E006",
            expression: "Être dans la lune"
        },
        {
            id: "E007",
            expression: "Mettre les pieds dans le plat"
        },
        {
            id: "E008",
            expression: "Coûter les yeux de la tête"
        },
        {
            id: "E009",
            expression: "Casser les pieds"
        },
        {
            id: "E010",
            expression: "Avoir un poil dans la main"
        }
    ],


    /* ========================================================
       MIME
       ======================================================== */

    MIME: [
        {
            id: "MI001",
            action: "Faire semblant de conduire une voiture"
        },
        {
            id: "MI002",
            action: "Faire semblant de cuisiner"
        },
        {
            id: "MI003",
            action: "Faire semblant d'être au téléphone"
        },
        {
            id: "MI004",
            action: "Faire semblant de gagner à la loterie"
        },
        {
            id: "MI005",
            action: "Faire semblant d'avoir peur d'une araignée"
        },
        {
            id: "MI006",
            action: "Faire semblant d'être un serveur"
        },
        {
            id: "MI007",
            action: "Faire semblant de rater son avion"
        },
        {
            id: "MI008",
            action: "Faire semblant d'être une célébrité"
        }
    ],


    /* ========================================================
       IMPRO
       ======================================================== */

    IMPRO: [
        {
            id: "I001",
            prompt: "Tu es un agent secret qui vient de perdre son identité."
        },
        {
            id: "I002",
            prompt: "Tu es un vendeur qui essaie de vendre un objet complètement inutile."
        },
        {
            id: "I003",
            prompt: "Tu es un professeur qui doit expliquer quelque chose qu'il ne comprend pas."
        },
        {
            id: "I004",
            prompt: "Tu es une célébrité qui essaie de passer incognito."
        },
        {
            id: "I005",
            prompt: "Tu es un client furieux qui réclame quelque chose d'impossible."
        },
        {
            id: "I006",
            prompt: "Tu dois convaincre le groupe que tu viens du futur."
        }
    ],


    /* ========================================================
       DUOS
       ======================================================== */

    DUO: [
        {
            id: "D001",
            prompt: "À deux, inventez une entreprise complètement inutile."
        },
        {
            id: "D002",
            prompt: "À deux, jouez une dispute pour une raison ridicule."
        },
        {
            id: "D003",
            prompt: "À deux, inventez votre propre émission de télévision."
        },
        {
            id: "D004",
            prompt: "À deux, faites croire au groupe que vous êtes meilleurs amis depuis 20 ans."
        },
        {
            id: "D005",
            prompt: "À deux, inventez une théorie du complot absurde."
        },
        {
            id: "D006",
            prompt: "À deux, essayez de vendre un objet présent dans la pièce comme s'il valait une fortune."
        }
    ],


    /* ========================================================
       MISSIONS SECRÈTES
       ======================================================== */

    MISSION: [
        {
            id: "MS001",
            mission: "Fais dire le mot « voiture » à quelqu'un sans lui demander directement."
        },
        {
            id: "MS002",
            mission: "Fais rire une personne précise sans lui dire pourquoi."
        },
        {
            id: "MS003",
            mission: "Obtiens un compliment de quelqu'un."
        },
        {
            id: "MS004",
            mission: "Fais changer quelqu'un de place naturellement."
        },
        {
            id: "MS005",
            mission: "Fais prononcer ton prénom à quelqu'un."
        },
        {
            id: "MS006",
            mission: "Convaincs quelqu'un que tu as oublié quelque chose d'important."
        }
    ],


    /* ========================================================
       RÈGLES SECRÈTES
       ======================================================== */

    SECRET_RULE: [
        {
            id: "R001",
            rule: "Pendant les deux prochains tours, la personne ciblée doit terminer chaque phrase par « chef »."
        },
        {
            id: "R002",
            rule: "Pendant les trois prochains tours, personne ne doit prononcer le prénom de la personne ciblée."
        },
        {
            id: "R003",
            rule: "La prochaine personne qui croise les bras reçoit une pénalité."
        },
        {
            id: "R004",
            rule: "La prochaine personne qui regarde son téléphone reçoit une pénalité."
        },
        {
            id: "R005",
            rule: "Pendant deux tours, toute personne qui dit « oui » doit recommencer sa phrase."
        }
    ]

};


/* ============================================================
   HELPERS
   ============================================================ */

function getQuestionPool(type) {
    return QUESTIONS[type] || [];
}


function getRandomQuestion(type) {
    const pool = getQuestionPool(type);

    if (!pool.length) {
        return null;
    }

    return pool[
        Math.floor(Math.random() * pool.length)
    ];
}
