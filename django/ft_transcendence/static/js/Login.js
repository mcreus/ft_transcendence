function submitForm(formId, num) {
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
        case 'tournament':
        	url = '/tournaments/create/'
        	break;
        case 'launch':
        	url = '/tournaments/' + num + '/update/';
        	break;
        // Vous pouvez ajouter autant que vous le voulez
    }

    fetch(url, {
        method: 'POST',
        body: formData
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
        console.error('Probleme avec le fetch:', error);
    });
}

function registerUser(num) {
    let formData = new FormData(document.getElementById(`subscribeForm`));
    //formData.append('tournament_id', '{{ tournament.id }}'); // Remplacez par l'id du tournoi
    let url = '';
    url = '/tournaments/' + num + '/';
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