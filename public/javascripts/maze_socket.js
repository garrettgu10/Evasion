var socket = io('/display');

socket.on('updatePlayers', (players) => {
    draw_players(playerCanvas, players);
})

var startButton = document.getElementById('start-game-button')
startButton.onclick = () => {
    fetch('/start_game');
    startButton.style.display = 'none';
}