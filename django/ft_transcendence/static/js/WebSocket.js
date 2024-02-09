let url = `ws://${window.location.host}/ws/socket-server/`;
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
	    	div.insertAdjacentHTML('beforeend', `<div>${data.message}</div>`);
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
	chatSocket.onclose = function(e) {
		
	};
}

function sendMessage(message) {
    if (!isOpen(chatSocket))
    	return;
    chatSocket.send(JSON.stringify({
    	'type':'chat',
        'message': message
    }));
    console.log(message);
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
}

function isOpen(ws) {
	return ws.readyState === ws.OPEN;
}
