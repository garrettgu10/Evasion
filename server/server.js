const MAX_SPEED = 1;
const MIN_SPEED = -1;
const UPDATE_RATE = 30; //Milliseconds
const MAZE_SIZE = process.env.SIZE || 31;
const BLOCKS = (MAZE_SIZE-1)/2;
const WALL = 0;
const GRAY = 1;
const EMPTY = 2;
const UPDATE_INTERVAL = 30;
const PLAYER_RADIUS = 0.2;
const RESTITUTION = 0.6;
const CHASER_RATIO = 0.4;

var mazeGen = require('./maze/RecursiveMazeGenerator');
var sio = require('socket.io');
var md5 = require('md5');

var maze = mazeGen(MAZE_SIZE, MAZE_SIZE);
var emptySpots = getEmptySpots(maze);
var players = {};
var socketHandlers = {};
var gameStarted = false;

var colorArray = ['#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#99E6E6', '#6666FF'];

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
            };
        }

        gameStarted = false;

        res.json({status: 'ok'});
    });

    app.use('/get_maze', function (req, res) {
       res.json(maze);
    });

    app.use('/start_game', function(req, res) {
        let centerX = (BLOCKS / 2);
        let centerY = (BLOCKS / 2);
        let center_players = [];

        for(var key in players) {
            center_players.push(players[key]);
        }

        function getDist(p) {
            return (p.x  - centerX) * (p.x - centerX) + (p.y - centerY) * (p.y - centerY);
        }

        function cmp(p1, p2){
            let dist1 = getDist(p1);
            let dist2 = getDist(p2);
            return dist1 - dist2;
        }

        center_players.sort(cmp);

        let num_chasers = Math.max(Math.floor(center_players.length * CHASER_RATIO), 1);
        for(let i = 0; i < center_players.length; i++){
            if(i < num_chasers){
                center_players[i].chaser = true;
            }
            else{
                center_players[i].chaser = false;
            }
        }

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

var io, display_sock, control_sock;

function setupSockets(server) {
    io = sio.listen(server);
    display_sock = io.of('/display');
    control_sock = io.of('/player');
    
    display_sock.on('connection', function(socket) {
        console.log('new display ' + socket.id);
    });

    control_sock.on('connection', function(socket) {
        if(gameStarted) {
            socket.emit('reject', "Game has already started, you can't join");
            socket.disconnect();
            return;
        }
        console.log('new controller ' + socket.id);
        var spotToUse = emptySpots.pop();

        var color = getColor(socket.id);

        players[socket.id] = {
            x: spotToUse[0] + 0.5, 
            y: spotToUse[1] + 0.5, 
            velX:0, velY:0, 
            accX:0, accY:0,
            color: color,
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

        socketHandlers[socket.id] = socket;
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
        currPlayer.velX = boundSpeed(currPlayer.velX + currPlayer.accX * UPDATE_RATE / 250);
        currPlayer.velY = boundSpeed(currPlayer.velY + currPlayer.accY * UPDATE_RATE / 250);

        if(!valid(currPlayer.x, currPlayer.y, maze, currPlayer)){
            let offset = [-1, 0, 1];
            found = false;
            for(let i = 0; i < offset.length && !found; i++){
                for(let j = 0; j < offset.length && !found; j++){
                    if(valid(currPlayer.x + offset[i] * PLAYER_RADIUS, currPlayer.y + offset[j] * PLAYER_RADIUS, maze, currPlayer)){
                        currPlayer.x = currPlayer.x + offset[i] * PLAYER_RADIUS;
                        currPlayer.y = currPlayer.y + offset[j] * PLAYER_RADIUS;
                        found = true;
                    }
                }
            }
        }

        let nextX = currPlayer.x + currPlayer.velX * UPDATE_RATE / 1000;
        let nextY = currPlayer.y + currPlayer.velY * UPDATE_RATE / 1000;

        if(valid(nextX, nextY, maze, currPlayer)){
            currPlayer.x = nextX;
            currPlayer.y = nextY;
        }
        else if(valid(currPlayer.x, nextY, maze, currPlayer)){
            currPlayer.velX = -currPlayer.velX * RESTITUTION;
            currPlayer.y = nextY;
        }
        else if(valid(nextX, currPlayer.y, maze, currPlayer)){
            currPlayer.velY = -currPlayer.velY * RESTITUTION;
            currPlayer.x = nextX;
        }
        else{
            currPlayer.velX = -currPlayer.velX * RESTITUTION;
            currPlayer.velY = -currPlayer.velY * RESTITUTION;
        }
        playerCollision(currPlayer, players);
    }
}

function playerCollision(currPlayer, players) {
    var infectionHappened = false;
    for(let key in players) {
        if (currPlayer.chaser && !players[key].chaser && distance(currPlayer, players[key]) < 4 * PLAYER_RADIUS * PLAYER_RADIUS) {
            players[key].chaser = true;
            infectionHappened = true;
        }
    }

    if(infectionHappened) {
        console.log('infection');
        var nonChaserCount = 0;
        var nonChaserId = null;
        for(let key in players) {
            var player = players[key];
            
            if(!player.chaser) {
                nonChaserId = key;
                nonChaserCount++;
                if(nonChaserCount >= 2) {
                    return;
                }
            }
        }

        if(nonChaserCount === 1) {
            console.log("winner: " + nonChaserId);
            socketHandlers[nonChaserId].emit('win');
            display_sock.emit('gameOver');

            gameStarted = false;
        }
    }

}
function distance(player1, player2) {
    return (player1.x - player2.x) * (player1.x - player2.x) + (player1.y - player2.y)*(player1.y - player2.y);
}

function valid(x, y, maze, player) {
    let floorX = Math.floor(x);
    let floorY = Math.floor(y);

    let expX = floorX * 2 + 1;
    let expY = floorY * 2 + 1;

    if (expX < 0 || expY < 0) return false;
    if (expX >= maze.length || expY >= maze[0].length) return false;

    var b1 = x - floorX < PLAYER_RADIUS;
    var b2 = floorX + 1 - x < PLAYER_RADIUS;
    var b3 = y - floorY < PLAYER_RADIUS;
    var b4 = floorY + 1 - y < PLAYER_RADIUS;

    let comparison;
    if (!player.chaser) {
        comparison = GRAY;
    } else {
        comparison = EMPTY;
    }
    //If left side has a wall and goes across                      OR    right side has a wall and goes across
    if ((maze[expX][expY - 1] < comparison && b3) || (maze[expX][expY + 1] < comparison && b4)) {
        return false;
    }
    if ((maze[expX - 1][expY] < comparison && b1) || (maze[expX + 1][expY] < comparison && b2)) {
        return false;
    }

    //Corners


    //    _|   |_
    //    _  u  _
    //     |   |

    if ((expY - 2 > 0 && maze[expX - 1][expY - 2] < comparison && b1 && b3)                              //Upper left west
        || (expY + 2 < maze[0].length && maze[expX - 1][expY + 2] < comparison && b1 && b4)) {         //Upper left north
        return false;
    }


    if ((expY - 2 > 0 && maze[expX + 1][expY - 2] < comparison && b2 && b3)                              //Upper right north
        || (expY + 2 < maze[0].length && maze[expX + 1][expY + 2] < comparison && b2 && b4)) {         //Upper right east
        return false;
    }

    if ((expX - 2 > 0 && maze[expX - 2][expY - 1] < comparison && b1 && b3)                              //Lower right east
        || (expX - 2 > 0 && maze[expX - 2][expY + 1] < comparison && b1 && b4)) {     //Lower right south
        return false;
    }

    if((expX + 2 < maze.length && maze[expX+2][expY-1] < comparison && b2 && b3)                    //Lower left south
        || (expX + 2 < maze.length && maze[expX+2][expY+1] < comparison && b2 && b4)) {             //Lower left west
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