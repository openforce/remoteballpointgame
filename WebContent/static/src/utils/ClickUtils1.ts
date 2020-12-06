import { ICollidableRect } from '../interfaces/ICollidable';

export class ClickUtils {


	static checkClickOnRectObject(mouseX: number, mouseY: number, object: ICollidableRect): boolean {

		if (mouseX > object.x && mouseX < object.x + object.width &&
			mouseY > object.y && mouseY < object.y + object.height) {

			return true;

		} else {
			return false;
		}

	}

}



