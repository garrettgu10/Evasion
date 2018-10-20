const MAX_SPEED = 1;
const MIN_SPEED = -1;
const UPDATE_RATE = 100; //Milliseconds
const MAZE_SIZE = 31;
const EMPTY = 2;
const UPDATE_INTERVAL = 30;
const PLAYER_RADIUS = 0.2;


var mazeGen = require('./maze/RecursiveMazeGenerator');
var maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
var emptySpots = getEmptySpots(maze);
var players = {};

function setup(app) {
    app.use('/new_game', function(req, res) {
        maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
        var emptySpots = getEmptySpots(maze);
        players = {};
        res.json({status: 'ok'});
    });

    app.use('/get_maze', function (req, res) {
       res.json(maze);
    });
}

function setupSockets(server) {
    let io = require('socket.io').listen(server);
    let display_sock = io.of('/display');
    let control_sock = io.of('/player');
    
    display_sock.on('connection', function(socket) {
        console.log('new display ' + socket.id);
    });

    control_sock.on('connection', function(socket) {
        console.log('new controller ' + socket.id);
        var spotToUse = emptySpots.pop();

        players[socket.id] = {
            x: spotToUse[0] + 0.5, 
            y: spotToUse[1] + 0.5, 
            velX:0, velY:0, 
            accX:0, accY:0
        };

        socket.on('updateAcceleration', function(obj) {
            var {accX, accY} = obj;
            players[socket.id].accX = accX;
            players[socket.id].accY = accY;
        });

        socket.on('disconnect', function(){
            console.log("player disconnected " + socket.id);
            delete players[socket.id];
        });
    });

    setInterval(() => {
        display_sock.emit('updatePlayers', players);
    }, UPDATE_INTERVAL);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function getEmptySpots(maze){
    let emptySpots = [];

    for(let i = 1; i < maze.length - 1; i += 2){
        for(let j = 1; j < maze[0].length - 1; j += 2){
            if(maze[i][j] === EMPTY)
                emptySpots.push([(i - 1) / 2, (j - 1) / 2]);
        }
    }

    shuffleArray(emptySpots);

    return emptySpots;
}

function tick(players, maze) {
    for(let key in players){
        currPlayer = players[key];
        currPlayer.velX = boundSpeed(currPlayer.velX + currPlayer.accX * UPDATE_RATE / 1000);
        currPlayer.velY = boundSpeed(currPlayer.velY + currPlayer.accY * UPDATE_RATE / 1000);

        let nextX = currPlayer.x + currPlayer.velX * UPDATE_RATE / 1000;
        let nextY = currPlayer.y + currPlayer.velY * UPDATE_RATE / 1000;

        if(valid(nextX, nextY, maze)){
            currPlayer.x = nextX;
            currPlayer.y = nextY;
        }
        else if(valid(currPlayer.x, nextY, maze)){
            currPlayer.velX = 0;
            currPlayer.y = nextY;
        }
        else if(valid(nextX, currPlayer.y, maze)){
            currPlayer.velY = 0;
            currPlayer.x = 0;
        }
    }
}

function valid(x, y, maze){
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);

    //TODO
}

function boundSpeed(v){
    return Math.max(Math.min(v, MAX_SPEED), MIN_SPEED);
}
/*
let emptySpots = getEmptySpots(maze);
let currSpot = 0;
for(let key in players){
    players[key] = {x: emptySpots[currSpot][0], y: emptySpots[currSpot][1], velX:0, velY:0, accX:0, accY:0};
    currSpot++;
}
*/

module.exports = {setupRest: setup, setupSockets: setupSockets};