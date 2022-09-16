import spritesFactory from "../spritesFactory";

class Hero {
	getHero(texture) {
		this.hero = spritesFactory.getHero(texture);
		this.hero.item.interactive = true;
		this.hero.item.zIndex = 10;

		this.hero.item.anchor.x = 0.5;
		this.hero.item.scale.x *= -1;

		this.isHeroFlipped = true;

		return this.hero;
	}

	heroAnimation() {
		if (this.isHeroFlipped) {
			this.hero.item.scale.x *= -1;
			this.isHeroFlipped = false;
			setTimeout(() => {
				this.isHeroFlipped = true;
			}, 500);
		}
	}
}

export const gameHero = new Hero();