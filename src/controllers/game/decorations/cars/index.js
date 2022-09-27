import AbstractDecoration from "../absctractDecoration";
import spritesFactory, {CAR} from "../../spritesFactory";

class Cars extends AbstractDecoration {
	name = CAR;

	initDecorations(isRightSide) {
		const cars = [spritesFactory.getItem(CAR, this.textures)];
		for (let i = 0; i < this.sceneHeight / cars[0].item.height; i++) {
			if (isRightSide) {
				cars[i].item.x += this.sceneWidth - 100;
			} else {
				cars[i].item.x += 100 - 54;
			}

			cars[i].item.y = cars[i].item.height * 4 * i;
			cars[i].item.zIndex = 10;

			this.stage.addChild(cars[i].item);
			cars.push(spritesFactory.getItem(CAR, this.textures));
		}

		this.decorationsStorage.push(cars);
	}

	addDecorationsLine() {
		if (this.lastDecorationPosition.y > -this.decorationsStorage[0][0].item.height / 2) {
			const leftCar = spritesFactory.getItem(this.name, this.textures);
			leftCar.item.x = 100 - 54;
			leftCar.item.y = -leftCar.item.height * 4;
			leftCar.item.zIndex = 10;

			const rightCar = spritesFactory.getItem(this.name, this.textures);
			rightCar.item.x = this.sceneWidth - 100;
			rightCar.item.y = -rightCar.item.height * 4;

			this.decorationsStorage[0].push(leftCar);
			this.decorationsStorage[1].push(rightCar);

			this.stage.addChild(leftCar.item);
			this.stage.addChild(rightCar.item);
		}
	}

	restoreDecoration(item) {
		item.y = 0;
		item.x = 0;
		item.anchor.x = 0;
		item.scale.x = 1;
	}
}

export default Cars;