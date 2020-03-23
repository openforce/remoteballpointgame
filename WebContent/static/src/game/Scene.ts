class Scene {

	x:number;
	y:number;

	id:number;
	text:string;

	unlocked:boolean;

	constructor(x:number, y:number, id:number, text:string, unlocked:boolean){
		this.x = x;
		this.y = y;
		
		this.id = id;
		this.text = text;

		this.unlocked = unlocked;
	}

}