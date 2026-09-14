/* ============================================================
   SOIRÉE — GAME FLOW ENGINE
   BUILD 08.4
   ============================================================

   NOUVELLE PHILOSOPHIE
   --------------------

   Un flow décrit une EXPERIENCE,
   pas une succession artificielle d'écrans.

   PRINCIPES :

   SECRET
   PASSAGE → SECRET/ACTION → RÉSOLUTION

   VOTE
   QUESTION → VOTE → RÉSOLUTION

   RAPIDITÉ
   DÉFI → RÉSOLUTION

   GROUPE
   QUESTION → ACTION → RÉSOLUTION

   Une phase = une véritable action utilisateur.
   ============================================================ */


/* ============================================================
   TYPES DE JEUX
   ============================================================ */

const GAME_TYPES = {

  INDIVIDUAL: "INDIVIDUAL",

  GROUP_VOTE: "GROUP_VOTE",

  SECRET_VOTE: "SECRET_VOTE",

  SECRET: "SECRET",

  RAPID: "RAPID",

  BLUFF: "BLUFF",

  GROUP: "GROUP"
};


/* ============================================================
   RÔLES
   ============================================================ */

const ACTOR_MODES = {

  NONE: "NONE",

  RANDOM: "RANDOM",

  SELECTED: "SELECTED",

  TARGET: "TARGET"
};


const TARGET_MODES = {

  NONE: "NONE",

  ONE: "ONE",

  TWO: "TWO",

  ALL: "ALL"
};


/* ============================================================
   VOTES
   ============================================================ */

const VOTE_MODES = {

  NONE: "NONE",

  GROUP_CONFIRM: "GROUP_CONFIRM",

  SECRET: "SECRET"
};


/* ============================================================
   CONSÉQUENCES
   ============================================================ */

const PENALTIES = {

  NONE: "NONE",

  LOSER: "LOSER",

  WINNER: "WINNER",

  TARGET: "TARGET"
};


/* ============================================================
   NOUVEAUX FLOWS
   ============================================================ */

const FLOW_PHASES = {

  /*
    Présentation extrêmement courte.
    Elle n'est utilisée que lorsqu'elle apporte
    réellement quelque chose.
  */
  INTRO: "INTRO",

  /*
    Choix manuel d'une personne.
  */
  SELECT_TARGET: "SELECT_TARGET",

  /*
    Choix de plusieurs personnes.
  */
  SELECT_PLAYERS: "SELECT_PLAYERS",

  /*
    Écran de passage du téléphone.
  */
  PASS_SECRET: "PASS_SECRET",

  /*
    Écran privé combinant :
    - secret
    - consigne
    - action à effectuer

    IMPORTANT :
    SECRET_REVEAL et PLAY ont été fusionnés.
  */
  SECRET_ACTION: "SECRET_ACTION",

  /*
    Action publique.
  */
  ACTION: "ACTION",

  /*
    Vote.
  */
  VOTE: "VOTE",

  /*
    Résolution.
    Le résultat réel est déterminé ici.
  */
  RESOLVE: "RESOLVE",

  /*
    Question de réussite / échec.
    Exemple :
    "Tu as réussi ? OUI / NON"
  */
  SUCCESS_CHECK: "SUCCESS_CHECK",

  /*
    Conséquence.
  */
  PENALTY: "PENALTY"
};


/* ============================================================
   ÉTAT GLOBAL
   ============================================================ */

const GAME_FLOW = {

  currentGame: null,

  phase: null,

  phaseIndex: 0,

  actor: null,

  target: null,

  participants: [],

  voters: [],

  secretOwner: null,

  secretContent: null,

  winner: null,

  loser: null,

  votes: [],

  result: null,

  success: null,

  startedAt: null,

  phaseStartedAt: null
};


/* ============================================================
   RESET
   ============================================================ */

function resetGameFlow() {

  GAME_FLOW.currentGame = null;

  GAME_FLOW.phase = null;

  GAME_FLOW.phaseIndex = 0;

  GAME_FLOW.actor = null;

  GAME_FLOW.target = null;

  GAME_FLOW.participants = [];

  GAME_FLOW.voters = [];

  GAME_FLOW.secretOwner = null;

  GAME_FLOW.secretContent = null;

  GAME_FLOW.winner = null;

  GAME_FLOW.loser = null;

  GAME_FLOW.votes = [];

  GAME_FLOW.result = null;

  GAME_FLOW.success = null;

  GAME_FLOW.startedAt = null;

  GAME_FLOW.phaseStartedAt = null;
}


/* ============================================================
   DÉMARRAGE
   ============================================================ */

function startGameFlow(game) {

  resetGameFlow();

  if (!game) {
    return null;
  }

  GAME_FLOW.currentGame = game;

  GAME_FLOW.startedAt = Date.now();

  const flow =
    Array.isArray(game.flow)
      ? game.flow
      : [];

  if (!flow.length) {

    GAME_FLOW.phase = null;

    return null;
  }

  GAME_FLOW.phaseIndex = 0;

  GAME_FLOW.phase = flow[0];

  GAME_FLOW.phaseStartedAt = Date.now();

  return GAME_FLOW.phase;
}


/* ============================================================
   LECTURE
   ============================================================ */

function getCurrentGamePhase() {

  return GAME_FLOW.phase;
}


function getGameFlowIndex() {

  return GAME_FLOW.phaseIndex;
}


function getGameFlow() {

  return GAME_FLOW;
}


function hasGamePhase(phase) {

  return Boolean(
    GAME_FLOW.currentGame &&
    Array.isArray(GAME_FLOW.currentGame.flow) &&
    GAME_FLOW.currentGame.flow.includes(phase)
  );
}


/* ============================================================
   TRANSITION
   ============================================================ */

function nextGamePhase() {

  if (!GAME_FLOW.currentGame) {
    return null;
  }

  const flow =
    GAME_FLOW.currentGame.flow || [];

  const nextIndex =
    GAME_FLOW.phaseIndex + 1;

  if (nextIndex >= flow.length) {

    GAME_FLOW.phase = null;

    return null;
  }

  GAME_FLOW.phaseIndex =
    nextIndex;

  GAME_FLOW.phase =
    flow[nextIndex];

  GAME_FLOW.phaseStartedAt =
    Date.now();

  return GAME_FLOW.phase;
}


function goToGamePhase(phase) {

  if (!GAME_FLOW.currentGame) {
    return false;
  }

  const flow =
    GAME_FLOW.currentGame.flow || [];

  const index =
    flow.indexOf(phase);

  if (index === -1) {
    return false;
  }

  GAME_FLOW.phaseIndex = index;

  GAME_FLOW.phase = phase;

  GAME_FLOW.phaseStartedAt =
    Date.now();

  return true;
}


/* ============================================================
   RÔLES
   ============================================================ */

function setGameActor(player) {

  GAME_FLOW.actor =
    player || null;

  return GAME_FLOW.actor;
}


function setGameTarget(player) {

  GAME_FLOW.target =
    player || null;

  return GAME_FLOW.target;
}


function setParticipants(players) {

  GAME_FLOW.participants =
    Array.isArray(players)
      ? [...players]
      : [];

  return GAME_FLOW.participants;
}


function setVoters(players) {

  GAME_FLOW.voters =
    Array.isArray(players)
      ? [...players]
      : [];

  return GAME_FLOW.voters;
}


/* ============================================================
   SECRET
   ============================================================ */

function setSecretOwner(player) {

  GAME_FLOW.secretOwner =
    player || null;

  return GAME_FLOW.secretOwner;
}


function setSecretContent(content) {

  GAME_FLOW.secretContent =
    content ?? null;

  return GAME_FLOW.secretContent;
}


/* ============================================================
   RÉSULTAT
   ============================================================ */

function setGameWinner(player) {

  GAME_FLOW.winner =
    player || null;

  return GAME_FLOW.winner;
}


function setGameLoser(player) {

  GAME_FLOW.loser =
    player || null;

  return GAME_FLOW.loser;
}


function setGameResult(result) {

  GAME_FLOW.result =
    result ?? null;

  return GAME_FLOW.result;
}


function setGameSuccess(value) {

  GAME_FLOW.success =
    Boolean(value);

  return GAME_FLOW.success;
}


/* ============================================================
   VOTES
   ============================================================ */

function resetGameVotes() {

  GAME_FLOW.votes = [];

  return GAME_FLOW.votes;
}


function addGameVote(voter, choice) {

  if (!voter || !choice) {
    return false;
  }

  GAME_FLOW.votes.push({

    voter,

    choice,

    timestamp: Date.now()

  });

  return true;
}


function getGameVotes() {

  return [...GAME_FLOW.votes];
}


function getVoteCount() {

  return GAME_FLOW.votes.length;
}


function hasVoted(player) {

  return GAME_FLOW.votes.some(
    vote => vote.voter === player
  );
}


/* ============================================================
   COMPTAGE
   ============================================================ */

function countGameVotes() {

  const counts = {};

  GAME_FLOW.votes.forEach(vote => {

    if (!counts[vote.choice]) {

      counts[vote.choice] = 0;
    }

    counts[vote.choice]++;
  });

  return counts;
}


function getVoteWinner() {

  const counts =
    countGameVotes();

  const entries =
    Object.entries(counts);

  if (!entries.length) {
    return null;
  }

  const highest =
    Math.max(
      ...entries.map(
        entry => entry[1]
      )
    );

  /*
    Plusieurs personnes peuvent être
    à égalité.
  */

  const winners =
    entries
      .filter(
        entry => entry[1] === highest
      )
      .map(
        entry => entry[0]
      );

  return {

    players: winners,

    votes: highest,

    counts

  };
}


/* ============================================================
   RÉSOLUTION
   ============================================================ */

function resolveGame() {

  const game =
    GAME_FLOW.currentGame;

  if (!game) {
    return null;
  }


  /* ----------------------------------------------------------
     VOTE
     ---------------------------------------------------------- */

  if (
    game.voteMode === VOTE_MODES.GROUP_CONFIRM ||
    game.voteMode === VOTE_MODES.SECRET
  ) {

    const voteResult =
      getVoteWinner();

    if (voteResult) {

      /*
        En cas d'égalité, le jeu ne prétend pas
        qu'une personne a gagné seule.
      */

      if (
        voteResult.players.length === 1
      ) {

        const player =
          voteResult.players[0];

        setGameLoser(player);

        setGameResult({

          type: "VOTE",

          loser: player,

          votes: voteResult.votes,

          counts: voteResult.counts

        });

      } else {

        setGameResult({

          type: "VOTE_TIE",

          players:
            voteResult.players,

          votes:
            voteResult.votes,

          counts:
            voteResult.counts

        });
      }

      return GAME_FLOW.result;
    }
  }


  /* ----------------------------------------------------------
     RÉUSSITE / ÉCHEC
     ---------------------------------------------------------- */

  if (
    GAME_FLOW.success !== null
  ) {

    const player =
      GAME_FLOW.actor ||
      GAME_FLOW.target;

    if (GAME_FLOW.success) {

      setGameWinner(player);

    } else {

      setGameLoser(player);
    }

    setGameResult({

      type: "SUCCESS_CHECK",

      success:
        GAME_FLOW.success,

      player

    });

    return GAME_FLOW.result;
  }


  /* ----------------------------------------------------------
     CIBLE
     ---------------------------------------------------------- */

  if (GAME_FLOW.target) {

    setGameResult({

      type: "TARGET",

      target:
        GAME_FLOW.target

    });

    return GAME_FLOW.result;
  }


  /* ----------------------------------------------------------
     ACTION INDIVIDUELLE
     ---------------------------------------------------------- */

  if (GAME_FLOW.actor) {

    setGameResult({

      type: "ACTOR",

      actor:
        GAME_FLOW.actor

    });

    return GAME_FLOW.result;
  }


  /* ----------------------------------------------------------
     GROUPE
     ---------------------------------------------------------- */

  setGameResult({

    type: "GROUP"

  });

  return GAME_FLOW.result;
}


/* ============================================================
   PHASE PRIVÉE
   ============================================================ */

function isPrivatePhase(
  phase = GAME_FLOW.phase
) {

  return (
    phase === FLOW_PHASES.PASS_SECRET ||
    phase === FLOW_PHASES.SECRET_ACTION
  );
}


/* ============================================================
   VALIDATION
   ============================================================ */

function validateGameDefinition(game) {

  const errors = [];

  if (!game) {

    errors.push(
      "Jeu inexistant."
    );

    return errors;
  }


  if (!game.id) {

    errors.push(
      "ID manquant."
    );
  }


  if (!game.name) {

    errors.push(
      "Nom manquant."
    );
  }


  if (!game.type) {

    errors.push(
      "Type de jeu manquant."
    );
  }


  if (
    !Array.isArray(game.flow) ||
    !game.flow.length
  ) {

    errors.push(
      "Flow manquant."
    );
  }


  /* ----------------------------------------------------------
     SECRET
     ---------------------------------------------------------- */

  if (game.phone === true) {

    if (
      !game.flow?.includes(
        FLOW_PHASES.PASS_SECRET
      )
    ) {

      errors.push(
        "Jeu téléphone sans PASS_SECRET."
      );
    }


    if (
      !game.flow?.includes(
        FLOW_PHASES.SECRET_ACTION
      )
    ) {

      errors.push(
        "Jeu téléphone sans SECRET_ACTION."
      );
    }
  }


  /* ----------------------------------------------------------
     VOTE
     ---------------------------------------------------------- */

  if (
    game.flow?.includes(
      FLOW_PHASES.VOTE
    )
  ) {

    if (
      game.voteMode ===
      VOTE_MODES.NONE
    ) {

      errors.push(
        "Phase VOTE sans système de vote."
      );
    }
  }


  /* ----------------------------------------------------------
     PENALTY
     ---------------------------------------------------------- */

  if (
    game.flow?.includes(
      FLOW_PHASES.PENALTY
    )
  ) {

    if (
      !game.penalty ||
      game.penalty ===
      PENALTIES.NONE
    ) {

      errors.push(
        "Phase PENALTY sans pénalité."
      );
    }
  }


  /* ----------------------------------------------------------
     SECRET = PAS D'INTRO PUBLIQUE INUTILE
     ---------------------------------------------------------- */

  if (
    game.type === GAME_TYPES.SECRET &&
    game.phone === true &&
    game.flow?.includes(
      FLOW_PHASES.INTRO
    )
  ) {

    errors.push(
      "Un jeu secret ne doit pas avoir une INTRO séparée inutile."
    );
  }


  /* ----------------------------------------------------------
     ANCIENNES PHASES INTERDITES
     ---------------------------------------------------------- */

  if (
    game.flow?.includes(
      "RETURN_PHONE"
    )
  ) {

    errors.push(
      "RETURN_PHONE est supprimé."
    );
  }


  if (
    game.flow?.includes(
      "SECRET_REVEAL"
    )
  ) {

    errors.push(
      "SECRET_REVEAL est supprimé : utiliser SECRET_ACTION."
    );
  }


  if (
    game.flow?.includes(
      "PLAY"
    )
  ) {

    errors.push(
      "PLAY est supprimé : utiliser ACTION ou SECRET_ACTION."
    );
  }


  if (
    game.flow?.includes(
      "RESULT"
    )
  ) {

    errors.push(
      "RESULT est supprimé : utiliser RESOLVE."
    );
  }


  if (
    game.flow?.includes(
      "NEXT"
    )
  ) {

    errors.push(
      "NEXT est supprimé : transition automatique."
    );
  }


  return errors;
}


/* ============================================================
   VALIDATION DE LA BASE
   ============================================================ */

function validateAllGames(games) {

  if (!Array.isArray(games)) {

    return [{

      game: "DATABASE",

      errors: [
        "Liste des jeux invalide."
      ]

    }];
  }


  return games

    .map(game => ({

      game:
        game.id ||
        game.name,

      errors:
        validateGameDefinition(game)

    }))

    .filter(
      item =>
        item.errors.length > 0
    );
}


/* ============================================================
   NETTOYAGE
   ============================================================ */

function clearGameResult() {

  GAME_FLOW.winner = null;

  GAME_FLOW.loser = null;

  GAME_FLOW.result = null;

  GAME_FLOW.success = null;
}


function clearGameRoles() {

  GAME_FLOW.actor = null;

  GAME_FLOW.target = null;

  GAME_FLOW.participants = [];

  GAME_FLOW.voters = [];

  GAME_FLOW.secretOwner = null;

  GAME_FLOW.secretContent = null;
}


/* ============================================================
   DEBUG
   ============================================================ */

function debugGameFlow() {

  return {

    game:
      GAME_FLOW.currentGame?.id ||
      null,

    phase:
      GAME_FLOW.phase,

    phaseIndex:
      GAME_FLOW.phaseIndex,

    actor:
      GAME_FLOW.actor,

    target:
      GAME_FLOW.target,

    participants:
      GAME_FLOW.participants,

    secretOwner:
      GAME_FLOW.secretOwner,

    winner:
      GAME_FLOW.winner,

    loser:
      GAME_FLOW.loser,

    success:
      GAME_FLOW.success,

    votes:
      GAME_FLOW.votes,

    result:
      GAME_FLOW.result

  };
}
