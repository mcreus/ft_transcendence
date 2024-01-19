function handleLoginSubmit() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/login/',
            type: 'post',
            data: $(this).serialize(),
            success: function(response) {
                if (response.error) {
                    alert('Erreur de connexion : ' + Object.values(response.errors).join('\n'));
                } else {
                    location.reload();
                }
            },
            error: function(xhr, status, error) {
                alert('Erreur de soumission : ' + error);
            }
        });
    });
}

function loadForm(formType) {
    var url = formType === "signup" ? "/signup/" : "/login/";

    $.ajax({
        url: url,
        success: function(data) {
            $("#" + formType + "Container").html(data).show();
            if (formType === "login") {
                handleLoginSubmit(); 
            }
        },
        error: function(error) {
            console.error("Erreur lors du chargement du formulaire : ", error);
        }
    });
}

