import spritesFactory, {ENEMY} from "../spritesFactory";
import {hitTest} from "../../../utils/hitTest";

class Enemies {
	holes = [];
	lastHittedHoleID;

	connectStage(stage) {
		this.stage = stage;
	}

	addTextures(textures) {
		this.textures = textures;
	}

	addLines(lines) {
		this.lines = lines;
	}

	get lastEnemyPosition() {
		if (this.holes.length) {
			const {x, y} = this.holes[this.holes.length - 1].item;
			return {x, y};
		} else {
			return {
				x: 30000,
				y: 30000
			};
		}
	}

	mapEnemies(greed) {
		greed.forEach((brick) => {
			brick.forEach((cell, cellIndex) => {
				if (cell === 0) {
					const texture = Math.random() < 0.5 ? this.textures.hole : this.textures.snowHole;
					const holeSprite = spritesFactory.getItem(ENEMY, texture);

					holeSprite.item.anchor.x = 0.5;
					holeSprite.item.x = this.lines[cellIndex];
					holeSprite.item.y = -holeSprite.item.height;

					this.holes.push(holeSprite);

					this.stage.addChild(holeSprite.item);
				}
			});
		});
	};

	moveEnemies(speed, hero, onHit) {
		this.holes.forEach((hole) => {
			hole.item.y += speed || 2;
			if (hitTest(hero.item, hole.item)) {
				if (!this.lastHittedHoleID || this.lastHittedHoleID !== hole.id) {
					this.lastHittedHoleID = hole.id;
					onHit();
				}
			}
		});
	}

	collectEnemies(edge) {
		this.holes.forEach(hole => {
			if (hole.item.y > edge + hole.item.height) {

				spritesFactory.returnItem(ENEMY, hole);
				this.holes = this.holes.filter(({id}) => id !== hole.id);
				this.stage.removeChild(hole.item);
			}
		});
	}

	reset() {
		this.holes.forEach(hole => {
			this.stage.removeChild(hole.item);
		});
		this.holes = [];
	}
}

export default new Enemies();