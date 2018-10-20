const WALL_WIDTH = 3;
const EMPTY = 2;
const WALL = 0;
const GRAY = 1;
const TEST_ARRAY = [
    [0, 0, 0, 0, 0],
    [0, 2, 1, 2, 0],
    [0, 1, 0, 1, 0],
    [0, 2, 1, 2, 0],
    [0, 0, 0, 0, 0]
]

const GRAY_COLOR = "#BFBFBF";
const BLACK_COLOR = "#000000";

function draw_maze(context, maze){
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

            console.log(lineX, lineStartY, lineEndY);

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
}


console.log('loaded');
var canvas = document.getElementById("maze_canvas");
console.log(canvas);
draw_maze(canvas.getContext('2d'), TEST_ARRAY);