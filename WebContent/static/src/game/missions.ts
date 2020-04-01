/************************************************
################# CONSTANTS #####################
************************************************/

var playTime:number;
var points:number;

var countdown:number;
var targetPoints:number;

var mission_startTime:number;
var mission_timeDiff:number;

var mission_done:boolean = false;
var mission_loose_string:string;

/************************************************
################## METHODS ######################
************************************************/

/***********************************
# init Missions
***********************************/
function initMissions(){
	
}

/***********************************
# update missions
***********************************/
function updateMissions(){
	

	checkMissions();
}

/***********************************
# check if conditions are met
***********************************/
function checkMissions(){
	
}


/***********************************
# draw time
***********************************/
function drawTime(){
	//inputs
	ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
	
	ctx.fillText("Time: " + playTime, 40, 30);
	
}


/***********************************
# draw points
***********************************/
function drawPoints(){
	//inputs
	ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
	
	ctx.fillText("Points: " + points, 150, 30);
}

