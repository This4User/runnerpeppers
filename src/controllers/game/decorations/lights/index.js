import AbstractDecorations from "../abstractDecoration";
import spritesFactory, {LIGHT} from "../../spritesFactory";

class Lights extends AbstractDecorations {
	name = LIGHT;

	addDecorationsLine() {
		if (this.lastDecorationPosition.y > -this.decorationsStorage[0][0].item.height / 2) {
			const leftLight = spritesFactory.getItem(this.name, this.textures);
			leftLight.item.x = 100 - leftLight.item.width / 4;
			leftLight.item.y = -leftLight.item.height * 5 / 4;
			leftLight.item.zIndex = 10;

			const rightLight = spritesFactory.getItem(this.name, this.textures);
			rightLight.item.x = this.sceneWidth - 100 - rightLight.item.width / 3;
			rightLight.item.anchor.x = 0.5;
			rightLight.item.scale.x = -1;
			rightLight.item.y = -rightLight.item.height * 5 / 4;
			leftLight.item.zIndex = 10;

			this.decorationsStorage[0].push(leftLight);
			this.decorationsStorage[1].push(rightLight);

			this.stage.addChild(leftLight.item);
			this.stage.addChild(rightLight.item);
		}
	}
}

export default Lights;