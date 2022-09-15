import * as PIXI from "pixi.js";
import AbstractFactory from "../../abstractFactory";

class SpritesFactory extends AbstractFactory {
	enemies = [];

	getItem(name, options) {
		super.getItem(name, options);

	}

	getHero(texture) {
		if (!this.hero) {
			return new PIXI.Sprite(texture);
		} else {
			return this.hero;
		}
	}

	returnHero(hero) {
		this.hero = hero;
	}

	getEnemy(texture) {
		if (!this.enemies.length) {
			return new PIXI.Sprite.from(texture);
		} else {
			const enemy = this.enemies[this.enemies.length - 1];
			this.enemies.splice(-1);

			return enemy;
		}
	}

	returnEnemy(enemy) {
		enemy.y = 0;
		enemy.x = 0;
		this.enemies.push(enemy);
	}
}

export default new SpritesFactory();