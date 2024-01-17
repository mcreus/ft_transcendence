//Bouton "Jouer" pour afficher le pong
document.addEventListener('DOMContentLoaded', function() {
    var boutonPlay = document.getElementById('boutonPlay');
    var jeuContainer = document.getElementById('jeuContainer');
    boutonPlay.addEventListener('click', function() {
        // Cache le bouton 'Play'
        this.style.display = 'none';
        titreSite.style.display = 'none';
        init();
    });
});

function GenerateGame()
{
	let	minutes = game.time / 60;
	let	secondes = game.time % 60;
	let	time_begin = Math.floor(minutes) + ":" + secondes;
	if (secondes < 10)
		time_begin = Math.floor(minutes) + ":0" + secondes;
	let	body = document.getElementById("pageGame");
	body.insertAdjacentHTML("afterbegin", '\
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
				<td colspan="' + game.scoreWin + '" id="scoreLeft" width="50%" style="text-align:center; color:green; font-size:160%">0</td>\
				<td colspan="' + game.scoreWin + '" id="scoreRight" width="50%" style="text-align:center; color:red; font-size:160%">0</td>\
			</tr>\
			<tr id="scoring"></tr>\
		</tbody>\
	</table>'
	);
	let	scoring = document.getElementById("scoring");
	for (let i = 1; i <= game.scoreWin; i++)
	{
		scoring.insertAdjacentHTML("afterbegin", '<td id=scoreLeft' + i +' height="10" width="10" style="background-color:rgba(0,0,0,0.2)" ></td>');
		scoring.insertAdjacentHTML("beforeend", '<td id=scoreRight' + i +' height="10" width="10" style="background-color:rgba(0,0,0,0.2)"></td>');
	}
}
