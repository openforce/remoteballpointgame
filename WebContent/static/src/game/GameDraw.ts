class GameDraw {

	
	constructor(){
		
	}

	
	
	public draw(){
		
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		
		meetingRoom.draw();
		
		for(var i = 0; i < balls.length; i++){
			balls[i].draw();
		}
		
		for(var i = 0; i < ballBaskets.length; i++){
			ballBaskets[i].draw();
		}

		timer.draw();
		flipchart.draw();

		
		for(var i = 0; i < players.length; i++){
			players[i].draw();
		}
		
		player.draw();

		flipchart.drawFlipchartScreen();

		
		drawButtons();
		

		// DRAW Frame and infos
		
		// Frame
		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.fillStyle = 'white';
		ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.closePath();
		
		//drawTime();
		//drawPoints();
		
	}


	
	
	

}






