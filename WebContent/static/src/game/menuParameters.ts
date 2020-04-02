/************************************************
################# VARIABLES #####################
************************************************/



/************************************************
################## METHODS ######################
************************************************/

/***********************************
# Init the menu elements
***********************************/
function initMenuParameters(){
	
	

}


/***********************************
# draw the menu
***********************************/
function drawMenuParameters(x:number, y:number){
	
	// DRAW game parameters
	ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
	
	ctx.fillText("Name", x, y);
	//input_name.render();
	 
	
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
	//par_name = String(input_name.value());
	
}

/***********************************
# destroy input fields
***********************************/
function destroyInputs(){
	
	// DESTROY game parameters
	//input_name = null;
	
}

/***********************************
# set random values
***********************************/
function setRandomValues(){
	
	// SET random game parameters
	//input_speed.setValue(String(getRandomNumber(1, 1)));
	
}

/***********************************
# pass parameters to game
***********************************/
function setParametersFromLevel(level:Level){
	
	

}
