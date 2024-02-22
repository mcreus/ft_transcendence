// Récupérer le canevas et son contexte
let	canvas;
let	ctx;
let	game;

// Class
class Paddle {
	constructor(PosX, PosY, Color, Player, Pseudo, Height, Up, Down) {
		this.PosX = PosX;
		this.PosY = PosY;
		this.ObjY = 0;
		this.Color = Color;
		this.Player = Player;
		this.Height = Height;
		this.Speed = 5;
		this.KeyUp = Up;
		this.KeyDown = Down;
		this.Pseudo = Pseudo;
	}
	copy(player) {
		this.PosX = player.PosX;
		this.PosY = player.PosY;
		this.ObjY = player.ObjY;
		this.Color = player.Color;
		this.Height = player.Height;
		this.Speed = player.Speed;
		this.KeyUp = player.KeyUp;
		this.KeyDown = player.KeyDown;
		this.Pseudo = player.Pseudo;
	}
};

class Ball {
	constructor(PosX, PosY, Color, Radius, Speed) {
		this.PosX = PosX;
		this.PosY = PosY;
		this.Color = Color;
		this.Radius = Radius;
		this.ballSpeedX = Math.random() - 0.5;
		this.ballSpeedY = Math.random() - 0.5;
		this.speed = Speed;
		this.collision = true;
		this.stape = 0;
		this.opacity = 1;
	}
	NextPos() {
		let dy = Math.abs(this.ballSpeedY * this.speed);
		let dx = Math.abs(this.ballSpeedX * this.speed);
		let dist = Math.sqrt(dx * dx + dy * dy);
		let ratio = this.speed / dist;
		this.PosY += this.ballSpeedY * this.speed * ratio;
		this.PosX += this.ballSpeedX * this.speed * ratio;
	}
	copy(ball) {
		this.PosX = ball.PosX;
		this.PosY = ball.PosY;
		this.ballSpeedX = ball.ballSpeedX;
		this.ballSpeedY = ball.ballSpeedY;
		this.speed = ball.speed;
		this.collision = ball.collision;
		this.Radius = ball.Radius;
		this.Color = ball.Color;
	}
	animate(game) {
		this.speed = 0;
		if (this.stape == 0)
		{
			this.Radius += 0.5;
			this.opacity -= 0.5 * (1 / 20);
			this.Color = "rgba(255,255,255," + this.opacity + ")";
			if (this.Radius >= 30)
			{
				this.PosX = canvas.width / 2;
				this.PosY = canvas.height / 2;
				this.stape++;
			}
		}
		else if (this.stape == 1)
		{
			this.Radius -= 0.5;
			this.opacity += 0.5 * (1 / 20);
			this.Color = "rgba(255,255,255," + this.opacity + ")";
			if (this.Radius <= game.ballRadius)
			{
				this.stape = 0;
				this.speed = game.ballSpeedInit;
				this.ballSpeedX = -this.ballSpeedX;
				this.ballSpeedY = 0;
				this.collision = true;
			}
		}
	}
};

class GameManager {
	constructor(n_time, n_point, n_player, multy_ball, is_tournament, is_online) {
		this.map_paddles = new Map();
		this.map_balls = new Map();
		this.scoreWin = n_point;
		this.time = 60 * n_time;
		this.nb_player = n_player;
		this.nb_balls = 0;
		this.nb_paddles = 0;
		this.scoreL = 0;
		this.scoreR = 0;
		this.paddleHeight = 80;
		this.paddleWidth = 10;
		this.ballRadius = 10;
		this.ballSpeedInit = 5;
		this.ballSpeedMax = 10;
		this.multyBalls = multy_ball;
		this.interval = new Date().getTime() / 1000;
		this.tournament = is_tournament;
		this.online = is_online;
		this.testPing = 0;
		this.latence = 0;
		this.test = new Date().getTime();
	}
	latence(ping)
	{
		let ball = this.map_balls.get(0);
		for (let i = 0; i < ping; i++)
		{
			if (ball.collision)
			{
				if (ball.PosY <= 0 + ball.Radius || ball.PosY >= canvas.height - ball.Radius)
					ball.ballSpeedY = -ball.ballSpeedY;

				collisionPaddles(this, ball);
				facticeGoal(this, ball);
				ball.NextPos();
				if (ball.PosY - ball.Radius < 0)
					ball.PosY = ball.Radius;
				else if (ball.PosY + ball.Radius > canvas.height)
					ball.PosY = canvas.height - ball.Radius;
			}
			else
				ball.animate(this);
		}
		return ball;
	}
	updateGame() {
	//Each balls
		for (let i = 0; i < this.map_balls.size; i++)
		{
			let ball = this.map_balls.get(i);

			// Rebondir sur les bords verticaux
			if (ball.collision)
			{
				if (ball.PosY <= 0 + ball.Radius || ball.PosY >= canvas.height - ball.Radius)
					ball.ballSpeedY = -ball.ballSpeedY;

				// Rebondir sur toutes les raquettes
				collisionPaddles(this, ball);
				// Si la balle atteint l'extrémité gauche ou droite, réinitialiser sa position
				goal(this, ball);
				if (this.online && this.map_paddles.get(0).Player == 0 || !this.online)
					ball.NextPos();
				if (ball.PosY - ball.Radius < 0)
					ball.PosY = ball.Radius;
				else if (ball.PosY + ball.Radius > canvas.height)
					ball.PosY = canvas.height - ball.Radius;
			}
			else
				ball.animate(this);
		}
		for (let i = 0; i < this.nb_player; i++)
		{
			if (this.map_paddles.get(i).Player == 0)
				updateManualPlayer(this.map_paddles.get(i));
			else if (this.map_paddles.get(i).Player > 0)
				MoveAI(this.map_paddles.get(i));
		}
		if (this.time <= 0 && this.scoreL != this.scoreR)
			this.finished = true;
		if (this.online)
		{
			if (this.map_paddles.get(0).Player == 0)
			{
				sendPos(this.map_paddles.get(0), 0, this.map_paddles.get(1).Pseudo);
				sendBall(this.map_balls.get(0), 0, this.map_paddles.get(1).Pseudo);
			}
			else
				sendPos(this.map_paddles.get(1), 1, this.map_paddles.get(0).Pseudo);
		}
	}
	updateBySec()
	{
		this.time--;
		this.testPing--;
		if (this.time % 30 == 0 && this.multyBalls)
			this.map_balls.set(this.nb_balls++, new Ball(canvas.width / 2, canvas.height / 2, "white", this.ballRadius, this.ballSpeedInit));
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
		for (let i = 0; i < this.nb_player; i++)
		{
			if (this.map_paddles.get(i).Player != 0)
				SelectAI(this, this.map_paddles.get(i), this.map_paddles.get(i).Player);
		}
		if (this.testPing <= 0 && this.online && this.map_paddles.get(0).Player == 0)
		{
			this.testPing = 10;
			sendTestPing(game.map_paddles.get(1).Pseudo)
		}

	}
	gameLoop(game) {
		game.updateGame();
		drawGame(game);
		if (this.finished)
		{
			//goTo('victory');
			AnimVictory(game);
			return ;
		}
		if (new Date().getTime() / 1000 - game.interval >= 1)
		{
			game.interval = new Date().getTime() / 1000;
			game.updateBySec();
		}
		requestAnimationFrame(function() {game.gameLoop(game)});
	}
};

function init(type)
{
	if (type == 'online')
	{
                if (!document.getElementById("player_1"))
			return ;
		onlineGame(false);
		return ;
	}
	else if (type == 'online_tournament')
	{
		if (!document.getElementById("player_1"))
                {
                        let player = document.getElementById("user").innerHTML;
                        if (player == document.getElementById("main").dataset.p1)
                                sendAlert(document.getElementById("main").dataset.p2, document.getElementById("main").dataset.num);
                        else
                                sendAlert(document.getElementById("main").dataset.p1, document.getElementById("main").dataset.num);
                        return ;
                }
                onlineGame(true);
                return ;
	}
	else if (type == 'tournament')
		gameTournament();
	else
	{
		if (checkParam())
                	return ;
		localGame();
	}
	let	ball1 = new Ball(canvas.width / 2, canvas.height / 2, "white", game.ballRadius, game.ballSpeedInit);
	game.map_balls.set(game.nb_balls++, ball1);
	sendStatus('ingame');
	GenerateShow(game);
	AnimShow(game);
}

function localGame()
{
	let nb_point = document.getElementById("Nb_point").value;
	let nb_player = document.getElementById("Nb_player").value;
	let time = document.getElementById("time-select").value;
	let multy_ball = document.getElementById("Multy_ball").checked;
	game = new GameManager(time, nb_point, nb_player, multy_ball, false, false);
	let player1 = document.getElementById("player_1").value;
	let player2 = document.getElementById("player_2").value;
	let player3 = 1;
	let player4 = 1;
	let paddle1;
	let paddle2;
	let paddle3;
	let paddle4;
	if (nb_player > 2)
	{
		player3 = document.getElementById("player_3").value;
		player4 = document.getElementById("player_4").value;
	}
	GenerateGame(game);
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	if (game.nb_player > 2)
	{
		paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", player1, "", game.paddleHeight, "w", "s");
		paddle2 = new Paddle(150, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", player2, "", game.paddleHeight, "y", "h");
		paddle3 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", player3, "", game.paddleHeight, "5", "2");
		paddle4 = new Paddle(canvas.width - game.paddleWidth - 150, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", player4, "", game.paddleHeight, "ArrowUp", "ArrowDown");
	}
	else
	{
		paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", player1, "", game.paddleHeight, "w", "s");
		paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", player2, "", game.paddleHeight, "ArrowUp", "ArrowDown");
	}
	game.map_paddles.set(game.nb_paddles++, paddle1);
	game.map_paddles.set(game.nb_paddles++, paddle2);
	if (game.nb_player > 2)
	{
		game.map_paddles.set(game.nb_paddles++, paddle3);
		game.map_paddles.set(game.nb_paddles++, paddle4);
	}
}

function onlineGame(tournament)
{
	let player1 = document.getElementById("player_1").innerHTML;
	let player2 = document.getElementById("player_2").innerHTML;
	sendMatch(player1, player2, tournament);
}

function startOnlineGame(player1, player2, side, isTournament)
{
	sendStatus('ingame');
	game = new GameManager(2, 5, 2, false, isTournament, true);
	GenerateGame(game);
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	let paddle1;
	let paddle2;
	if (side == 0)
	{
		paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", 0, player1, game.paddleHeight, "w", "s");
		paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", -1, player2, game.paddleHeight, "ArrowUp", "ArrowDown");
	}
	else
	{
		paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", -1, player1, game.paddleHeight, "w", "s");
		paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", 0, player2, game.paddleHeight, "ArrowUp", "ArrowDown");
	}
	game.map_paddles.set(game.nb_paddles++, paddle1);
	game.map_paddles.set(game.nb_paddles++, paddle2);
	let	ball1 = new Ball(canvas.width / 2, canvas.height / 2, "rgba(255,255,255,1)", game.ballRadius, game.ballSpeedInit);
	game.map_balls.set(game.nb_balls++, ball1);
	GenerateShow(game);
	AnimShow(game);
}

function gameTournament()
{
	game = new GameManager(2, 5, 2, false, true, false);
	let player1 = document.getElementById("player_1").innerHTML;
	let player2 = document.getElementById("player_2").innerHTML;
	GenerateGame(game);
	canvas = document.getElementById("pongCanvas");
	ctx = canvas.getContext("2d");
	let paddle1 = new Paddle(0, (canvas.height - game.paddleHeight) / 2, "rgba(0,176,176,1)", 0, player1, game.paddleHeight, "w", "s");
	let	paddle2 = new Paddle(canvas.width - game.paddleWidth, (canvas.height - game.paddleHeight) / 2, "rgba(255,154,0,1)", 0, player2, game.paddleHeight, "ArrowUp", "ArrowDown");
	game.map_paddles.set(game.nb_paddles++, paddle1);
	game.map_paddles.set(game.nb_paddles++, paddle2);
}
function checkParam()
{
	let nb_point = document.getElementById("Nb_point").value;
	if (nb_point < 1 || nb_point > 25)
		return 1;
	return 0;
}
