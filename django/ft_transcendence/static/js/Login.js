function submitForm(view) {
   
    // Récupérer les données du formulaire
    let formData = new FormData(document.getElementById(`${view}Form`));

    // Effectuer une requête AJAX pour envoyer les données du formulaire
    if (view == 'tournament')
        view = 'tournaments/create'
    fetch(`/${view}/`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('body').innerHTML = data;
        });
}
