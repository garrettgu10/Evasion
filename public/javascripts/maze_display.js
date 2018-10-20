const WALL_WIDTH = 3;
const EMPTY = 2;
const WALL = 0;
const GRAY = 1;
const TEST_ARRAY = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0 ],
    [ 0, 2, 2, 2, 1, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 2, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 1, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0 ],
    [ 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0 ],
    [ 0, 0, 0, 2, 0, 0, 0, 0, 1, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0, 1, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 1, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 0, 2, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 0, 1, 2, 0, 2, 0, 2, 1, 0, 0, 0, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 2, 0, 1, 0, 2, 1, 0, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0 ],
    [ 0, 2, 1, 2, 0, 2, 2, 2, 0, 2, 2, 2, 1, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 1, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0 ],
    [ 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0 ],
    [ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 2, 1, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 0, 0, 2, 1, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0 ],
    [ 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0 ],
    [ 0, 0, 1, 2, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 1, 0, 0, 0, 2, 0, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 0, 0, 0, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];

const TEST_PLAYERS = [
    {
        x: 1,
        y: 0.5,
        color: "#ff0000"
    },
    {
        x: 2.5, 
        y: 3,
        color: "#00ff00"
    }
]

const PLAYER_MAX_X = 100;
const PLAYER_MAX_Y = 100;
const PLAYER_RADIUS = 10;

const GRAY_COLOR = "#BFBFBF";
const BLACK_COLOR = "#000000";

var blockHeight, blockWidth;

function draw_maze(canvas, maze){
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var width = maze.length;
    var height = maze[0].length;
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;

    blockHeight = canvasHeight / Math.floor(height/2);
    blockWidth = canvasWidth / Math.floor(width/2);

    context.lineWidth = WALL_WIDTH;
    
    //draw vertical walls
    //have even x, odd y
    for(var x = 0; x < width; x+=2){
        for(var y = 1; y < height; y+=2){
            if(maze[x][y] === EMPTY){
                continue;
            }
            context.strokeStyle= (maze[x][y] === GRAY) ? GRAY_COLOR : BLACK_COLOR;
            
            var lineX = Math.floor(x/2) * blockWidth;
            var lineStartY = Math.floor((y-1)/2) * blockHeight;
            var lineEndY = lineStartY + blockHeight;

            context.beginPath();
            context.moveTo(lineX, lineStartY);
            context.lineTo(lineX, lineEndY);
            // context.moveTo(lineStartY, lineX);
            // context.lineTo(lineEndY, lineX);
            context.stroke();
        }
    }

    //draw horizontal walls
    //have even y, odd x
    for(var y = 0; y < height; y+=2){
        for(var x = 1; x < width; x+=2){
            if(maze[x][y] === EMPTY){
                continue;
            }
            context.strokeStyle= (maze[x][y] === GRAY) ? GRAY_COLOR : BLACK_COLOR;

            var lineY = Math.floor((y)/2) * blockHeight;
            var lineStartX = Math.floor((x - 1)/2) * blockWidth;
            var lineEndX = lineStartX + blockWidth;

            context.beginPath();
            context.moveTo(lineStartX, lineY);
            context.lineTo(lineEndX, lineY);
            // context.moveTo(lineStartY, lineX);
            // context.lineTo(lineEndY, lineX);
            context.stroke();
        }
    }
}

function draw_players(canvas, players){
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;
    //draw players
    for(var player of players) {
        var x = player.x * blockWidth;
        var y = player.y * blockHeight;
        
        var rad = PLAYER_RADIUS;
        var color = player.color || "#000000";

        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, rad, 0, 2*Math.PI);
        context.fill();
        
    }
}

var canvas = document.getElementById("maze_canvas");
var playerCanvas = document.getElementById("player_canvas");


function updateMaze() {
    fetch('/get_maze').then((response) => {
        return response.json();
    }).then((maze) => {
        if(maze){
            draw_maze(canvas, maze);
        }else{
            console.error("invalid maze: " + JSON.stringify(maze));
        }
    }).catch(console.log);
}

function requestNewGame() {
    fetch('/new_game').then(() => {
        updateMaze();
    })
}

updateMaze();

//draw_maze(canvas, TEST_ARRAY);
draw_players(playerCanvas, TEST_PLAYERS);