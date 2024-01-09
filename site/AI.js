let	dirAI1 = 5;

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

function SelectAI(AI, lvl)
{
	if (lvl == 1)
		AIlvl1(AI);
	else if (lvl == 2)
		AIlvl2(AI);
	else if (lvl == 3)
		AIlvl3(AI);
	else if (lvl == 4)
		AIlvlCheat(AI);
	else
		console.log("invalid difficulty");
}
