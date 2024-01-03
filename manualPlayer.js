// propriétés du joueur manuel
const manualPlayer = {
    width: 10,
    height: 60,
    x: 0,  // Position initiale à droite
    y: 0,
    color: "#F00",  // Couleur rouge
    speed: 5,
};

// gestion des touches du clavier
const keyState = {};

let canvas;
let ctx;

function setCanvas(c) {
    canvas = c;
    ctx = canvas.getContext("2d");
}

// fonction de mise à jour de l'état des touches
function handleKeydown(event) {
    keyState[event.key] = true;
}

function handleKeyup(event) {
    keyState[event.key] = false;
}

// attacher les gestionnaires d'événements pour les touches du clavier
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

// mise en place du joueur manuel
function drawManualPlayer() {
    ctx.fillStyle = manualPlayer.color;
    ctx.fillRect(manualPlayer.x, manualPlayer.y, manualPlayer.width, manualPlayer.height);
}

// Mise à jour de la position du joueur manuel
function updateManualPlayer() {
    // Mettez à jour la position du joueur manuel en fonction des commandes de l'utilisateur
    // Utilisez les touches "ArrowUp" et "ArrowDown" pour déplacer le joueur

    // Touche flèche vers le haut
    if (keyState["ArrowUp"] && manualPlayer.y > 0) {
        manualPlayer.y -= manualPlayer.speed;
    }

    // Touche flèche vers le bas
    if (keyState["ArrowDown"] && manualPlayer.y + manualPlayer.height < canvas.height) {
        manualPlayer.y += manualPlayer.speed;
    }
}

// Fonction principale pour gérer le joueur manuel
function manualPlayerController() {
    drawManualPlayer();
    updateManualPlayer();
}

// Exporter des fonctions ou des objets nécessaires pour votre application principale
export { manualPlayerController, setCanvas };