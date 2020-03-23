class Level {

    x:number;
    y:number;
    number:number;
    text:string;
    won:boolean;

	speed:number;
	time:number;
	items:number;
	teamMembers:number;
	target_points:number;

    constructor(x:number, y:number, number:number, text:string){
        this.x = x;
        this.y = y;
        this.number = number;
        this.text = text;

        this.won = false;
    }

}