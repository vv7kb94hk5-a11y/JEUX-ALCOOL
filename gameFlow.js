/* ============================================================
   SOIRÉE — GAME FLOW ENGINE
   BUILD 08.7
   ============================================================

   PHILOSOPHIE

   Le moteur décrit le déroulement logique d'un jeu.

   JEU PUBLIC
   ACTION → VOTE → RESOLVE

   JEU PUBLIC
   ACTION → SUCCESS_CHECK

   JEU SECRET
   PASS_SECRET → SECRET_ACTION → SUCCESS_CHECK

   MISSION SECRÈTE
   PASS_SECRET → SECRET_ACTION

   IMPORTANT

   Les phases techniques suivantes sont conservées
   uniquement pour compatibilité avec d'anciennes données,
   mais ne doivent plus être utilisées dans les nouveaux jeux :

   INTRO
   SELECT_TARGET
   SELECT_PLAYERS
   PENALTY
   RETURN_PHONE
   RESULT
   NEXT
   PLAY

   Elles ne sont jamais censées devenir des écrans.
   ============================================================ */


/* ============================================================
   TYPES DE JEUX
   ============================================================ */

const GAME_TYPES = {

  INDIVIDUAL:
    "INDIVIDUAL",

  GROUP_VOTE:
    "GROUP_VOTE",

  SECRET_VOTE:
    "SECRET_VOTE",

  SECRET:
    "SECRET",

  RAPID:
    "RAPID",

  BLUFF:
    "BLUFF",

  GROUP:
    "GROUP"

};


/* ============================================================
   ACTEUR
   ============================================================ */

const ACTOR_MODES = {

  NONE:
    "NONE",

  RANDOM:
    "RANDOM",

  SELECTED:
    "SELECTED",

  TARGET:
    "TARGET"

};


/* ============================================================
   CIBLE
   ============================================================ */

const TARGET_MODES = {

  NONE:
    "NONE",

  ONE:
    "ONE",

  TWO:
    "TWO",

  ALL:
    "ALL"

};


/* ============================================================
   VOTE
   ============================================================ */

const VOTE_MODES = {

  NONE:
    "NONE",

  GROUP_CONFIRM:
    "GROUP_CONFIRM",

  SECRET:
    "SECRET"

};


/* ============================================================
   CONSÉQUENCES
   ============================================================ */

const PENALTIES = {

  NONE:
    "NONE",

  LOSER:
    "LOSER",

  WINNER:
    "WINNER",

  TARGET:
    "TARGET"

};


/* ============================================================
   PHASES

   IMPORTANT :

   Les nouveaux jeux doivent utiliser uniquement :

   PASS_SECRET
   SECRET_ACTION
   ACTION
   VOTE
   RESOLVE
   SUCCESS_CHECK
   ============================================================ */

const FLOW_PHASES = {

  /* Compatibilité ancienne architecture */
  INTRO:
    "INTRO",

  SELECT_TARGET:
    "SELECT_TARGET",

  SELECT_PLAYERS:
    "SELECT_PLAYERS",

  /* Nouveau système */
  PASS_SECRET:
    "PASS_SECRET",

  SECRET_ACTION:
    "SECRET_ACTION",

  ACTION:
    "ACTION",

  VOTE:
    "VOTE",

  RESOLVE:
    "RESOLVE",

  SUCCESS_CHECK:
    "SUCCESS_CHECK",

  /* Compatibilité */
  PENALTY:
    "PENALTY"

};


/* ============================================================
   ANCIENNES PHASES TECHNIQUES
   ============================================================ */

const LEGACY_FLOW_PHASES = new Set([

  FLOW_PHASES.INTRO,

  FLOW_PHASES.SELECT_TARGET,

  FLOW_PHASES.SELECT_PLAYERS,

  FLOW_PHASES.PENALTY,

  "PASS_PHONE",

  "PRIVATE_REVEAL",

  "RETURN_PHONE",

  "SECRET_REVEAL",

  "PLAY",

  "RESULT",

  "NEXT"

]);


/* ============================================================
   ÉTAT GLOBAL
   ============================================================ */

const GAME_FLOW = {

  currentGame:
    null,

  phase:
    null,

  phaseIndex:
    0,

  actor:
    null,

  target:
    null,

  participants:
    [],

  voters:
    [],

  secretOwner:
    null,

  secretContent:
    null,

  winner:
    null,

  loser:
    null,

  votes:
    [],

  result:
    null,

  success:
    null,

  startedAt:
    null,

  phaseStartedAt:
    null

};


/* ============================================================
   RESET
   ============================================================ */

function resetGameFlow() {

  GAME_FLOW.currentGame =
    null;

  GAME_FLOW.phase =
    null;

  GAME_FLOW.phaseIndex =
    0;

  GAME_FLOW.actor =
    null;

  GAME_FLOW.target =
    null;

  GAME_FLOW.participants =
    [];

  GAME_FLOW.voters =
    [];

  GAME_FLOW.secretOwner =
    null;

  GAME_FLOW.secretContent =
    null;

  GAME_FLOW.winner =
    null;

  GAME_FLOW.loser =
    null;

  GAME_FLOW.votes =
    [];

  GAME_FLOW.result =
    null;

  GAME_FLOW.success =
    null;

  GAME_FLOW.startedAt =
    null;

  GAME_FLOW.phaseStartedAt =
    null;

}


/* ============================================================
   DÉMARRAGE
   ============================================================ */

function startGameFlow(game) {

  resetGameFlow();

  if (!game) {
    return null;
  }

  GAME_FLOW.currentGame =
    game;

  GAME_FLOW.startedAt =
    Date.now();


  const flow =
    normalizeGameFlow(
      game.flow
    );


  if (!flow.length) {

    GAME_FLOW.phase =
      null;

    return null;

  }


  GAME_FLOW.currentGame.flow =
    flow;

  GAME_FLOW.phaseIndex =
    0;

  GAME_FLOW.phase =
    flow[0];

  GAME_FLOW.phaseStartedAt =
    Date.now();


  return GAME_FLOW.phase;

}


/* ============================================================
   NORMALISATION DU FLOW
   ============================================================ */

function normalizeGameFlow(flow) {

  if (
    !Array.isArray(flow)
  ) {

    return [];

  }


  /*
    On retire définitivement les anciennes
    phases techniques.

    Cela empêche une ancienne définition de jeu
    de recréer un écran parasite.
  */

  return flow.filter(
    phase =>
      !LEGACY_FLOW_PHASES.has(
        phase
      )
  );

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


function getCurrentGame() {

  return GAME_FLOW.currentGame;

}


function hasGamePhase(phase) {

  return Boolean(

    GAME_FLOW.currentGame &&

    Array.isArray(
      GAME_FLOW.currentGame.flow
    ) &&

    GAME_FLOW.currentGame.flow.includes(
      phase
    )

  );

}


/* ============================================================
   TRANSITION
   ============================================================ */

function nextGamePhase() {

  if (
    !GAME_FLOW.currentGame
  ) {

    return null;

  }


  const flow =
    GAME_FLOW.currentGame.flow || [];


  let nextIndex =
    GAME_FLOW.phaseIndex + 1;


  /*
    Sécurité contre d'éventuelles anciennes phases.
  */

  while (
    nextIndex < flow.length &&
    LEGACY_FLOW_PHASES.has(
      flow[nextIndex]
    )
  ) {

    nextIndex++;

  }


  if (
    nextIndex >= flow.length
  ) {

    GAME_FLOW.phase =
      null;

    GAME_FLOW.phaseIndex =
      flow.length;

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


/* ============================================================
   ALLER À UNE PHASE
   ============================================================ */

function goToGamePhase(
  phase
) {

  if (
    !GAME_FLOW.currentGame
  ) {

    return false;

  }


  const flow =
    GAME_FLOW.currentGame.flow || [];


  const index =
    flow.indexOf(
      phase
    );


  if (
    index === -1
  ) {

    return false;

  }


  GAME_FLOW.phaseIndex =
    index;

  GAME_FLOW.phase =
    phase;

  GAME_FLOW.phaseStartedAt =
    Date.now();


  return true;

}


/* ============================================================
   RÔLES
   ============================================================ */

function setGameActor(
  player
) {

  GAME_FLOW.actor =
    player || null;

  return GAME_FLOW.actor;

}


function setGameTarget(
  player
) {

  GAME_FLOW.target =
    player || null;

  return GAME_FLOW.target;

}


function setParticipants(
  players
) {

  GAME_FLOW.participants =
    Array.isArray(players)
      ? [...players]
      : [];

  return GAME_FLOW.participants;

}


function setVoters(
  players
) {

  GAME_FLOW.voters =
    Array.isArray(players)
      ? [...players]
      : [];

  return GAME_FLOW.voters;

}


/* ============================================================
   SECRET
   ============================================================ */

function setSecretOwner(
  player
) {

  GAME_FLOW.secretOwner =
    player || null;

  return GAME_FLOW.secretOwner;

}


function setSecretContent(
  content
) {

  GAME_FLOW.secretContent =
    content ?? null;

  return GAME_FLOW.secretContent;

}


/* ============================================================
   RÉSULTATS
   ============================================================ */

function setGameWinner(
  player
) {

  GAME_FLOW.winner =
    player || null;

  return GAME_FLOW.winner;

}


function setGameLoser(
  player
) {

  GAME_FLOW.loser =
    player || null;

  return GAME_FLOW.loser;

}


function setGameResult(
  result
) {

  GAME_FLOW.result =
    result ?? null;

  return GAME_FLOW.result;

}


function setGameSuccess(
  value
) {

  GAME_FLOW.success =
    Boolean(value);

  return GAME_FLOW.success;

}


/* ============================================================
   VOTES
   ============================================================ */

function resetGameVotes() {

  GAME_FLOW.votes =
    [];

  return GAME_FLOW.votes;

}


function addGameVote(
  voter,
  choice
) {

  if (
    !voter ||
    !choice
  ) {

    return false;

  }


  /*
    Un joueur ne peut voter
    qu'une seule fois.
  */

  if (
    GAME_FLOW.votes.some(
      vote =>
        vote.voter === voter
    )
  ) {

    return false;

  }


  GAME_FLOW.votes.push({

    voter,

    choice,

    timestamp:
      Date.now()

  });


  return true;

}


function getGameVotes() {

  return [
    ...GAME_FLOW.votes
  ];

}


function getVoteCount() {

  return GAME_FLOW.votes.length;

}


function hasVoted(
  player
) {

  return GAME_FLOW.votes.some(
    vote =>
      vote.voter === player
  );

}


/* ============================================================
   COMPTAGE DES VOTES
   ============================================================ */

function countGameVotes() {

  const counts = {};


  GAME_FLOW.votes.forEach(
    vote => {

      if (
        !counts[vote.choice]
      ) {

        counts[vote.choice] =
          0;

      }

      counts[vote.choice]++;

    }
  );


  return counts;

}


function getVoteWinner() {

  const counts =
    countGameVotes();


  const entries =
    Object.entries(
      counts
    );


  if (
    !entries.length
  ) {

    return null;

  }


  const highest =
    Math.max(
      ...entries.map(
        entry =>
          entry[1]
      )
    );


  const winners =
    entries
      .filter(
        entry =>
          entry[1] ===
          highest
      )
      .map(
        entry =>
          entry[0]
      );


  return {

    players:
      winners,

    votes:
      highest,

    counts

  };

}


/* ============================================================
   RÉSOLUTION LOGIQUE
   ============================================================ */

function resolveGame() {

  const game =
    GAME_FLOW.currentGame;


  if (!game) {
    return null;
  }


  /*
    ------------------------------------------------------------
    VOTE
    ------------------------------------------------------------
  */

  if (
    game.voteMode ===
      VOTE_MODES.GROUP_CONFIRM ||

    game.voteMode ===
      VOTE_MODES.SECRET
  ) {

    const vote =
      getVoteWinner();


    if (!vote) {

      return null;

    }


    if (
      vote.players.length === 1
    ) {

      const loser =
        vote.players[0];


      GAME_FLOW.loser =
        loser;


      GAME_FLOW.result = {

        type:
          "VOTE",

        target:
          loser,

        votes:
          vote.votes,

        counts:
          vote.counts

      };

    } else {

      GAME_FLOW.result = {

        type:
          "VOTE_TIE",

        players:
          vote.players,

        votes:
          vote.votes,

        counts:
          vote.counts

      };

    }


    return GAME_FLOW.result;

  }


  /*
    ------------------------------------------------------------
    SUCCESS CHECK
    ------------------------------------------------------------
  */

  if (
    GAME_FLOW.success !==
    null
  ) {

    const player =
      GAME_FLOW.actor ||
      GAME_FLOW.target;


    if (
      GAME_FLOW.success
    ) {

      GAME_FLOW.winner =
        player;

    } else {

      GAME_FLOW.loser =
        player;

    }


    GAME_FLOW.result = {

      type:
        "SUCCESS_CHECK",

      success:
        GAME_FLOW.success,

      player

    };


    return GAME_FLOW.result;

  }


  /*
    ------------------------------------------------------------
    CIBLE
    ------------------------------------------------------------
  */

  if (
    GAME_FLOW.target
  ) {

    GAME_FLOW.result = {

      type:
        "TARGET",

      target:
        GAME_FLOW.target

    };


    return GAME_FLOW.result;

  }


  /*
    ------------------------------------------------------------
    ACTEUR
    ------------------------------------------------------------
  */

  if (
    GAME_FLOW.actor
  ) {

    GAME_FLOW.result = {

      type:
        "ACTOR",

      actor:
        GAME_FLOW.actor

    };


    return GAME_FLOW.result;

  }


  /*
    ------------------------------------------------------------
    GROUPE
    ------------------------------------------------------------
  */

  GAME_FLOW.result = {

    type:
      "GROUP"

  };


  return GAME_FLOW.result;

}


/* ============================================================
   PHASE PRIVÉE
   ============================================================ */

function isPrivatePhase(
  phase = GAME_FLOW.phase
) {

  return (

    phase ===
      FLOW_PHASES.PASS_SECRET ||

    phase ===
      FLOW_PHASES.SECRET_ACTION

  );

}


/* ============================================================
   PHASE VALIDE POUR L'INTERFACE
   ============================================================ */

function isPlayablePhase(
  phase
) {

  return (

    phase ===
      FLOW_PHASES.PASS_SECRET ||

    phase ===
      FLOW_PHASES.SECRET_ACTION ||

    phase ===
      FLOW_PHASES.ACTION ||

    phase ===
      FLOW_PHASES.VOTE ||

    phase ===
      FLOW_PHASES.RESOLVE ||

    phase ===
      FLOW_PHASES.SUCCESS_CHECK

  );

}


/* ============================================================
   VALIDATION DES JEUX
   ============================================================ */

function validateGameDefinition(
  game
) {

  const errors = [];


  if (!game) {

    return [
      "Jeu inexistant."
    ];

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
      "Type manquant."
    );

  }


  if (
    !Array.isArray(
      game.flow
    ) ||
    !game.flow.length
  ) {

    errors.push(
      "Flow manquant."
    );

    return errors;

  }


  /*
    Aucune nouvelle définition ne doit
    contenir une phase technique.
  */

  game.flow.forEach(
    phase => {

      if (
        LEGACY_FLOW_PHASES.has(
          phase
        )
      ) {

        errors.push(
          `Phase interdite : ${phase}`
        );

      }

    }
  );


  /*
    SECRET
  */

  if (
    game.phone === true
  ) {

    if (
      !game.flow.includes(
        FLOW_PHASES.PASS_SECRET
      )
    ) {

      errors.push(
        "Jeu téléphone sans PASS_SECRET."
      );

    }


    if (
      !game.flow.includes(
        FLOW_PHASES.SECRET_ACTION
      )
    ) {

      errors.push(
        "Jeu téléphone sans SECRET_ACTION."
      );

    }

  }


  /*
    VOTE
  */

  if (
    game.flow.includes(
      FLOW_PHASES.VOTE
    )
  ) {

    if (
      game.voteMode ===
      VOTE_MODES.NONE
    ) {

      errors.push(
        "Phase VOTE sans voteMode."
      );

    }

  }


  /*
    GROUP_VOTE
  */

  if (
    game.type ===
    GAME_TYPES.GROUP_VOTE
  ) {

    if (
      !game.flow.includes(
        FLOW_PHASES.VOTE
      )
    ) {

      errors.push(
        "GROUP_VOTE sans phase VOTE."
      );

    }

  }


  /*
    SUCCESS CHECK
  */

  if (
    game.flow.includes(
      FLOW_PHASES.SUCCESS_CHECK
    )
  ) {

    if (
      game.target ===
        TARGET_MODES.NONE &&

      game.actor ===
        ACTOR_MODES.NONE
    ) {

      errors.push(
        "SUCCESS_CHECK sans joueur concerné."
      );

    }

  }


  return errors;

}


/* ============================================================
   VALIDATION DE LA BASE
   ============================================================ */

function validateGamesDatabase() {

  if (
    typeof GAMES ===
      "undefined" ||

    !Array.isArray(GAMES)
  ) {

    return {

      valid:
        false,

      errors: [
        "GAMES est introuvable."
      ]

    };

  }


  const errors = [];


  const ids =
    new Set();


  GAMES.forEach(
    game => {

      if (
        ids.has(
          game.id
        )
      ) {

        errors.push(
          `${game.id} : ID dupliqué.`
        );

      }

      ids.add(
        game.id
      );


      const gameErrors =
        validateGameDefinition(
          game
        );


      gameErrors.forEach(
        error => {

          errors.push(
            `${game.id} — ${error}`
          );

        }
      );

    }
  );


  return {

    valid:
      errors.length === 0,

    count:
      GAMES.length,

    errors

  };

}


/* ============================================================
   DEBUG
   ============================================================ */

function debugGameFlow() {

  return {

    currentGame:
      GAME_FLOW.currentGame,

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

    votes:
      GAME_FLOW.votes,

    winner:
      GAME_FLOW.winner,

    loser:
      GAME_FLOW.loser,

    result:
      GAME_FLOW.result,

    success:
      GAME_FLOW.success

  };

}


/* ============================================================
   EXPORT DEBUG
   ============================================================ */

window.SOIRE_GAME_FLOW =
  GAME_FLOW;
