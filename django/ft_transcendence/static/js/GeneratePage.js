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
	if (view == 'salon' || view == 'local' || view == 'profile' || view == 'fast_game' || view == 'profile/username' || view == "profile/email" || view == 'profile/password' || view == 'profile/image' || view == 'historic')
	{
		let i = 0;
		for (; i < div.length; i++)
		{
			div[i].style.animation = "divout 0.3s " + i * 0.03 + "s";
			//console.log(div[i]);
		}
		main.style.animation = "pageout 1s";
		main.onanimationend = () => {
			main.innerHTML = '';
			main.style.opacity = 0.0;
			// Charger les autres vues
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
				if (view == 'fast_game')
					init('online');
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
	if (view == 'logout' || view == 'fast_game')
	{
		chatSocket.close();
		chatSocket = new WebSocket(`ws://${window.location.host}/ws/socket-server/`);
		webSocketFunctions(chatSocket);
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
	<div id="show" class="versus">\
		<div id="leftTeam" style="margin-bottom:5px; width: 100%; transform: translateX(-5%)"></div>\
		<div id="versus" class="vertical-center">V.S</div>\
		<div id="rightTeam" style="margin-top:5px; width: 100%; margin-left: auto; transform: translateX(55%)"></div>\
	</div>\
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
	let left = document.getElementById("leftTeam");
	let right = document.getElementById("rightTeam");
	let nbPlayer = 1;
	let player;
	for (let i = 0; i < game.nb_player; i++)
	{
		if (game.map_paddles.get(i).Player > 0)
			player = "AI " + game.map_paddles.get(i).Player;
		else
			player = game.map_paddles.get(i).Pseudo;
		if (player == "" || !player)
			player = "Player " + nbPlayer++;
		game.map_paddles.get(i).Pseudo = player;
		if (i < game.nb_player / 2)
			left.innerHTML += ('<div class="parallelogramLeft" style="margin-left: ' + (i * -20) + 'px">' + player + '</div>');
		else
			right.innerHTML += ('<div class="parallelogramRight" style="margin-left: ' + ((i - game.nb_player / 2) * -20) + 'px">' + player + '</div>');
	}
}

function ModifParam()
{
	let	div = document.getElementById("pos");
	let	team = 1;
	div.innerHTML= '';
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
