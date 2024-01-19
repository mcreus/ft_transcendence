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

function drawGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawEnv();
	// Dessiner toutes les raquettes
	for (let i = 0; i < game.map_paddles.size; i++)
	{
		ctx.fillStyle = game.map_paddles.get(i).Color;
		ctx.fillRect(game.map_paddles.get(i).PosX, game.map_paddles.get(i).PosY, game.paddleWidth, game.paddleHeight);
	}

	// Dessiner les balles
	for (let i = 0; i < game.map_balls.size; i++)
	{
		let ball = game.map_balls.get(i);
		ctx.beginPath();
		ctx.arc(ball.PosX, ball.PosY, ball.Radius, 0, Math.PI * 2);
		ctx.fillStyle = ball.Color;
		ctx.fill();
		ctx.closePath();
	}
}
