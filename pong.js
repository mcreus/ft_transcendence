// Récupérer le canevas et son contexte
const	canvas = document.getElementById("pongCanvas");
const	ctx = canvas.getContext("2d");

// Class
class Paddle {
  constructor(PosX, PosY, Color) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.Color = Color;
  }
};

// Initialiser les positions et vitesses des raquettes et de la balle
let	paddleHeight = 80;
let	paddleWidth = 10;
let	paddle1 = new Paddle(0, (canvas.height - paddleHeight) / 2, "#090");
let	paddle2 = new Paddle(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2, "#900");
let	paddle3 = new Paddle(150, (canvas.height - paddleHeight)  / 2, "#090");
let	paddle4 = new Paddle(canvas.width - paddleWidth - 150, (canvas.height - paddleHeight)  / 2, "#900");
let	ballX = canvas.width / 2;
let	ballY = canvas.height / 2;
let	ballSpeedX = 5;
let	ballSpeedY = 5;
let	ballRadius = 10;
let	ballSpeedXMax = 5;
let	ballSpeedYMax = 5;
let	multy = false;
let	rand = Math.random() * (paddleHeight + 20) - ((paddleHeight + 20) / 2);
let	PosAI3;
let	dirAI1 = 5;
let	scoreL = 0;
let	scoreR = 0;
const	divLeft = document.getElementById('scoreLeft');
const	divRight = document.getElementById('scoreRight');

// Initialiser une map contenant tous les paddle
const	map_paddles = new Map();
map_paddles.set(0, paddle1);
map_paddles.set(1, paddle2);
if (multy)
{
	map_paddles.set(2, paddle3);
	map_paddles.set(3, paddle4);
}

// Gérer les mouvements de la raquette avec la souris
function handleMouse(event) {
	let	mouseY = event.clientY - canvas.getBoundingClientRect().top;
	paddle1.PosY = mouseY - paddleHeight / 2;
}

// Fonction principale du jeu
function updateGame() {
	// Déplacer la balle
	ballX += ballSpeedX;
	ballY += ballSpeedY;
	PosAI3 = ballY + rand;

	// Rebondir sur les bords verticaux
	if (ballY < 0 + ballRadius || ballY > canvas.height - ballRadius)
		ballSpeedY = -ballSpeedY;

	// Rebondir sur toutes les raquettes
	for (let i = 0; i < map_paddles.size; i++)
	{
		if ((ballX > map_paddles.get(i).PosX - ballRadius && ballX < map_paddles.get(i).PosX + paddleWidth + ballRadius) && 
			(ballY > map_paddles.get(i).PosY - ballRadius && ballY < map_paddles.get(i).PosY + paddleHeight + ballRadius))
		{
			ballSpeedX = -ballSpeedX;
			ballSpeedY = -(map_paddles.get(i).PosY + paddleHeight / 2 - ballY) / 8;
			rand = Math.random() * (paddleHeight + 20) - ((paddleHeight + 20) / 2);
			console.log(rand);
		}
	}
	if (ballSpeedY > ballSpeedYMax)
		ballSpeedY = ballSpeedYMax;
	else if (ballSpeedY < -ballSpeedYMax)
		ballSpeedY = -ballSpeedYMax;

	// Si la balle atteint l'extrémité gauche ou droite, réinitialiser sa position
	if (ballX < 0 + ballRadius || ballX > canvas.width - ballRadius) {
		if (ballX < 0 + ballRadius)
			scoreR++;
		else
			scoreL++;
		ballX = canvas.width / 2;
		ballY = canvas.height / 2;
		ballSpeedX = -ballSpeedX;
		divLeft.textContent = scoreL;
		divRight.textContent = scoreR;
		rand = Math.random() * (paddleHeight + 20) - ((paddleHeight + 20) / 2);
	}
	// Securite pour que la balle ne rentre pas dans les murs
	if (ballY - ballRadius < 0)
		ballY = ballRadius;
	else if (ballY + ballRadius > canvas.height)
		ballY = canvas.height - ballRadius;
	AIlvl1(paddle3);
	AIlvl2(paddle4);
	AIlvl3(paddle2);
	AIlvlCheat(paddle1);
	
}

// Fonction pour dessiner les éléments du jeu
function drawGame() {
	// Effacer le canevas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Dessiner toutes les raquettes
	for (let i = 0; i < map_paddles.size; i++)
	{
		ctx.fillStyle = map_paddles.get(i).Color;
		ctx.fillRect(map_paddles.get(i).PosX, map_paddles.get(i).PosY, paddleWidth, paddleHeight);
	}

	// Dessiner la balle
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
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

function AIlvl1(AI)
{
	if (AI.PosY + dirAI1 < 0 || AI.PosY + paddleHeight + dirAI1 > canvas.height)
		dirAI1 = -dirAI1;
	AI.PosY += dirAI1;
}

function AIlvl3(AI)
{
	if (PosAI3 - ballRadius < AI.PosY + paddleHeight / 2 && AI.PosY + paddleHeight / 2 < PosAI3 + ballRadius)
		return ;
	if (AI.PosY + paddleHeight / 2 < PosAI3 + ballRadius)
		AI.PosY += 5;
	else if (AI.PosY + paddleHeight / 2 > PosAI3 - ballRadius)
		AI.PosY -= 5;
}

function AIlvlCheat(AI)
{
	AI.PosY = ballY - paddleHeight / 2;
}

function AIlvl2(AI)
{
	//if (
	let paddleCenter = AI.PosY + paddleHeight / 2;
	if (paddleCenter < ballY - paddleHeight / 2)
		AI.PosY += 3;
	else if (paddleCenter > ballY + paddleHeight / 2)
		AI.PosY -= 3;
}

// Écouter les mouvements de la souris
canvas.addEventListener("mousemove", handleMouse);

// Lancer la boucle de jeu
gameLoop();
