
coordsDiv = document.getElementById('coords');
window.addEventListener("deviceorientation", (event) =>{
    var {beta, gamma} = event;
    beta = Math.round(beta);
    gamma = Math.round(gamma);
    coords.innerHTML = `(${beta}, ${gamma})`;
})