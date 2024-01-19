// Récupérer le canevas et son contexte
let	canvas;
let	ctx;

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

class Ball {
  constructor(PosX, PosY, Color, Radius, Speed) {
    this.PosX = PosX;
    this.PosY = PosY;
    this.Color = Color;
    this.Radius = Radius;
    this.ballSpeedX = 5;
    this.ballSpeedY = 5;
    this.speed = Speed;
    this.ballSpeedXMax = 5;
    this.ballSpeedYMax = 5;
  }
};

class GameManager {
  constructor() {
    this.map_paddles = new Map();
    this.map_balls = new Map();
    this.nb_balls = 0;
    this.nb_paddles = 0;
    this.scoreL = 0;
    this.scoreR = 0;
    this.paddleHeight = 80;
    this.paddleWidth = 10;
    this.ballRadius = 10;
    this.scoreWin = 25;
    this.time = 60 * 4.5;
  }
};
// Initialiser les positions et vitesses des raquettes et de la balle
let	multy = false;
let	PosAI3;
let	game = new GameManager();
let	rand = Math.random() * (game.paddleHeight + 20) - ((game.paddleHeight + 20) / 2);

// Initialiser une map contenant tous les paddle

function init()
{
	//Generate Page
	GenerateGame();
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	let	paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "#090", false);
	let	paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "#900", false);
	let	paddle3 = new Paddle(150, (canvas.height - game.paddleHeight)  / 2, "#090", false);
	let	paddle4 = new Paddle(canvas.width - game.paddleWidth - 150, (canvas.height - game.paddleHeight)  / 2, "#900", false);
	let	ball1 = new Ball(canvas.width / 2, canvas.height / 2, "#000", game.ballRadius, 1);
	
	//Paddles
	game.map_paddles.set(game.nb_paddles++, paddle1);
	game.map_paddles.set(game.nb_paddles++, paddle2);
	if (multy)
	{
		game.map_paddles.set(game.nb_paddles++, paddle3);
		game.map_paddles.set(game.nb_paddles++, paddle4);
	}
	
	//Balls
	game.map_balls.set(game.nb_balls++, ball1);
	
	// Lancer la boucle de jeu
	gameLoop();
	//Boucle toutes les secondes
	setInterval(updateBySec, 1000);
}

function updateBySec()
{
	game.time--;
	let	timer = document.getElementById("timer");
	let	minutes = game.time / 60;
	let	secondes = game.time % 60;
	if (game.time < 0)
	{
		timer.innerText = " + " + Math.floor(-minutes) + ":" + -secondes;
		if (Math.abs(secondes) < 10)
			timer.innerText = " + " + Math.floor(-minutes) + ":0" + -secondes;
	}
	else
	{
		timer.innerText = Math.floor(minutes) + ":" + secondes;
		if (secondes < 10)
			timer.innerText = Math.floor(minutes) + ":0" + secondes;
	}
}

// Fonction principale du jeu
function updateGame() {
	//Each balls
	for (let i = 0; i < game.map_balls.size; i++)
	{
		let ball = game.map_balls.get(i);
		ball.PosX += ball.ballSpeedX;
		ball.PosY += ball.ballSpeedY;
		PosAI3 = ball.PosY + rand;
		
		// Rebondir sur les bords verticaux
		if (ball.PosY < 0 + ball.Radius || ball.PosY > canvas.height - ball.Radius)
			ball.ballSpeedY = -ball.ballSpeedY;

		// Rebondir sur toutes les raquettes
		collisionPaddles(ball);
		// Si la balle atteint l'extrémité gauche ou droite, réinitialiser sa position
		goal(ball);
		
		// Securite pour que la balle ne rentre pas dans les murs
		if (ball.ballSpeedY > ball.ballSpeedYMax)
			ball.ballSpeedY = ball.ballSpeedYMax;
		else if (ball.ballSpeedY < -ball.ballSpeedYMax)
			ball.ballSpeedY = -ball.ballSpeedYMax;
		if (ball.PosY - ball.Radius < 0)
			ball.PosY = ball.Radius;
		else if (ball.PosY + ball.Radius > canvas.height)
			ball.PosY = canvas.height - ball.Radius;
	}
	SelectAI(game.map_paddles.get(0), 1);
	//updateManualPlayer(game.map_paddles.get(0));
	SelectAI(game.map_paddles.get(1), 1);
	if (multy)
	{
		SelectAI(game.map_paddles.get(2), 1);
		SelectAI(game.map_paddles.get(3), 1);
	}
	
}

// Fonction principale de mise à jour et de dessin du jeu
function gameLoop() {
	updateGame();
	drawGame();
	requestAnimationFrame(gameLoop);
	for (let i = 0; i < game.map_paddles.size; i++)
	{
		if (game.map_paddles.get(i).Player)
			updateManualPlayer(game.map_paddles.get(i));
	}
}
