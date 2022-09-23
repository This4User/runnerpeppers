import spritesFactory, {HERO} from "../spritesFactory";

class Hero {
	getHero(texture) {
		this.hero = spritesFactory.getItem(HERO, texture);
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
			}, 300);
		}
	}

	onHit() {
		let isVisible = true;

		const stepInterval = setInterval(() => {
			isVisible ? this.hero.item.alpha -= 0.1 : this.hero.item.alpha += 0.1;
		}, 25);

		const cycleInterval = setInterval(() => {
			isVisible = !isVisible;
		}, 300);

		setTimeout(() => {
			clearInterval(stepInterval);
			clearInterval(cycleInterval);
			this.hero.item.alpha = 1;
		}, 900);
	}
}

export const gameHero = new Hero();