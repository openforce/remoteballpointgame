
/************************************************
################# VARIABLES #####################
************************************************/
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

var canvasMidX = CANVAS_WIDTH / 2;
var canvasMidY = CANVAS_HEIGHT / 2;

var body;

var canvas:HTMLCanvasElement;
var ctx:CanvasRenderingContext2D;

var keys:boolean[];

var mousePosX:number;
var mousePosY:number;

var gameEngine:GameEngine;


/************************************************
################## METHODS ######################
************************************************/

/***********************************
 # Some Stuff for the game loop
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
function init(){
	
	// INIT input stuff
	window.addEventListener('keydown', keyDown, true);
	window.addEventListener('keyup', keyUp, true);
	
	canvas = document.getElementById("canvas") as HTMLCanvasElement;
	
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', mouseUpHandler, false);
	canvas.addEventListener('mousemove', updateMousePos, false);

	canvas.addEventListener('contextmenu', function(ev) {
		ev.preventDefault();
		return false;
	}, false);
	
	ctx = canvas.getContext("2d");
	
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	
	keys = [];
	
	// INIT game engine
	gameEngine = new GameEngine();
	gameEngine.init();
}

/***********************************
# Input Stuff
***********************************/
function keyDown(evt:KeyboardEvent) {
	keys[evt.keyCode] = true;
	//alert(evt.keyCode);
}

function keyUp(evt:KeyboardEvent) {
	keys[evt.keyCode] = false;
}

/***********************************
# handle mouse click
***********************************/
function mouseDownHandler(evt:MouseEvent) {
	//updateMousePos(canvas, evt);

	//console.log(evt.which);

	if(evt.which == 1) gameEngine.checkClickEvents(mousePosX, mousePosY); // left Click
	if(evt.which == 3) gameEngine.checkRightClickEvents(mousePosX, mousePosY); // right Click
}

/***********************************
# handle mouse up
***********************************/
function mouseUpHandler(evt:MouseEvent) {

	if(evt.which == 1) gameEngine.checkMouseUpEvents();
	if(evt.which == 3) gameEngine.checkMouseRightUpEvents();
	
}

/***********************************
# get relativ mouse pos
***********************************/
function updateMousePos(evt:MouseEvent) {
	// get canvas position
	var obj:HTMLCanvasElement = canvas;
	var top = 0;
	var left = 0;
	while (obj.tagName != 'BODY') {
		top += obj.offsetTop;
		left += obj.offsetLeft;
		obj = obj.offsetParent as HTMLCanvasElement;
	}

	// save relative mouse position
	mousePosX = evt.clientX - left + window.pageXOffset;
	mousePosY = evt.clientY - top + window.pageYOffset;
	
}
