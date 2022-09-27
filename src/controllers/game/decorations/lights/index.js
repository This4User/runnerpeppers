import AbstractDecorations from "../absctractDecoration";
import spritesFactory, {LIGHT} from "../../spritesFactory";

class Lights extends AbstractDecorations {
	name = LIGHT;

	initDecorations(isRightSide) {
		const lights = [spritesFactory.getItem(this.name, this.textures)];
		for (let i = 0; i < this.sceneHeight / lights[0].item.height; i++) {
			if (isRightSide) {
				lights[i].item.x += this.sceneWidth - 100 - lights[i].item.width / 3;
				lights[i].item.anchor.x = 0.5;
				lights[i].item.scale.x = -1;
			} else {
				lights[i].item.x += 100 - lights[i].item.width / 4;
			}

			lights[i].item.y = (lights[i].item.height - lights[i].item.height / 4) * i - lights[i].item.height * 3 / 4;
			lights[i].item.zIndex = 10;
			this.stage.addChild(lights[i].item);
			lights.push(spritesFactory.getItem(this.name, this.textures));
		}

		this.decorationsStorage.push(lights);
	}

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

	restoreDecoration(item) {
		item.y = 0;
		item.x = 0;
		item.anchor.x = 0;
		item.scale.x = 1;
	}
}

export default Lights;