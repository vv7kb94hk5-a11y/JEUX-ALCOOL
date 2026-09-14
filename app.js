<!DOCTYPE html>
<html lang="fr">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
  >

  <meta
    name="theme-color"
    content="#09090D"
  >

  <meta
    name="apple-mobile-web-app-capable"
    content="yes"
  >

  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  >

  <meta
    name="mobile-web-app-capable"
    content="yes"
  >

  <title>SOIRÉE — Party Game</title>

  <!-- BUILD 08.3 -->
  <link
    rel="stylesheet"
    href="style.css?v=8.3"
  >

</head>


<body>

  <main
    id="app"
    aria-live="polite"
  ></main>


  <!-- ========================================================
       ORDRE DE CHARGEMENT IMPORTANT
       ========================================================

       1. config
       2. questions
       3. gameFlow
          → définit GAME_TYPES, FLOW_PHASES, etc.
       4. games
          → utilise les constantes du gameFlow
       5. app
          → utilise absolument tout le système
  -->


  <script src="config.js?v=8.3"></script>

  <script src="questions.js?v=8.3"></script>

  <script src="gameFlow.js?v=8.3"></script>

  <script src="games.js?v=8.3"></script>

  <script src="app.js?v=8.3"></script>


</body>

</html>
