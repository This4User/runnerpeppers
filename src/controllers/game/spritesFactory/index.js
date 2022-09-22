import {Sprite} from "pixi.js";
import AbstractFactory from "../../../utils/abstractFactory";
import {nanoid} from "@reduxjs/toolkit";

export const HERO = "hero";
export const ENEMY = "enemy";
export const BONUS = "bonus";
export const LIGHT = "light";

class SpritesFactory extends AbstractFactory {
	getItem(name, options) {
		const item = super.getItem(name);
		return item ? item : this.createItem(options);
	}

	returnItem(name, item) {
		super.returnItem(name, item);
	}

	createItem(options) {
		return {
			id: nanoid(),
			item: new Sprite.from(options)
		};
	}
}

export default new SpritesFactory();