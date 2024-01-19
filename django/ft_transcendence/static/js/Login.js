
function submitForm() {
   
    // Récupérer les données du formulaire
    let formData = new FormData(document.getElementById('loginForm'));

    // Effectuer une requête AJAX pour envoyer les données du formulaire
    fetch('/login/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('main').innerHTML = data;
        });
}
