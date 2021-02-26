import { runInThisContext } from 'vm';
import { ICollidableRect } from '../interfaces/ICollidable';
import { ClickUtils } from '../utils/ClickUtils1';

export class Button implements ICollidableRect {

	x: number;
	y: number;
	width: number;
	height: number;

	text: string;

	textColor: string = 'black';
	textFont: string = 'bold 10px Arial';

	visible: boolean;
	disabled: boolean;

	constructor(x: number, y: number, width: number, height: number, text: string) {

		this.text = text;

		this.x = x;
		this.y = y;

		this.width = width;
		this.height = height;

		this.visible = true;
		this.disabled = false;
	}

	public click(object: object): void {

	};

	public show() {
		this.visible = true;
	};

	public hide() {
		this.visible = false;
	};

	public disable() {
		this.disabled = true;
	};

	public enable() {
		this.disabled = false;
	};

	public checkForClick(mouseX: number, mouseY: number): boolean {

		if (this.visible && !this.disabled && ClickUtils.checkClickOnRectObject(mouseX, mouseY, this)) {
			return true;
		}

	};

	public drawSprite(ctx: CanvasRenderingContext2D, sprite: CanvasImageSource, spriteWidth: number, spriteHeight: number) {

		ctx.drawImage(sprite,
			0, 0, spriteWidth, spriteHeight, 		  // sprite cutout position and size
			this.x, this.y, this.width, this.height); // draw position and size

	}

	public draw(ctx: CanvasRenderingContext2D) {
		if (this.visible) {

			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.fillRect(this.x, this.y, this.width, this.height);

			if (this.disabled) ctx.fillStyle = "grey";
			else ctx.fillStyle = "lightgrey";

			ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

			ctx.fillStyle = this.textColor;
			ctx.font = this.textFont;
			ctx.fillText(this.text, this.x + 10, this.y + 15);
			ctx.stroke();
			ctx.closePath();
		}
	}

}




