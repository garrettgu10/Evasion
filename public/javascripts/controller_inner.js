var socket = io('/player');

socket.emit('update', {accX: 2, accY: 2});

var updateNeeded = true;
var coordsDiv = document.getElementById('coords');
window.addEventListener("deviceorientation", (event) => {
    if(!updateNeeded) return;

    updateNeeded = false;

    var {beta, gamma} = event;
    var accX = beta / 180 * 2;
    var accY = -gamma / 180 * 2;
    
    coordsDiv.innerHTML = JSON.stringify({accX, accY});

    updateCanvas(accX, accY);

    socket.emit('update', {accX, accY});

    setTimeout(() => {
        updateNeeded = true;
    }, 30);
})

var canvas = document.getElementById('canvas');
function updateCanvas(accX, accY) {
    var center = {x: canvas.width/2, y: canvas.height/2}

    var fullLength = center.x * 0.8;
    
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.lineWidth = 10;
    context.strokeStyle = "#000000";
    
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.lineTo(center.x + accX * fullLength, center.y + accY * fullLength);
    context.stroke();
    console.log(center);
}