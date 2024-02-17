let url = `wss://${window.location.host}/ws/socket-server/`;
let chatSocket = new WebSocket(url);
webSocketFunctions(chatSocket);

function webSocketFunctions(chatSocket)
{
	chatSocket.onmessage = function(e) {
		const data = JSON.parse(e.data);
		//console.log('Data', data);
		if (data.type == 'chat')
		{
			let div = document.getElementById('chat');
			div.insertAdjacentHTML('afterbegin', `<div class='message'>${data.pseudo}: ${data.message}</div>`);
			if (div.getElementsByTagName('*').length > 100)
				div.lastElementChild.remove();
			if (!document.getElementById('chatDrawer').checked)
				document.getElementById('notif').classList.add('active');
		}
		if (data.type == 'status')
		{
			console.log('Data', data);
			if (!document.getElementById('user'))
				return;
			if (data.target == document.getElementById('user').innerHTML)
				return;
			let div = document.getElementById(`status_${data.target}`);
			console.log('div ; ', div);
			if (data.status == 'offline')
			{
				div.classList.remove('ingame');
				div.classList.remove('online');
			}
			else if (data.status == 'online')
			{
				div.classList.remove('ingame');
				div.classList.add('online');
			}
			else if (data.status == 'ingame')
			{
				div.classList.remove('online');
				div.classList.add('ingame');
			}
		}

		if (data.type == 'player_pos')
			game.map_paddles.get(data.id).copy(data.player);
		if (data.type == 'ball_pos')
			game.map_balls.get(data.id).copy(data.ball);
		if (data.type == 'start_match')
		{
			let user = document.getElementById('user').innerHTML;
			let side = 0;
			if (user != data.player1)
				side = 1;
			startOnlineGame(data.player1, data.player2, side);
		}
	};
	sendStatus('online');
}

function sendMessage(message) {
	if (!isOpen(chatSocket))
		return;
	chatSocket.send(JSON.stringify({
		'type':'chat',
		'message': message
	}));
}

function sendPos(player, id, pseudo) {
	if (!isOpen(chatSocket))
		return;
	chatSocket.send(JSON.stringify({
		'type':'player_pos',
		'id':id,
		'player':player,
		'target':pseudo
	}));
}

function sendBall(ball, id, pseudo) {
	if (!isOpen(chatSocket))
		return;
	chatSocket.send(JSON.stringify({
		'type':'ball_pos',
		'id':id,
		'ball':ball,
		'target':pseudo
	}));
}

function sendMatch(player1, player2) {
	if (!isOpen(chatSocket))
		return;
	chatSocket.send(JSON.stringify({
		'type':'start_match',
		'player1':player1,
		'player2':player2
	}));
	sendStatus('ingame');
}

function sendStatus(statu) {
	console.log('Send : ', document.getElementById('user'));
	if (!isOpen(chatSocket) || !document.getElementById('user'))
		return;
	chatSocket.send(JSON.stringify({
		'type':'status',
		'status':statu,
		'target':document.getElementById('user').innerHTML
	}));
}

function isOpen(ws) {
	return ws.readyState === ws.OPEN;
}

