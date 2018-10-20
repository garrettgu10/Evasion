const WALL = 0;
const GRAY = 1;
const EMPTY = 2;
var UnionFind = require("./UnionFind.js");

//Pass odd number as rows and columns
function mazeGenerator(rows, columns) {
    var maze = new Array(rows);
    //Initializes maze to all walls around border and all walls at even indexes of rows/columns
    for(let i = 0; i < rows; i++){
        maze[i] = new Array(columns);
        if(i % 2 === 0){
            for(let j = 0; j < columns; j++){
                maze[i][j] = WALL;
            }
        }
        else {
            for(let j = 0; j < columns; j++){
                if(j % 2 === 0)
                    maze[i][j] = WALL;
                else
                    maze[i][j] = EMPTY;
            }
        }
    }

    var smallRows = (rows - 1) / 2;
    var smallCols = (columns - 1) / 2;

    var numComponents = smallRows * smallCols;
    var UF = new UnionFind(numComponents);

    var wallSet = new Array(2 * smallRows * smallCols - smallRows - smallCols);
    var currWall = 0;
    for(let i = 1; i < rows - 1; i++){
        if(i % 2 === 1){
            for(let j = 2; j < columns - 1; j += 2){
                wallSet[currWall] = [i, j];
                currWall++;
            }
        }
        else{
            for(let j = 1; j < columns - 1; j += 2){
                wallSet[currWall] = [i, j];
                currWall++;
            }
        }
    }

    shuffleArray(wallSet);

    for(let i = 0; i < wallSet.length && numComponents > 1; i++){
        var left;
        var right;

        if(wallSet[i][0] % 2 === 1){
            let leftCoord = [wallSet[i][0], wallSet[i][1] - 1];
            let rightCoord = [wallSet[i][0], wallSet[i][1] + 1];

            left = smallCols * (leftCoord[0] - 1) / 2 + (leftCoord[1] - 1) / 2;
            right = smallCols * (rightCoord[0] - 1) / 2 + (rightCoord[1] - 1) / 2;
        }
        else{
            let upCoord = [wallSet[i][0] - 1, wallSet[i][1]];
            let downCoord = [wallSet[i][0] + 1, wallSet[i][1]];

            left = smallCols * (upCoord[0] - 1) / 2 + (upCoord[1] - 1) / 2;
            right = smallCols * (downCoord[0] - 1) / 2 + (downCoord[1] - 1) / 2;
        }

        if(UF.union(left, right)){
            maze[wallSet[i][0]][wallSet[i][1]] = EMPTY;
            numComponents--;
        }
    }

    return maze;
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

console.log(mazeGenerator(21 , 21));
module.exports = mazeGenerator;