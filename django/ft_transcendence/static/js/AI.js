function AIlvl1(game, AI)
{
	if (AI.PosY - AI.Speed <= 0)
		AI.ObjY = canvas.height;
	else if (AI.PosY + AI.Height + AI.Speed >= canvas.height)
		AI.ObjY = 0;
}

function AIlvl2(game, AI)
{
	let	ball = game.map_balls.get(0);
	AI.ObjY = ball.PosY - game.paddleHeight / 2;
	if (ball.ballSpeedY > 0)
		AI.ObjY += game.paddleHeight;
	else
		AI.ObjY -= game.paddleHeight;
}

function AIlvl3(game, AI)
{
	let	ball = game.map_balls.get(0);
	let	side;
	if (AI.PosX > canvas.width / 2)
		side = 1;
	else
		side = -1;
	if ((side < 0 && ball.PosX < canvas.width - canvas.width / 4 && ball.ballSpeedX < 0) || (side > 0 && ball.PosX > canvas.width / 4 && ball.ballSpeedX > 0))
	{
		let	nextX = ball.PosX;
		let	nextY = ball.PosY;
		let	nextSpeedY = ball.ballSpeedY;
		let	nextSpeedX = ball.ballSpeedX;
		while ((nextX > AI.PosX + game.paddleWidth && side < 0) || (nextX < AI.PosX && side > 0))
		{
			if (nextY <= 0 + ball.Radius || nextY >= canvas.height - ball.Radius)
				nextSpeedY = -nextSpeedY;
			let dy = Math.abs(nextSpeedY * ball.speed);
			let dx = Math.abs(nextSpeedX * ball.speed);
			let dist = Math.sqrt(dx * dx + dy * dy);
			let ratio = ball.speed / dist;
			nextY += nextSpeedY * ball.speed * ratio;
			nextX += nextSpeedX * ball.speed * ratio;
		}
		AI.ObjY = nextY;
	}
	else
		AI.ObjY = canvas.height / 2;
}

function AIlvlCheat(game, AI)
{
	let	ball = game.map_balls.get(0);
	let	side;
	if (AI.PosX > canvas.width / 2)
		side = 1;
	else
		side = -1;
	if ((side < 0 && ball.ballSpeedX < 0) || (side > 0 && ball.ballSpeedX > 0))
	{
		let	nextX = ball.PosX;
		let	nextY = ball.PosY;
		let	nextSpeedY = ball.ballSpeedY;
		let	nextSpeedX = ball.ballSpeedX;
		while ((nextX > AI.PosX + game.paddleWidth && side < 0) || (nextX < AI.PosX && side > 0))
		{
			if (nextY <= 0 + ball.Radius || nextY >= canvas.height - ball.Radius)
				nextSpeedY = -nextSpeedY;
			let dy = Math.abs(nextSpeedY * ball.speed);
			let dx = Math.abs(nextSpeedX * ball.speed);
			let dist = Math.sqrt(dx * dx + dy * dy);
			let ratio = ball.speed / dist;
			nextY += nextSpeedY * ball.speed * ratio;
			nextX += nextSpeedX * ball.speed * ratio;
		}
		AI.ObjY = nextY;
	}
	else
		AI.ObjY = canvas.height / 2;
}

function SelectAI(game, AI, lvl)
{
	if (lvl == 1)
		AIlvl1(game, AI);
	else if (lvl == 2)
		AIlvl2(game, AI);
	else if (lvl == 3)
		AIlvl3(game, AI);
	else if (lvl == 4)
		AIlvlCheat(game, AI);
	else
		console.log("invalid difficulty");
}

function MoveAI(AI)
{
	let center = AI.PosY + AI.Height / 2;
	if (Math.abs(center - AI.ObjY) < AI.Speed)
		return ;
	if (AI.PosY - AI.Speed >= 0 && center > AI.ObjY)
		AI.PosY -= AI.Speed;
	else if (AI.PosY + AI.Height + AI.Speed <= canvas.height && center < AI.ObjY)
		AI.PosY += AI.Speed;
}
