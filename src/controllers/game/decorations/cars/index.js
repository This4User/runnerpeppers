import AbstractDecoration from "../abstractDecoration";
import spritesFactory, {CAR} from "../../spritesFactory";
import {broadcast} from "../../../../utils/eventBus";
import {ADD_BENCH} from "../benches";

class Cars extends AbstractDecoration {
	name = CAR;

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
			broadcast(ADD_BENCH);
		}
	}
}

export default Cars;