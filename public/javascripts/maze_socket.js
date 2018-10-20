var socket = io('/display');

io.on('updatePlayers', (players) => {
    draw_players(playerCanvas, players);
})