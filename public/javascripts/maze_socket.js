var socket = io('/display');

socket.on('updatePlayers', (players) => {
    draw_players(playerCanvas, players);
})

socket.on('gameOver', () => {
    document.getElementById('music').pause();
    document.getElementById('game-over-sound').play();
})

var startButton = document.getElementById('start-game-button')
startButton.onclick = () => {
    fetch('/start_game');
    startButton.style.display = 'none';
    document.getElementById('music').play();
}