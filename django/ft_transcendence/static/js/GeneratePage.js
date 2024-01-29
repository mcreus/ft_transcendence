//Bouton "Jouer" pour afficher le pong
/*document.addEventListener('DOMContentLoaded', function() {
    var boutonPlay = document.getElementById('boutonPlay');
    var jeuContainer = document.getElementById('jeuContainer');

    boutonPlay.addEventListener('click', function() {
        document.getElementById('main').innerHTML = '';
        init();
    });
});*/

function navigateTo(view) {
	console.log('Navigateto', view);
	let main = document.getElementById('main');
	let div = main.getElementsByTagName('div');
	if (view != "" && view != "logout" && view != "login" && view != "signup" && view != "tournaments/create" && view != "tournaments")
	{
		let i = 0;
		for (; i < div.length; i++)
		{
			div[i].style.animation = "divout 0.3s " + i * 0.03 + "s";
			console.log(div[i]);
		}
		main.style.animation = "pageout 1s";
		main.onanimationend = () => {
			main.innerHTML = '';
			main.style.opacity = 0.0;
			// Charger les autres vues
			console.log('Navigateto', view);
			if (view != "" && view != "logout" && view != "login")
			{
				fetch(`/${view}`)
					.then(response => response.text())
					.then(data => {
						document.getElementById('main').innerHTML = data;
						//history.pushState({ view }, null, `#${view}`);
						window.location.hash = view;
					});
			}
			main.style.animation = "pagein 1s";
			main.onanimationend = () => {
				main.style.opacity = 1.0;
			}
		};
	}
	else
	{
		document.getElementById('body').innerHTML = '';
		fetch(`/${view}`)
			.then(response => response.text())
			.then(data => {
				document.getElementById('body').innerHTML = data;
				//history.pushState({ view }, null, `#${view}`);
				window.location.hash = view;
			});
	}
}

function GenerateGame(game)
{
	document.getElementById('main').innerHTML = '';
	let	minutes = game.time / 60;
	let	secondes = game.time % 60;
	let	time_begin = Math.floor(minutes) + ":" + secondes;
	if (secondes < 10)
		time_begin = Math.floor(minutes) + ":0" + secondes;
	let	body = document.getElementById("main");
	body.insertAdjacentHTML("afterbegin", '\
	<div id="show" class="versus"></div>\
	<div id="game" style="opacity:0.4">\
		<div id="timer" height="900" style="text-align:center; font-size:300%">' + time_begin + '</div>\
			<canvas id="pongCanvas" width="800" height="400"></canvas>\
			<table id="scores" width="600" height="100" class="center">\
			<thead>\
				<tr>\
					<th colspan="' + game.scoreWin * 2 + '" style="font-size:300%">Scores</th>\
				</tr>\
			</thead>\
			<tbody>\
				<tr>\
					<td colspan="' + game.scoreWin + '" id="scoreLeft" width="50%" style="text-align:center; color:rgba(0,176,176,1); font-size:160%">0</td>\
					<td colspan="' + game.scoreWin + '" id="scoreRight" width="50%" style="text-align:center; color:rgba(255,154,0,1); font-size:160%">0</td>\
				</tr>\
				<tr id="scoring"></tr>\
			</tbody>\
		</table>\
	</div>'
	);
	let	scoring = document.getElementById("scoring");
	for (let i = 1; i <= game.scoreWin; i++)
	{
		scoring.insertAdjacentHTML("afterbegin", '<td id=scoreLeft' + i +' height="10" width="10" style="background-color:rgba(80,80,80,0.8)" ></td>');
		scoring.insertAdjacentHTML("beforeend", '<td id=scoreRight' + i +' height="10" width="10" style="background-color:rgba(80,80,80,0.8)"></td>');
	}
}

function GenerateShow(game)
{
	let div = document.getElementById("show");
	for (let i = 0; i < game.nb_player / 2; i++)
		div.innerHTML += '<div class="parallelogramLeft">';
	for (let i = game.nb_player / 2; i < game.nb_player; i++)
		div.innerHTML += '<div class="parallelogramRight">';
	
}

function ModifParam()
{
	let	div = document.getElementById("pos");
	let	team = 1;
	div.innerHTML= '';
	console.log(div);
	if (document.getElementById("Nb_player").value == 4)
		team = 2;
	for (let i = 1; i <= document.getElementById("Nb_player").value; i++)
	{
		let color = "sous-player-blue";
		if (i > team)
			color = "sous-player-orange";
		div.insertAdjacentHTML("beforeend", '<div class="' + color +'" for="player_' + i + '">Player ' + i + '<select id="player_' + i + '">\
			<option value="0">Joueur</option>\
			<option value="1">AI 1</option>\
			<option value="2">AI 2</option>\
			<option value="3">Ai 3</option>\
			<option value="4">AI 4</option>\
		</select></div>');
	}
}