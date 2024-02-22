function submitForm(formId, num, player) {
    let formData = new FormData(document.getElementById(`${formId}Form`));
    // Définir l'URL en fonction de l'ID du formulaire
    let url = '';
    switch (formId) {
    	case 'signup':
    		url = '/signup/';
    		break;
        case 'login':
            url = '/login/';
            break;
        case 'update_username':
            url = '/profile/username/';
            break;
        case 'update_email':
            url = '/profile/email/';
            break;
        case 'update_password':
            url = '/profile/password/';
            break;
        case 'update_image':
        	url = '/profile/image/';
        	break
	case 'add_friend':
		url = '/add_friend/';
		break;
	case 'removefriend':
		url = '/other_profile/' + num + '/';
		formData.append('removefriend', 1);
		break;
	case 'addfriend':
		url = '/other_profile/' + num + '/';
		formData.append('addfriend', 1);
		break;
        case 'tournament':
        	url = '/tournaments/create/'
        	break;
        case 'subscribe':
        	url = '/tournaments/' + num + '/'
        	break;
        case 'launch':
        	url = '/tournaments/' + num + '/update/';
            formData.append('launch', 1);
        	break;
        case 'addLocal':
            url = '/tournaments/' + num + '/update/';
            var new_p = document.getElementById("new_player");
            formData.append('new_player', new_p.value);
            break;
        case `removeLocal${player}`:
            url = '/tournaments/' + num + '/update/';
            formData.append('remove', player);
            break;
        case `delete`:
            url = '/tournaments/' + num + '/update/';
            formData.append('delete', 1);
            break;
        case 'forceWin':
            url = '/match/' + num + '/';
            formData.append('forced', player);
            break;
        // Vous pouvez ajouter autant que vous le voulez
    }
    fetchForm(url, formData);
}

function fetchForm(url, formData) {
    console.log(url);
    fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.text();
    })
    .then(data => {
        // Gérez la réponse ici, par exemple mettre à jour l'interface utilisateur
        document.getElementById('body').innerHTML = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function SendResult(game)
{
    let url = '/local/';
	if (game.nb_player > 2)
		return ;
	let formData = new FormData(document.getElementById('resultForm'));
	formData.append('player1', game.map_paddles.get(0).Pseudo);
	formData.append('player2', game.map_paddles.get(1).Pseudo);
	formData.append('score1', game.scoreL);
	formData.append('score2', game.scoreR);
	if (game.scoreL > game.scoreR)
		formData.append('winner', game.map_paddles.get(0).Pseudo);
	else
		formData.append('winner', game.map_paddles.get(1).Pseudo);
    if (game.tournament)
        url = `/match/${document.getElementById("main").dataset.num}/`;
    fetchForm(url, formData);
    sendStatus('online');
}
