class BallBasket {

    x: number;
    y: number;
    radius:number = 30;

    ballRadius:number = 7;
    ballColor:string = 'red';

    ui:boolean;

    constructor(x:number, y:number, ui:boolean){
        this.x = x;
        this.y = y;

        this.ui = ui;
    }

    public update(timeDiff:number){
       
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
                drawCyrcle(this.x+i, this.y+j, this.ballRadius, Ball.colors[ballColor % Ball.colors.length]);
                ballColor++;
            }
		}

    }

    public drawColider(){
        drawCyrcle(this.x, this.y, this.radius+1, 'blue');
    }

    
}