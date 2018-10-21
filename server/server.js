const MAX_SPEED = 1;
const MIN_SPEED = -1;
const UPDATE_RATE = 30; //Milliseconds
const MAZE_SIZE = 31;
const BLOCKS = (MAZE_SIZE-1)/2;
const WALL = 0;
const GRAY = 1;
const EMPTY = 2;
const UPDATE_INTERVAL = 30;
const PLAYER_RADIUS = 0.2;
const RESTITUTION = 0.8;

var mazeGen = require('./maze/RecursiveMazeGenerator');
var sio = require('socket.io');
var md5 = require('md5');

var maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
var emptySpots = getEmptySpots(maze);
var players = {};
var gameStarted = false;

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

//returns whether or not a block is a chaser block
function isChaser(x, y) {
    return (x >= BLOCKS/3) && (x < BLOCKS*2/3) && (y >= BLOCKS/3) && (y < BLOCKS*2/3);
}

function setup(app) {
    app.use('/new_game', function(req, res) {
        maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
        var emptySpots = getEmptySpots(maze);
        
        //place players in new empty spots
        for(var key in players) {
            var spotToUse = emptySpots.pop();
            players[key] = {
                x: spotToUse[0] + 0.5, 
                y: spotToUse[1] + 0.5, 
                velX:0, velY:0, 
                accX:0, accY:0,
                color: players[key].color,
                chaser: isChaser(...spotToUse)
            }
        }

        gameStarted = false;

        res.json({status: 'ok'});
    });

    app.use('/get_maze', function (req, res) {
       res.json(maze);
    });

    app.use('/start_game', function(req, res) {
        gameStarted = true;
        res.json({status: 'ok'})
    })
}

function getColor(id) {
    if(colorArray.length === 0){ //out of colors, use md5
        return '#'+md5(id).substring(0, 6);
    }else{
        return colorArray.pop();
    }
}

function setupSockets(server) {
    let io = sio.listen(server);
    let display_sock = io.of('/display');
    let control_sock = io.of('/player');
    
    display_sock.on('connection', function(socket) {
        console.log('new display ' + socket.id);
    });

    control_sock.on('connection', function(socket) {
        console.log('new controller ' + socket.id);
        var spotToUse = emptySpots.pop();

        var color = getColor(socket.id);

        players[socket.id] = {
            x: spotToUse[0] + 0.5, 
            y: spotToUse[1] + 0.5, 
            velX:0, velY:0, 
            accX:0, accY:0,
            color: color,
            chaser: isChaser(...spotToUse)
        };

        socket.emit('color', color);

        socket.on('updateAcceleration', function(obj) {
            var {accX, accY} = obj;
            players[socket.id].accX = boundSpeed(accX);
            players[socket.id].accY = boundSpeed(accY);
        });

        socket.on('disconnect', function(){
            console.log("player disconnected " + socket.id);
            delete players[socket.id];
        });
    });

    setInterval(() => {
        if(gameStarted){
            tick();
        }
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

function tick() {
    for(let key in players){
        currPlayer = players[key];
        currPlayer.velX = boundSpeed(currPlayer.velX + currPlayer.accX * UPDATE_RATE / 500);
        currPlayer.velY = boundSpeed(currPlayer.velY + currPlayer.accY * UPDATE_RATE / 500);

        let nextX = currPlayer.x + currPlayer.velX * UPDATE_RATE / 1000;
        let nextY = currPlayer.y + currPlayer.velY * UPDATE_RATE / 1000;

        if(valid(nextX, nextY, maze)){
            currPlayer.x = nextX;
            currPlayer.y = nextY;
        }
        else if(valid(currPlayer.x, nextY, maze)){
            currPlayer.velX = -currPlayer.velX * RESTITUTION;
            currPlayer.y = nextY;
        }
        else if(valid(nextX, currPlayer.y, maze)){
            currPlayer.velY = -currPlayer.velY * RESTITUTION;
            currPlayer.x = nextX;
        }
        else{
            currPlayer.velX = -currPlayer.velX * RESTITUTION;
            currPlayer.velY = -currPlayer.velY * RESTITUTION;
        }
    }
}

function valid(x, y, maze){
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);

    let expX = floorX * 2 + 1;
    let expY = floorY * 2 + 1;

    if(expX < 0 || expY < 0) return false;
    if(expX >= maze.length || expY >= maze[0].length) return false;

    var b1 = x - floorX < PLAYER_RADIUS;
    var b2 = floorX + 1 - x < PLAYER_RADIUS;
    var b3 = y - floorY < PLAYER_RADIUS;
    var b4 = floorY + 1 - y < PLAYER_RADIUS;

    //If left side has a wall and goes across                      OR    right side has a wall and goes across
    if((maze[expX][expY-1] === WALL && b3) || (maze[expX][expY+1] === WALL && b4)) {
        return false;
    }
    if((maze[expX-1][expY] === WALL && b1) || (maze[expX+1][expY] === WALL && b2)) {
        return false;
    }

    //Corners


    //    _|   |_
    //    _  u  _
    //     |   |

    if((expY - 2 > 0 && maze[expX-1][expY-2] === WALL && b1 && b3)                              //Upper left west
        || (expY + 2 < maze[0].length && (maze[expX-1][expY+2] === WALL) && b1 && b4))          //Upper left north
        return false;


    if((expY - 2 > 0 && maze[expX+1][expY-2] === WALL && b2 && b3)                              //Upper right north
        || (expY + 2 < maze[0].length && (maze[expX+1][expY+2] === WALL) && b2 && b4))          //Upper right east
        return false;


    if((expX - 2 > 0 && maze[expX-2][expY-1] === WALL && b1 && b3)                              //Lower right east
        || (expX - 2 > 0 && (maze[expX-2][expY+1] === WALL && b1 && b4)))                       //Lower right south
        return false;


    if((expX + 2 < maze.length && maze[expX+2][expY-1] === WALL && b2 && b3)                    //Lower left south
        || (expX + 2 < maze.length && (maze[expX+2][expY+1] === WALL && b2 && b4)))             //Lower left west
        return false;
    }


    return true;
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