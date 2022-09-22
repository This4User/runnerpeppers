import {hitTest} from "../../../utils/hitTest";
import bonusesFactory from "../factories/bonusesFactory";

class Bonuses {
	bonuses = [];
	bonusSize;

	connectStage(stage) {
		this.stage = stage;
	}

	addTextures(textures) {
		this.textures = textures;
	}

	addLines(lines) {
		this.lines = lines;
	}

	mapBonuses(greed) {
		greed.forEach((brick) => {
			brick.forEach((cell, cellIndex) => {
				const isBonus = Math.random() < 0.1;

				if (cell === 1 && isBonus) {
					const texture = this.textures.bonus;
					const bonusSprite = bonusesFactory.getBonus(texture);
					this.bonusSize = {
						width: bonusSprite.width,
						height: bonusSprite.height
					};

					bonusSprite.item.anchor.x = 0.5;
					bonusSprite.item.x = this.lines[cellIndex];

					this.bonuses.push(bonusSprite);

					this.stage.addChild(bonusSprite.item);
				}
			});
		});
	};

	moveBonuses(hero, onTouch) {
		this.bonuses.forEach((bonus) => {
			bonus.item.y += 2;
			if (hitTest(hero.item, bonus.item)) {
				bonus.item.width *= 0.5;
				bonus.item.height *= 0.5;
				setTimeout(() => {
					bonus.item.width = this.bonusSize.width;
					bonus.item.height = this.bonusSize.height;
					bonusesFactory.returnBonus(bonus);
					this.bonuses = this.bonuses.filter(({id}) => id !== bonus.id);
					this.stage.removeChild(bonus.item);
					onTouch();
				});
			}
		});
	}

	collectBonuses(edge) {
		this.bonuses.forEach(bonus => {
			if (bonus.item.y > edge + bonus.item.height) {
				bonusesFactory.returnBonus(bonus);
				this.bonuses = this.bonuses.filter(({id}) => id !== bonus.id);
				this.stage.removeChild(bonus.item);
			}
		});
	}

	reset() {
		this.bonuses.forEach(bonus => {
			this.stage.removeChild(bonus.item);
		});
		this.bonuses = [];
	}
}

export default new Bonuses();