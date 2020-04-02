class BallBasket {

    x: number;
    y: number;
    radius:number = 30;

    ballRadius:number = 7;
    ballColor:string;

    ui:boolean;

    constructor(x:number, y:number, ui:boolean, ballColor:string){
        this.x = x;
        this.y = y;

        this.ui = ui;

        this.ballColor = ballColor;
    }

    public update(timeDiff:number){
       
    }

    public getNewBall(ui:boolean){
        return new Ball(0, 0, ui, this.ballColor);
    }

    public draw(){
        if(!this.ui) return;

        //Basket
        if(drawColliders) this.drawColider();
        drawCyrcle(this.x, this.y, this.radius+1, 'black');
        drawCyrcle(this.x, this.y, this.radius, 'chocolate');

        //balls
        var ballColor = 0;
        for(var i = -12; i <= 12; i+=12){
            for(var j = -12; j <= 12; j+=12){
                drawCyrcle(this.x+i, this.y+j, this.ballRadius+1, 'black');
                
                if(this.ballColor == null) drawCyrcle(this.x+i, this.y+j, this.ballRadius, Ball.colors[ballColor % Ball.colors.length]);
                else drawCyrcle(this.x+i, this.y+j, this.ballRadius, this.ballColor);

                ballColor++;
            }
		}

    }

    public drawColider(){
        drawCyrcle(this.x, this.y, this.radius+1, 'blue');
    }

    
}