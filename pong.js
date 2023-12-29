// Récupérer le canevas et son contexte
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Initialiser les positions et vitesses des raquettes et de la balle
let paddleHeight = 80;
let paddleWidth = 10;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Gérer les mouvements de la raquette avec la souris
function handleMouse(event) {
  let mouseY = event.clientY - canvas.getBoundingClientRect().top;
  paddle1Y = mouseY - paddleHeight / 2;
}

// Fonction principale du jeu
function updateGame() {
  // Déplacer la balle
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Rebondir sur les bords verticaux
  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Rebondir sur la raquette gauche
  if (
    ballX < paddleWidth &&
    ballY > paddle1Y &&
    ballY < paddle1Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Rebondir sur la raquette droite
  if (
    ballX > canvas.width - paddleWidth &&
    ballY > paddle2Y &&
    ballY < paddle2Y + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Si la balle atteint l'extrémité gauche ou droite, réinitialiser sa position
  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }

  // Déplacer la raquette droite en suivant la balle
  let paddle2YCenter = paddle2Y + paddleHeight / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 5;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 5;
  }
}

// Fonction pour dessiner les éléments du jeu
function drawGame() {
  // Effacer le canevas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner la raquette gauche
  ctx.fillStyle = "#000";
  ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

  // Dessiner la raquette droite
  ctx.fillStyle = "#000";
  ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

  // Dessiner la balle
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.closePath();
}

// Fonction principale de mise à jour et de dessin du jeu
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Écouter les mouvements de la souris
canvas.addEventListener("mousemove", handleMouse);

// Lancer la boucle de jeu
gameLoop();
