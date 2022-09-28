import spritesFactory from "../../spritesFactory";

class AbstractDecorations {
	decorationsStorage = [];
	name;

	constructor(textures, stage, sceneHeight, sceneWidth) {
		this.textures = textures;
		this.stage = stage;
		this.sceneHeight = sceneHeight;
		this.sceneWidth = sceneWidth;
	}

	initDecorations() {
		this.decorationsStorage.push(
			[spritesFactory.getItem(this.name, this.textures)],
			[spritesFactory.getItem(this.name, this.textures)]
		);
	}

	addDecorations() {

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
					this.decorationsStorage[index] = decArray.filter(({id}) => id !== dec.id);
					this.restoreDecoration(dec.item);
					this.stage.removeChild(dec.item);
					spritesFactory.returnItem(this.name, dec);
				}
			});
		});
	}

	restoreDecoration(item) {
		item.y = 0;
		item.x = 0;
		item.anchor.x = 0;
		item.scale.x = 1;
	}

	get lastDecorationPosition() {
		const {x, y} = this.decorationsStorage[0][this.decorationsStorage[0].length - 1].item;
		return {x, y};
	}
}

export default AbstractDecorations;