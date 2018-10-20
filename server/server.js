const MAX_SPEED = 1;
const MIN_SPEED = -1;
const UPDATE_RATE = 100; //Milliseconds
const MAZE_SIZE = 101;
const EMPTY = 2;

var mazeGen = require('./maze/RecursiveMazeGenerator');
var maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
var players = {};

function setup(app) {
    app.use('/new_game', function(req, res) {
        maze = mazeGen(MAZE_SIZE, MAX_SIZE);
        players = {};
    });

    app.use('/get_maze', function (req, res) {
       res.json(maze);
    });

    setupSockets(app);
}

function setupSockets(app) {
    let http = require('http').Server(app);
    let io = require('socket.io');
    let display_sock = io.of('/display');
    let control_sock = io.of('/controller');

    display_sock.on('connection', function(socket) {
        console.log('new display ' + socket.id);
    });

    control_sock.on('connection', function(socket) {
        console.log('new controller ' + socket.id);
    })
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

    for(let i = 1; i < maze.length - 1; i++){
        for(let j = 1; j < maze[0].length - 1; j++){
            if(maze[i][j] === EMPTY)
                emptySpots.push([i, j]);
        }
    }

    shuffleArray(emptySpots);

    return emptySpots;
}

/*
let emptySpots = getEmptySpots(maze);
let currSpot = 0;
for(let key in players){
    players[key] = {x: emptySpots[currSpot][0], y: emptySpots[currSpot][1], velX:0, velY:0, accX:0, accY:0};
    currSpot++;
}
*/

module.exports = setup;