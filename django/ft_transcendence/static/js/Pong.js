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
    this.ballSpeedX = 1;
    this.ballSpeedY = 1;
    this.speed = Speed;
  }
  NextPos() {
  	let dy = Math.abs(this.ballSpeedY * this.speed);
  	let dx = Math.abs(this.ballSpeedX * this.speed);
  	let dist = Math.sqrt(dx * dx + dy * dy);
  	let ratio = this.speed / dist;
  	this.PosY +=  this.ballSpeedY * this.speed * ratio;
  	this.PosX +=  this.ballSpeedX * this.speed * ratio;
  }
};

class GameManager {
  constructor(n_time) {
    this.map_paddles = new Map();
    this.map_balls = new Map();
    this.nb_balls = 0;
    this.nb_paddles = 0;
    this.scoreL = 0;
    this.scoreR = 0;
    this.paddleHeight = 80;
    this.paddleWidth = 10;
    this.ballRadius = 10;
    this.scoreWin = 1;
    this.time = 60 * n_time;
    this.ballSpeedInit = 5;
    this.ballSpeedMax = 10;
    this.finished = false;
    this.multyBalls = true;
    this.interval = new Date().getTime() / 1000;;
  }
  updateGame() {
	//Each balls
	for (let i = 0; i < this.map_balls.size; i++)
	{
		let ball = this.map_balls.get(i);
		PosAI3 = ball.PosY + rand;
		
		// Rebondir sur les bords verticaux
		if (ball.PosY <= 0 + ball.Radius || ball.PosY >= canvas.height - ball.Radius)
			ball.ballSpeedY = -ball.ballSpeedY;

		// Rebondir sur toutes les raquettes
		collisionPaddles(this, ball);
		// Si la balle atteint l'extrémité gauche ou droite, réinitialiser sa position
		goal(this, ball);
		ball.NextPos();
		if (ball.PosY - ball.Radius < 0)
			ball.PosY = ball.Radius;
		else if (ball.PosY + ball.Radius > canvas.height)
			ball.PosY = canvas.height - ball.Radius;
	}
	//SelectAI(this, this.map_paddles.get(0), 4);
	updateManualPlayer(this.map_paddles.get(0));
	SelectAI(this, this.map_paddles.get(1), 4);
	if (multy)
	{
		SelectAI(this, this.map_paddles.get(2), 1);
		SelectAI(this, this.map_paddles.get(3), 1);
	}
	
  }
  updateBySec()
  {
	if (this.finished)
		return ;
	this.time--;
	if (this.time % 30 == 0 && this.multyBalls)
		this.map_balls.set(this.nb_balls++, new Ball(canvas.width / 2, canvas.height / 2, "#000", this.ballRadius, this.ballSpeedInit));
	let	timer = document.getElementById("timer");
	let	minutes = this.time / 60;
	let	secondes = this.time % 60;
	if (this.time < 0)
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
  gameLoop(game) {
	game.updateGame();
	drawGame(game);
	if (this.finished)
	{
		delete this;
		console.log("end game");
		console.log(game);
		return ;
	}
	if (new Date().getTime() / 1000 - game.interval >= 1)
	{
		game.interval = new Date().getTime() / 1000;
		game.updateBySec();
	}
	requestAnimationFrame(function() {game.gameLoop(game)});
	for (let i = 0; i < game.map_paddles.size; i++)
	{
		if (this.map_paddles.get(i).Player)
			updateManualPlayer(game.map_paddles.get(i));
	}
  }
};
// Initialiser les positions et vitesses des raquettes et de la balle
let	multy = false;
let	PosAI3;
let	rand;

// Initialiser une map contenant tous les paddle
function init()
{
	//Generate Page
	let	game = new GameManager(document.getElementById("time-select").value);
	rand = Math.random() * (game.paddleHeight + 20) - ((game.paddleHeight + 20) / 2);
	GenerateGame(game);
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	let	paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "#090", false);
	let	paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "#900", false);
	let	paddle3 = new Paddle(150, (canvas.height - game.paddleHeight)  / 2, "#090", false);
	let	paddle4 = new Paddle(canvas.width - game.paddleWidth - 150, (canvas.height - game.paddleHeight)  / 2, "#900", false);
	let	ball1 = new Ball(canvas.width / 2, canvas.height / 2, "#000", game.ballRadius, game.ballSpeedInit);

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
	game.gameLoop(game);
}
