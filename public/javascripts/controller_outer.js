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
        document.getElementById('info-div').style.display = "none";
        iframe.style.position = "absolute"
        iframe.style.top = 0;
        iframe.style.left =0;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
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