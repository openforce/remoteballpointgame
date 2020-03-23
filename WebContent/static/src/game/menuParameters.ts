/************************************************
################# VARIABLES #####################
************************************************/

var input_speed:CanvasInput;
var input_time:CanvasInput;

var input_items:CanvasInput;
var input_teamMembers:CanvasInput;

var input_target_points:CanvasInput;


/************************************************
################## METHODS ######################
************************************************/

/***********************************
# Init the menu elements
***********************************/
function initMenuParameters(){
	
	// INIT game parameters
	input_speed	= new CanvasInput({
	  canvas: canvas,
	  x: 150,
	  y: 150,
	  width: 50,
	  value: 1
	});
	
	input_time	= new CanvasInput({
	  canvas: canvas,
	  x: 350,
	  y: 150,
	  width: 50,
	  value: 1000
	});
	
	input_items = new CanvasInput({
	  canvas: canvas,
	  x: 150,
	  y: 200,
	  width: 50,
	  value: 3
	});
	
	input_teamMembers = new CanvasInput({
		  canvas: canvas,
		  x: 350,
		  y: 200,
		  width: 50,
		  value: 5
		});
	
	
	// INIT targets
	input_target_points = new CanvasInput({
	  canvas: canvas,
	  x: 150,
	  y: 330,
	  width: 50,
	  value: 1000
	});

}


/***********************************
# draw the menu
***********************************/
function drawMenuParameters(){
	
	// DRAW game parameters
	ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
	
	ctx.fillText("SPEED", 20, 170);
	input_speed.render();
	 
	ctx.fillText("TIME", 250, 170);
	input_time.render();
	
	
	ctx.fillText("Workitems", 20, 220);
	input_items.render();

	ctx.fillText("Teamsize", 250, 220);
	input_teamMembers.render();
	
	
	// DRAW targets
	ctx.fillText("Targets", 20, 320);
	
	ctx.fillText("Points", 20, 350);
	input_target_points.render();
	
}


/***********************************
# draw after game params
***********************************/
function drawAfterGameParams(){
	
	//Stats
	ctx.fillStyle = "black";
	ctx.font = "bold 20px Arial";
	
	// Points 
	ctx.fillText("Points: " + points, 20, 170);
	
}

/***********************************
# pass parameters to game
***********************************/
function setParametersFromMenu(){
	
	// SET game parameters
	par_speed = Number(input_speed.value());
	par_time = Number(input_time.value());
	par_items = Number(input_items.value());
	par_teamMembers = Number(input_teamMembers.value());
	
	// SET targets
	par_target_points = Number(input_target_points.value());
   
}

/***********************************
# destroy input fields
***********************************/
function destroyInputs(){
	
	// DESTROY game parameters
	input_speed = null;
	input_time = null;
	input_items = null;
	input_teamMembers = null;
	
	// DESTROY targets
	input_target_points = null;
	
}

/***********************************
# set random values
***********************************/
function setRandomValues(){
	
	// SET random game parameters
	input_speed.setValue(String(getRandomNumber(1, 1)));
	input_time.setValue(String(getRandomNumber(30, 120)));
	input_items.setValue(String(getRandomNumber(1, 20)));
	input_teamMembers.setValue(String(getRandomNumber(2, 8)));
	
	// SET random targets
	input_target_points.setValue(String(getRandomNumber(25, 300)));
	
}

/***********************************
# pass parameters to game
***********************************/
function setParametersFromLevel(level:Level){
	
	par_speed = level.speed;
	par_time = level.time;
	par_items = level.items;
	par_teamMembers = level.teamMembers;
	
	
	par_target_points = level.target_points;

}
