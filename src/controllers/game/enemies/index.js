import spritesFactory from "../spritesFactory";
import {hitTest} from "../../../utils/hitTest";
import {broadcast} from "../../../utils/eventBus";
import {LOOSE} from "../../../store/slices/gameSlice/consts";

class Enemies {
	holes = [];

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
		const lastEnemy = this.holes[this.holes.length - 1].item;
		return {
			x: lastEnemy.x,
			y: lastEnemy.y
		};
	}

	mapEnemies(greed) {
		greed.forEach((brick) => {
			brick.forEach((cell, cellIndex) => {
				if (cell > 0) {
					const texture = Math.random() < 0.5 ? this.textures.hole : this.textures.snowHole;
					const holeSprite = spritesFactory.getEnemy(texture);

					holeSprite.item.anchor.x = 0.5;
					holeSprite.item.x = this.lines[cellIndex];
					holeSprite.item.y = -holeSprite.item.height;

					this.holes.push(holeSprite);

					this.stage.addChild(holeSprite.item);
				}
			});
		});
	};

	moveEnemies(hero) {
		this.holes.forEach((hole) => {
			hole.item.y += 2;
			if (hitTest(hero.item, hole.item)) {
				broadcast(LOOSE);
			}
		});
	}

	collectEnemies(edge) {
		this.holes.forEach(hole => {
			if (hole.item.y > edge + hole.item.height) {

				spritesFactory.returnEnemy(hole);
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