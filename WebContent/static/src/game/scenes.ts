/************************************************
################# VARIABLES #####################
************************************************/


/************************************************
################## METHODS ######################
************************************************/

/***********************************
# INIT the scene menu elements
***********************************/
function initScenes(){
	
	// first scene
	gameEngine.sceneMenuController.scenes.push(new Scene(50, 150, 1, 'Intro', false));
	gameEngine.sceneMenuController.loadSceneStats();
	
}		