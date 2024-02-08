let url = `ws://${window.location.host}/ws/socket-server/`;
const chatSocket = new WebSocket(url);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('Data', data);
    
    if (data.type == 'chat')
    {
    	let div = document.getElementById('chat');
    	div.insertAdjacentHTML('beforeend', `<div>${data.message}</div>`);
    }
    if (data.type == 'player_pos')
    	game.map_paddles.get(data.id).copy(data.player);
    if (data.type == 'start_match')
    {
    	console.log('Data', data);
    	startOnlineGame(data.player1, data.player2);
    }
    //const message = data['message'];
    // Handle incoming message
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

// Send message to server
function sendMessage(message) {
    if (!isOpen(chatSocket))
    	return;
    chatSocket.send(JSON.stringify({
    	'type':'chat',
        'message': message
    }));
    console.log(message);
}

function sendPos(player, id) {
    if (!isOpen(chatSocket))
    	return;
    chatSocket.send(JSON.stringify({
    	'type':'player_pos',
        'id':id,
        'player':player
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

let form = document.getElementById('lobbyForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	sendMessage(e.target.message.value)
	form.reset()
})

function isOpen(ws) {
	return ws.readyState === ws.OPEN;
}
