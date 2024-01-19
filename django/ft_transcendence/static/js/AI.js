let	dirAI1 = 5;

function AIlvl1(game, AI)
{
	if (AI.PosY + dirAI1 < 0 || AI.PosY + game.paddleHeight + dirAI1 > canvas.height)
		dirAI1 = -dirAI1;
	AI.PosY += dirAI1;
}

function AIlvl2(game, AI)
{
	let paddleCenter = AI.PosY + game.paddleHeight / 2;
	if (paddleCenter < ballY - game.paddleHeight / 2)
		AI.PosY += 3;
	else if (paddleCenter > ballY + game.paddleHeight / 2)
		AI.PosY -= 3;
}

function AIlvl3(game, AI)
{
	let	ball = game.map_balls.get(0);
	if (PosAI3 - ball.ballRadius < AI.PosY + game.paddleHeight / 2 && AI.PosY + game.paddleHeight / 2 < PosAI3 + ball.ballRadius)
		return ;
	if (AI.PosY + game.paddleHeight / 2 < PosAI3 + ballRadius)
		AI.PosY += 5;
	else if (AI.PosY + game.paddleHeight / 2 > PosAI3 - ballRadius)
		AI.PosY -= 5;
}

function AIlvlCheat(game, AI)
{
	let	ball = game.map_balls.get(0);
	AI.PosY = ball.PosY - game.paddleHeight / 2;
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
