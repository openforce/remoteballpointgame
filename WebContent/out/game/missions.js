/************************************************
################# CONSTANTS #####################
************************************************/
var playTime;
var points;
var countdown;
var targetPoints;
var mission_startTime;
var mission_timeDiff;
var mission_done = false;
var mission_loose_string;
/************************************************
################## METHODS ######################
************************************************/
/***********************************
# init Missions
***********************************/
function initMissions() {
    playTime = 0;
    points = 0;
    mission_done = false;
    if (par_time > 0) {
        countdown = par_time * 1000; // Seconds
    }
    targetPoints = 100;
    var now = new Date();
    mission_startTime = now.getTime();
}
/***********************************
# update missions
***********************************/
function updateMissions() {
    var now = new Date();
    var time = now.getTime();
    if (par_time > 0) {
        playTime = Math.round((countdown - (time - mission_startTime)) / 1000);
    }
    else {
        playTime = Math.round((time - mission_startTime) / 1000);
    }
    checkMissions();
}
/***********************************
# check if conditions are met
***********************************/
function checkMissions() {
    // Punkte erreicht
    if (par_target_points > 0 && points >= par_target_points) {
        mission_done = true;
        endGame();
    }
    // Punkte - Zeit abgelaufen
    if (par_target_points > 0 && par_time > 0 && playTime <= 0) {
        mission_loose_string = 'Zeit abgelaufen';
        endGame();
    }
    // Zeit geschafft
    /*
    if(par_time > 0 && playTime <= 0 &&
       par_target_points == 0 && par_target_length == 0){
       
        mission_done = true;
        endGame();
    }*/
}
/***********************************
# draw time
***********************************/
function drawTime() {
    //inputs
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Time: " + playTime, 40, 30);
}
/***********************************
# draw points
***********************************/
function drawPoints() {
    //inputs
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Points: " + points, 150, 30);
}
//# sourceMappingURL=missions.js.map