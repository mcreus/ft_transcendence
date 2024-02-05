let url = `ws://${window.location.host}/ws/socket-server/`;
const chatSocket = new WebSocket(url);

chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    console.log('Data', data);
    
    let div = document.getElementById('chat');
    div.insertAdjacentHTML('beforeend', `<div>${data.message}</div>`);
    //const message = data['message'];
    // Handle incoming message
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

// Send message to server
function sendMessage(message) {
    chatSocket.send(JSON.stringify({
        'message': message
    }));
    console.log(message);
}

let form = document.getElementById('lobbyForm')

form.addEventListener('submit', (e) => {
	e.preventDefault()
	sendMessage(e.target.message.value)
	form.reset()
})
