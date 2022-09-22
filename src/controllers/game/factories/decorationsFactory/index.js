import {Sprite} from "pixi.js";
import AbstractFactory from "../../../../utils/abstractFactory";
import {nanoid} from "@reduxjs/toolkit";

const LIGHT = "light";

class DecorationsFactory extends AbstractFactory {
	getItem(name) {
		return super.getItem(name);
	}

	returnItem(name, item) {
		super.returnItem(name, item);
	}

	getLight(texture) {
		const item = this.getItem(LIGHT);

		if (item) {
			return item;
		} else {
			return {
				id: nanoid(),
				item: new Sprite.from(texture)
			};
		}
	}

	returnLight(item) {
		this.returnItem(LIGHT, item);
	}
}

export default new DecorationsFactory();