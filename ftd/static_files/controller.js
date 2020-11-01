stage=null;
view = null;
interval=null;
var up = false;
var down = false;
var left = false;
var right = false;
var pause = false;
var temp_interval = null;

function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('keyup', stopByKey);
	document.addEventListener('keydown', pauseByKey);
	document.addEventListener('keydown', switchWeapon);
	document.addEventListener('mousemove', setDirection);
	document.addEventListener('mousedown', setDirection);
	document.addEventListener('mousedown', fireWeapon);
}
function startGame(){
	interval=setInterval(function(){ if(!pause){ stage.step(); stage.draw(); dxdy_draw(); } },20 );
}

function cleanGame(){
	clearInterval(interval);
	interval=null;
}
function switchWeapon(){
	var key = event.key;
	switch(key){
		case "e":
			if (stage.player != null) {
        		stage.player.switchWeapon();
    		}
			return;
		default:
            return;
	}
}

function pauseByKey(event){
	var key = event.key;
	switch(key){
		case "p":
			if(pause){
				pause = false;
			}else {
				pause = true;
			}
			return;
		default:
            return;
	}
}



function fireWeapon() {
    if (stage.player != null) {
        stage.player.fireWeapon();
    }
}

function setDirection(event) {
    if (stage.player != null) {
        var canvas = document.getElementById('stage');
		var rect = canvas.getBoundingClientRect();
		var x =  event.clientX - rect.left;
		var y = event.clientY - rect.top;
		//var x = event.pageX - canvas.offsetLeft;
        //var y = event.pageY - canvas.offsetTop;
        //var dx = x - stage.player.position.x;
        //var dy = y - stage.player.position.y;
        var dx = x - canvas.width/2;
        var dy = y - canvas.height/2;
        var direction = Math.atan2(dy, dx);
        stage.player.setDirection(direction);
    }
}


function moveByKey(event){
	var key = event.key;
	switch(key){
		case "Unidentified":
            break;
		case "w":
		case "ArrowUp":
			up = true;
			down = false;
			return;
		case "s":
		case "ArrowDown":
			down = true;
			up = false;
			return;
		case "a":
		case "ArrowLeft":
			left = true;
			right = false;
			return;
		case "d":
		case "ArrowRight":
			right = true;
			left = false;
			return;
		default:
            return;
	}
}
function stopByKey(event){
	var key = event.key;
	switch(key){
		case "Unidentified":
            break;
		case "w":
		case "ArrowUp":
			up = false;
			return;
		case "s":
		case "ArrowDown":
			down = false;
			return;
		case "a":
		case "ArrowLeft":
			left = false;
			return;
		case "d":
		case "ArrowRight":
			right = false;
			return;
		default:
            return;
	}
}
function dxdy_draw(){
	var dx = 0;
	var dy = 0;
	if (up){
		dy -= 1;
	} else if (down) {
		dy += 1;
	}
	if (left){
		dx -= 1;
	} else if (right) {
		dx += 1;
	}
	if (stage.player != null) {
		stage.player.move(stage.player, dx, dy);
	}
}