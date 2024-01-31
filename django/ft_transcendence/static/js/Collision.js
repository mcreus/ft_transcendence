function collisionPaddles(game, ball)
{
	for (let i = 0; i < game.map_paddles.size; i++)
	{
		if ((ball.PosX > game.map_paddles.get(i).PosX - ball.Radius && ball.PosX < game.map_paddles.get(i).PosX + game.paddleWidth + ball.Radius) && 
			(ball.PosY > game.map_paddles.get(i).PosY - ball.Radius && ball.PosY < game.map_paddles.get(i).PosY + game.paddleHeight + ball.Radius))
		{
			if (ball.PosX < game.map_paddles.get(i).PosX)
				ball.ballSpeedX = -1;
			else if (ball.PosX > game.map_paddles.get(i).PosX)
				ball.ballSpeedX = 1;
			ball.ballSpeedY = -(game.map_paddles.get(i).PosY + game.paddleHeight / 2 - ball.PosY) / (game.paddleHeight / 3);
			rand = Math.random() * (game.paddleHeight + 20) - ((game.paddleHeight + 20) / 2);
			ball.speed += 0.3;
			if (ball.speed > game.ballSpeedMax)
				ball.speed = game.ballSpeedMax;
		}
	}
}

function goal(game, ball)
{
	if (ball.PosX < 0 + ball.Radius || ball.PosX > canvas.width - ball.Radius)
	{
		if (ball.PosX < 0 + ball.Radius)
		{
			game.scoreR++;
			if (game.scoreR <= game.scoreWin && game.scoreR != 0)
			{
				//document.getElementById("scoreRight" + game.scoreR).style.backgroundColor = "rgba(255,154,0,1)";
				document.getElementById("scoreRight" + game.scoreR).style.animation = "goalR 0.2s";
				document.getElementById("scoreRight" + game.scoreR).onanimationend = () => {
					document.getElementById("scoreRight" + game.scoreR).style.backgroundColor = "rgba(255,154,0,1)";
				};
			}
		}
		else
		{
			game.scoreL++;
			if (game.scoreL <= game.scoreWin && game.scoreL != 0)
			{
				//document.getElementById("scoreLeft" + game.scoreL).style.backgroundColor = "rgba(0,176,176,1)";
				document.getElementById("scoreLeft" + game.scoreL).style.animation = "goalL 0.2s";
				document.getElementById("scoreLeft" + game.scoreL).onanimationend = () => {
					document.getElementById("scoreLeft" + game.scoreL).style.backgroundColor = "rgba(0,176,176,1)";
				};
			}
		}
		if (game.scoreL >= game.scoreWin || game.scoreR >= game.scoreWin)
			game.finished = true;
		ball.PosX = canvas.width / 2;
		ball.PosY = canvas.height / 2;
		ball.ballSpeedX = -ball.ballSpeedX;
		ball.speed = game.ballSpeedInit;
		document.getElementById('scoreLeft').textContent = game.scoreL;
		document.getElementById('scoreRight').textContent = game.scoreR;
		rand = Math.random() * (game.paddleHeight + 20) - ((game.paddleHeight + 20) / 2);
	}
}
