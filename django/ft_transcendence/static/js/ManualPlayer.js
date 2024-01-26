// touches du clavier
const keyState = {};

// mise à jour de l'état des touches
function handleKeydown(event) {
    keyState[event.key] = true;
}

function handleKeyup(event) {
    keyState[event.key] = false;
}

// gestionnaires d'événements pour les touches du clavier
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);


// Mise à jour de la position du joueur manuel
function updateManualPlayer(Player) {
    if (keyState[Player.KeyUp] && Player.PosY > 0)
        Player.PosY -= Player.Speed;
    if (keyState[Player.KeyDown] && Player.PosY + Player.Height < canvas.height)
        Player.PosY += Player.Speed;
}
