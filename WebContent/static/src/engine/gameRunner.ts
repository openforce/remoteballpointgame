import { GameEngine } from './GameEngine.js';


var canvas: HTMLCanvasElement;
var gameEngine: GameEngine;

/***********************************
 # Some Stuff for the game loop --> ???
 ***********************************/
(function () {
	//var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	//window.requestAnimationFrame = requestAnimationFrame;
})();


/***********************************
 # on load event listener
 ***********************************/
window.addEventListener("load", function () {
	init();
});

/***********************************
# Init main technical components
***********************************/
function init() {

	canvas = document.getElementById("canvas") as HTMLCanvasElement;

	canvas.width = GameEngine.CANVAS_WIDTH;
	canvas.height = GameEngine.CANVAS_HEIGHT;

	gameEngine = new GameEngine();

	// @ts-ignore
	window.gameEngine = gameEngine;


	// INIT input stuff
	window.addEventListener('keydown', keyDown, true);
	window.addEventListener('keyup', keyUp, true);


	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener('mousemove', updateMousePos, false);

	canvas.addEventListener('contextmenu', function (ev) {
		ev.preventDefault();
		return false;
	}, false);

	// INIT client game
	gameEngine.initMenu(canvas);

	mainLoop();
}

function mainLoop() {
	gameEngine.mainLoop();
	requestAnimationFrame(mainLoop);
}

/***********************************
# Input Stuff
***********************************/
function keyDown(evt: KeyboardEvent) {
	gameEngine.inputs.keys[evt.keyCode] = true;

	if (gameEngine.inputs.keysPressedTimeStamp[evt.keyCode] == null) {
		gameEngine.inputs.keysPressedTimeStamp[evt.keyCode] = new Date().getTime();
	}
}

function keyUp(evt: KeyboardEvent) {
	gameEngine.inputs.keys[evt.keyCode] = false;
	gameEngine.inputs.keysPressedTimeStamp[evt.keyCode] = null;
}

/***********************************
# handle mouse click
***********************************/
function mouseDownHandler(evt: MouseEvent) {
	//console.log(evt.which);
	if (evt.which == 1) gameEngine.checkClickEvents(); // left Click
	if (evt.which == 3) gameEngine.checkRightClickEvents(); // right Click
}

/***********************************
# handle mouse up
***********************************/
function mouseUpHandler(evt: MouseEvent) {
	if (evt.which == 1) gameEngine.checkMouseUpEvents();
	if (evt.which == 3) gameEngine.checkMouseRightUpEvents();
}

/***********************************
# get relativ mouse pos
***********************************/
function updateMousePos(evt: MouseEvent) {
	// get canvas position
	var obj: HTMLCanvasElement = canvas;
	var top = 0;
	var left = 0;
	while (obj.tagName != 'BODY') {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent as HTMLCanvasElement;
	}

	// save relative mouse position
	gameEngine.inputs.mousePosX = evt.clientX - left + window.pageXOffset;
	gameEngine.inputs.mousePosY = evt.clientY - top + window.pageYOffset;
}
