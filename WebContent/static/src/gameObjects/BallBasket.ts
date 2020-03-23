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
        if(drawColliders) this.drawBasketColider();
        drawCyrcle(this.x, this.y, this.radius, 'chocolate');

        //balls
        for(var i = -12; i <= 12; i+=12){
            for(var j = -12; j <= 12; j+=12){
                drawCyrcle(this.x+i, this.y+j, this.ballRadius, this.ballColor);
            }
		}

    }

    public drawBasketColider(){
        drawCyrcle(this.x, this.y, this.radius+1, 'blue');
    }

    
}