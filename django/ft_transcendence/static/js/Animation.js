function WaitSec()
{
	document.getElementById("versus").innerHTML = '3';
	let time = new Date().getTime() / 1000;
	while (new Date().getTime() / 1000 - time < 1)
	{
		document.getElementById("versus").innerHTML = '3';
	}
}

function AnimShow(game)
{
	document.getElementById("leftTeam").style.animation = "teamShow 5s linear";
	document.getElementById("rightTeam").style.animation = "teamShow 5s linear";
	document.getElementById("rightTeam").onanimationend = () => {
		document.getElementById("show").style.animation = "out 1s";
		document.getElementById("game").style.animation = "in50 1s";
		document.getElementById("game").onanimationend = () => {
			if (document.getElementById("show").innerHTML == '')
				return ;
			document.getElementById("game").style.opacity = 1.0;
			document.getElementById("rightTeam").innerHTML = '';
			document.getElementById("leftTeam").innerHTML = '';
			document.getElementById("versus").innerHTML = '3';
			document.getElementById("versus").style.animation = "1s ease 0s 3 normal none running decount";
			let iterationCount = 0;
			document.getElementById("versus").addEventListener("animationiteration", () => {
				iterationCount++;
				document.getElementById("versus").innerHTML = 3 - iterationCount;
			});
			document.getElementById("versus").addEventListener("animationend", () => {
				document.getElementById("show").innerHTML = '';
				document.getElementById("show").style.opacity = 1.0;
				game.gameLoop(game);
			});
		};
	};
}

function AnimVictory(game)
{
	document.getElementById("game").style.animation = "out20 3s";
	document.getElementById("game").onanimationend = () => {
		document.getElementById("game").style.opacity = 0.2;
	};
	let	body = document.getElementById("main");
	body.insertAdjacentHTML("afterbegin", '<div id="end" class="victory">VICTORY</div>');
	let	div = document.getElementById("end");
	let	index = 0;
	if (game.scoreL < game.scoreR)
		index = game.nb_player / 2;
	for (let i = 0; i < game.nb_player / 2; i++)
		div.insertAdjacentHTML("beforeend", '<div>' + game.map_paddles.get(i + index).Pseudo + '</div>');
	div.style.opacity = 0;
	div.style.animation = "in 5s";
	div.onanimationend = () => {
		div.style.opacity = 1;
		goTo('');
	};
}
