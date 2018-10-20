const WALL_WIDTH = 3;
const EMPTY = 2;
const WALL = 0;
const GRAY = 1;
const TEST_ARRAY = [ [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0 ],
    [ 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0 ],
    [ 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0 ],
    [ 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0 ],
    [ 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0 ],
    [ 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0 ],
    [ 0, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0 ],
    [ 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0 ],
    [ 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0 ],
    [ 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0 ],
    [ 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0 ],
    [ 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] ];

const TEST_PLAYERS = [
    {
        x: 50,
        y: 50,
        color: "#ff0000"
    },
    {
        x: 25, 
        y: 25,
        color: "#00ff00"
    }
]

const PLAYER_MAX_X = 100;
const PLAYER_MAX_Y = 100;
const PLAYER_RADIUS = 10;

const GRAY_COLOR = "#BFBFBF";
const BLACK_COLOR = "#000000";

function draw_maze(context, maze, players = []){
    var width = maze.length;
    var height = maze[0].length;
    var canvasHeight = canvas.height;
    var canvasWidth = canvas.width;

    var blockHeight = canvasHeight / Math.floor(height/2);
    var blockWidth = canvasWidth / Math.floor(width/2);

    context.lineWidth = WALL_WIDTH;
    
    //draw vertical walls
    //have even x, odd y
    for(var x = 0; x < width; x+=2){
        for(var y = 1; y < height; y+=2){
            if(maze[x][y] === EMPTY){
                console.log("no wall at " + x + ", " + y);
                continue;
            }
            context.strokeStyle= (maze[x][y] === GRAY) ? GRAY_COLOR : BLACK_COLOR;
            
            var lineX = Math.floor(x/2) * blockWidth;
            var lineStartY = Math.floor((y-1)/2) * blockHeight;
            var lineEndY = lineStartY + blockHeight;

            context.beginPath();
            context.moveTo(lineX, lineStartY);
            context.lineTo(lineX, lineEndY);
            console.log("Hi");
            // context.moveTo(lineStartY, lineX);
            // context.lineTo(lineEndY, lineX);
            context.stroke();
        }
    }

    //draw horizontal walls
    //have even y, odd x
    for(var y = 0; y < width; y+=2){
        for(var x = 1; x < height; x+=2){
            if(maze[x][y] === EMPTY){
                console.log("no wall at " + x + ", " + y);
                continue;
            }
            context.strokeStyle= (maze[x][y] === GRAY) ? GRAY_COLOR : BLACK_COLOR;

            var lineY = Math.floor((y)/2) * blockHeight;
            var lineStartX = Math.floor((x - 1)/2) * blockWidth;
            var lineEndX = lineStartX + blockHeight;

            context.beginPath();
            context.moveTo(lineStartX, lineY);
            context.lineTo(lineEndX, lineY);
            // context.moveTo(lineStartY, lineX);
            // context.lineTo(lineEndY, lineX);
            context.stroke();
        }
    }

    //draw players
    for(var player of players) {
        var x = player.x / PLAYER_MAX_X * canvasWidth;
        var y = player.y / PLAYER_MAX_Y * canvasHeight;
        
        var rad = PLAYER_RADIUS;
        var color = player.color || "#000000";

        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, rad, 0, 2*Math.PI);
        context.fill();
        
    }
}


console.log('loaded');
var canvas = document.getElementById("maze_canvas");
console.log(canvas);

draw_maze(canvas.getContext('2d'), TEST_ARRAY , TEST_PLAYERS);