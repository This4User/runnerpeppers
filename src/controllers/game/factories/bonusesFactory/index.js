import AbstractFactory from "../../../../utils/abstractFactory";
import {nanoid} from "@reduxjs/toolkit";
import {Sprite} from "pixi.js";

export const BONUS = "bonus";

class BonusesFactory extends AbstractFactory {
	getItem(name) {
		return super.getItem(name);
	}

	returnItem(name, item) {
		super.returnItem(name, item);
	}

	getBonus = (texture) => {
		const item = this.getItem(BONUS);

		if (item) {
			return item;
		} else {
			return {
				id: nanoid(),
				item: new Sprite.from(texture)
			};
		}
	};

	returnBonus(item) {
		this.returnItem(BONUS, item);
	}
}

export default new BonusesFactory();