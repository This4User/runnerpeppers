import {Sprite} from "pixi.js";
import AbstractFactory from "../../../../utils/abstractFactory";
import {nanoid} from "@reduxjs/toolkit";

export const HERO = "hero";
export const ENEMY = "enemy";

class SpritesFactory extends AbstractFactory {
	getItem(name) {
		return super.getItem(name);
	}

	returnItem(name, item) {
		super.returnItem(name, item);
	}

	getHero(texture) {
		const item = this.getItem(HERO);

		if (item) {
			return item;
		} else {
			return {
				id: nanoid(),
				item: new Sprite.from(texture),
			};
		}
	}

	returnHero(hero) {
		this.returnItem(HERO, hero);
	}

	getEnemy = (texture) => {
		const item = this.getItem(ENEMY);

		if (item) {
			return item;
		} else {

			return {
				id: nanoid(),
				item: new Sprite.from(texture)
			};
		}
	};

	returnEnemy(enemy) {
		this.returnItem(ENEMY, enemy);
	}
}

export default new SpritesFactory();