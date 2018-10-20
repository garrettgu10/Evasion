var socket = io('/display');

socket.on('updatePlayers', (players) => {
    draw_players(playerCanvas, players);
})