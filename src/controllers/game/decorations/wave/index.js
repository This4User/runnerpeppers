import AbstractDecoration from "../abstractDecoration";
import spritesFactory, {WAVE} from "../../spritesFactory";

class Wave extends AbstractDecoration {
	name = WAVE;
	animationSpeed = 0.5;
	isAnimationUp = false;
	animationDelta = 0;
	allowedAnimationDelta = 32;

	initDecorations() {
		for (let i = 0; i < 2; i++) {
			const wave = spritesFactory.getItem(this.name, this.textures);
			wave.item.y = this.sceneHeight - wave.item.height + this.allowedAnimationDelta;

			if (i === 0) {
				wave.item.x = 0;
			} else {
				wave.item.x = -(this.sceneWidth);
			}
			wave.item.zIndex = 20;

			this.stage.addChild(wave.item);
			this.decorationsStorage.push(wave);
		}
	}

	moveDecorations(speed) {
		this.decorationsStorage.forEach(wave => {
			wave.item.x += speed || 2;
			if (this.animationDelta <= this.allowedAnimationDelta) {
				if (this.isAnimationUp) {
					wave.item.y -= speed / 10 || this.animationSpeed;

				} else {
					wave.item.y += speed / 10 || this.animationSpeed;
				}
			}
			this.animationDelta += speed / 10 || this.animationSpeed;
			if (this.animationDelta >= this.allowedAnimationDelta) {
				this.animationDelta = 0;
				this.isAnimationUp = !this.isAnimationUp;
			}
		});
	}

	addDecorations() {
		if ((this.lastDecorationPosition.x > this.sceneWidth / 3) && this.decorationsStorage.length <= 2) {
			const wave = spritesFactory.getItem(this.name, this.textures);
			wave.item.y = this.sceneHeight - wave.item.height + this.allowedAnimationDelta;
			wave.item.x = -(wave.item.width + this.sceneWidth / 4);
			wave.item.zIndex = 20;
			this.decorationsStorage.push(wave);
			this.stage.addChild(wave.item);
		}
	}

	collectDecorations() {
		this.decorationsStorage.forEach(wave => {
			if (wave.item.x > this.sceneWidth) {
				this.decorationsStorage = this.decorationsStorage.filter(({id}) => id !== wave.id);
				this.restoreDecoration(wave.item);
				this.stage.removeChild(wave.item);
				spritesFactory.returnItem(this.name, wave);
			}
		});
	}

	restoreDecoration(item) {
		item.x = item.width / 2;
	}

	get lastDecorationPosition() {
		const {x, y} = this.decorationsStorage[0].item;
		return {x, y};
	}
}

export default Wave;