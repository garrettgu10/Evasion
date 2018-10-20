var socket = io.connect('/display');

io.on('updatePlayers', (players) => {
    draw_players(playerCanvas, players);
})