var iframe = document.getElementById('iframe');
var requestFullscreen = function (ele) {
	if (ele.requestFullscreen) {
		ele.requestFullscreen();
	} else if (ele.webkitRequestFullscreen) {
		ele.webkitRequestFullscreen();
	} else if (ele.mozRequestFullScreen) {
		ele.mozRequestFullScreen();
	} else if (ele.msRequestFullscreen) {
		ele.msRequestFullscreen();
	} else {
        document.getElementById('button').style.display = "none";
	}
};

var noSleep = new NoSleep();
document.getElementById('button').onclick=() => {
    noSleep.enable();
    iframe.style.display = "inline";
    requestFullscreen(iframe);
    setTimeout(() => {
        if(screen.orientation.lock){
            screen.orientation.lock('landscape-primary');
        }
    }, 100);
}