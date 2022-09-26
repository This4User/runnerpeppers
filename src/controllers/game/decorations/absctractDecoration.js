import spritesFactory from "../spritesFactory";

class AbstractDecorations {
	decorationsStorage = [];

	constructor(name, textures, gap, leftAxis, rightAxis, sceneHeight, sceneWidth) {
		this.name = name;
		this.textures = textures;
		this.gap = gap;
		this.leftAxis = leftAxis;
		this.rightAxis = rightAxis;
		this.sceneHeight = sceneHeight;
		this.sceneWidth = sceneWidth;
	}

	initDecorations(isRightSide) {
		const decorations = [spritesFactory.getItem(this.name, this.textures)];

		for (let i = 0; i < this.sceneHeight / decorations[0].item.height; i++) {
			if (isRightSide) {

			} else {

			}
		}
	}

	addDecorationsLine() {

	}

	moveDecorations(speed) {
		this.decorationsStorage.forEach(decArray => {
			decArray.forEach(dec => {
				dec.item.y += speed || 2;
			});
		});
	}

	collectDecorations(edge) {
		this.decorationsStorage.forEach((decArray, index) => {
			decArray.forEach(dec => {
				if (dec.item.y > edge + dec.item.height / 2) {
					this.onItemCollect(this.name, dec.item);
					this.restoreDecoration(dec.item);
				}
			});
		});
	}

	onItemCollect(name, item) {

	}

	restoreDecoration(item) {

	}

	getLastDecorationPosition() {
		const {x, y} = this.decorationsStorage[0][this.decorationsStorage[0].length - 1].item;

		return {x, y};
	}
}