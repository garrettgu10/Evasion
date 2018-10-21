var socket = io('/player');

var updateNeeded = true;
var color = "#000000";

socket.on('color', function(c) {
    color = c;
});

socket.on('win', function() {
    alert('you win!');
})

window.addEventListener("deviceorientation", (event) => {
    if(!updateNeeded) return;

    updateNeeded = false;

    var {beta, gamma} = event;
    var accX = beta / 180 * 2;
    var accY = -gamma / 180 * 2;
    updateCanvas(accX, accY);

    socket.emit('updateAcceleration', {accX: accX, accY: accY});

    setTimeout(() => {
        updateNeeded = true;
    }, 50);
})

var canvas = document.getElementById('canvas');
function updateCanvas(accX, accY) {
    var center = {x: canvas.width/2, y: canvas.height/2}

    var fullLength = center.x * 0.8;
    
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.lineWidth = 30;
    context.strokeStyle = color;
    
    context.beginPath();
    context.moveTo(center.x, center.y);
    context.lineTo(center.x + accX * fullLength, center.y + accY * fullLength);
    context.stroke();
}