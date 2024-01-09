// Récupérer le canevas et son contexte
const	canvas = document.getElementById("pongCanvas");
const	ctx = canvas.getContext("2d");

// Class
class Paddle {
  constructor(PosX, PosY, Color, Player) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.Color = Color;
    this.Player = Player;
    this.Height = 80;
  }
};

// Initialiser les positions et vitesses des raquettes et de la balle
let	paddleHeight = 80;
let	paddleWidth = 10;
let	paddle1 = new Paddle(0, (canvas.height - paddleHeight) / 2, "#090", false);
let	paddle2 = new Paddle(canvas.width - paddleWidth, (canvas.height - paddleHeight) / 2, "#900", false);
let	paddle3 = new Paddle(150, (canvas.height - paddleHeight)  / 2, "#090", false);
let	paddle4 = new Paddle(canvas.width - paddleWidth - 150, (canvas.height - paddleHeight)  / 2, "#900", false);
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
			if (ballX < map_paddles.get(i).PosX)
				ballSpeedX = -5;
			else if (ballX > map_paddles.get(i).PosX)
				ballSpeedX = 5;
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
		{
			scoreR++;
			if (scoreR <= 10 && scoreR != 0)
				document.getElementById("scoreRight" + scoreR).style.backgroundColor = "red";
			console.log("scoreRight" + scoreR);
		}
		else
		{
			scoreL++;
			if (scoreR <= 10 && scoreR != 0)
				document.getElementById("scoreLeft" + scoreL).style.backgroundColor = "green";
			console.log("scoreLeft" + scoreL);
		}
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
	SelectAI(paddle3, 1);
	SelectAI(paddle4, 2);
	SelectAI(paddle2, 3);
	SelectAI(paddle1, 1);
	
}

function drawEnv()
{
	let space = 4;
	let height = 4;
	let width = 2;
	let color = "#000";
	let radius = 100;
	let angle = 0.04;
	
	//draw middle circle
	for (let i = 0; i < Math.PI * 2; i += Math.PI * angle)
	{
		ctx.beginPath();
		ctx.arc(canvas.width / 2, canvas.height / 2, radius, i + angle / 2, i + angle / 2 + Math.PI * angle / 2);
		ctx.fillStyle = "black";
		ctx.stroke();
		ctx.closePath();
	}

	//draw middle line
	for (let i = 0; i < canvas.height / (space + height); i++)
	{
		ctx.fillStyle = color;
		ctx.fillRect(canvas.width / 2 - width / 2, i * (space + height) + height / 2, width, height);
	}
}

// Fonction pour dessiner les éléments du jeu
function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawEnv();
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
	for (let i = 0; i < map_paddles.size; i++)
	{
		if (map_paddles.get(i).Player)
			updateManualPlayer(map_paddles.get(i));
	}
}

// Lancer la boucle de jeu
gameLoop();
