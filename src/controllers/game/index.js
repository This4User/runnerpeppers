import * as PIXI from "pixi.js";
import hero from "../../assets/hero.png";
import wave from "../../assets/wave.png";
import hole from "../../assets/enemies/enemy_2.png";
import snowHole from "../../assets/enemies/enemy_1.png";
import {hitTest} from "../../utils/hitTest";
import {LevelGenerator} from "../../utils/levelGenerator";
import spritesFactory from "./spritesFactory";
import swipesTracker from "../../utils/swipesTracker";
import {store} from "../../store";
import {updateGameState} from "../../store/slices/gameSlice";
import {
	IN_GAME, INIT_END,
	INIT_ERROR,
	INIT_START,
	LOADING_ASSETS,
	LOADING_ASSETS_END,
	LOADING_ERROR, PENDING
} from "../../store/slices/gameSlice/consts";
import {broadcast, subscribe} from "../../utils/eventBus";
import {gameHero} from "./hero";
import enemies from "./enemies";

class Game {
	holes = [];

	addTarget(targetElement) {
		this.target = targetElement;
	}

	initGame() {
		this.initCanvas(this.target);

		subscribe(LOADING_ASSETS_END, () => {
			try {
				this.updateGameState(INIT_START);
				this.initLevelGenerator();
				this.initLines();
				enemies.addLines(this.lines);
				this.initLoader();
				this.initInteraction();
				enemies.connectStage(this.app.stage);
				this.updateGameState(INIT_END);
			} catch (error) {
				this.updateGameState(INIT_ERROR);
				console.log(error);
			}
		});

		subscribe(INIT_END, () => {
			this.greed = [this.generator.getBrick()];
			this.updateGameState(IN_GAME);
			this.initOnResize();
		});

		this.loadAssets();
	}

	updateGameState(newState) {
		this.state = newState;
		console.log(newState);
		broadcast(newState);
		store.dispatch(updateGameState(newState));
	}

	initCanvas(targetElement) {
		this.app = new PIXI.Application({
			backgroundColor: 0x333333,
			width: targetElement.clientWidth,
			height: targetElement.clientHeight
		});
		this.app.stage.sortableChildren = true;

		targetElement.appendChild(this.app.view);
	}

	initInteraction() {
		swipesTracker.addTargetElement(this.target);
		swipesTracker.addRightSwipeEvent(() => {
			if (this.heroLine + 1 < this.lines.length) {
				this.heroLine += 1;
				this.hero.item.x = this.lines[this.heroLine];
			}
		});

		swipesTracker.addLeftSwipeEvent(() => {
			if (this.heroLine - 1 >= 0) {
				this.heroLine -= 1;
				this.hero.item.x = this.lines[this.heroLine];
			}
		});
	}

	loadAssets() {
		this.updateGameState(LOADING_ASSETS);
		try {
			this.app.loader
				.add("wave", wave)
				.add("hero", hero)
				.add("hole", hole)
				.add("snowHole", snowHole);

			this.updateGameState(LOADING_ASSETS_END);
		} catch (error) {
			this.updateGameState(LOADING_ERROR);
			console.log(error);
		}
	}

	initLevelGenerator() {
		this.greedSize = 4;
		this.generator = new LevelGenerator(this.greedSize);
	}

	initSnow() {
		const snow = new PIXI.Graphics();
		snow.beginFill(0xffffff);
		snow.drawRect(0, 0, 100, this.target.clientHeight);

		return snow;
	}

	initDecorations(texture) {
		const leftSnow = this.initSnow();
		const rightSnow = this.initSnow();
		rightSnow.x = this.target.clientWidth - rightSnow.width;
		this.app.stage.addChild(leftSnow);
		this.app.stage.addChild(rightSnow);

		const waveSprite = new PIXI.Sprite(texture);
		waveSprite.position.y = this.app.renderer.height - waveSprite.height;
		waveSprite.position.x = (this.app.renderer.width / 2) - (waveSprite.width / 2);
		waveSprite.zIndex = 20;
		this.app.stage.addChild(waveSprite);
	}

	initHero(texture) {
		this.hero = gameHero.getHero(texture);
		this.heroLine = Math.floor(Math.random() * this.lines.length);
		this.hero.item.x = this.lines[this.heroLine];
		this.hero.item.y = this.app.renderer.height - this.hero.item.height * 3;


		this.app.stage.addChild(this.hero.item);
	}

	initLines() {
		this.lines = [];

		for (let i = 0; i < this.greedSize; i++) {
			const columWidth = (this.target.clientWidth - 200) / this.greedSize;
			const columnCenter = (columWidth / 2) + 100;
			const position = (i * columWidth + columnCenter);

			this.lines.push(position);
		}
	}

	updateGreed(textures) {
		if (enemies.lastEnemyPosition.y > this.app.renderer.height / 3) {
			const newBrick = this.generator.getBrick();
			this.greed.pop();
			this.greed.push(newBrick);
			enemies.mapEnemies(textures, this.greed);
		}
	}

	initLoader() {
		this.app.loader
			.load((loader, resources) => {
				this.initHero(resources.hero.texture);
				this.initDecorations(resources.wave.texture);
				enemies.mapEnemies({
					snowHole: resources.snowHole.texture,
					hole: resources.hole.texture
				}, this.greed);

				this.app.ticker.add(() => {
					gameHero.heroAnimation();
					enemies.moveEnemies(this.hero);
					this.updateGreed({
						snowHole: resources.snowHole.texture,
						hole: resources.hole.texture
					});
					enemies.collectEnemies(this.app.renderer.height);
				});
			});
	}

	initOnResize() {
		this.onWindowResize = () => {
			this.app.view.width = this.target.clientWidth;
			this.app.view.height = this.target.clientHeight;
		};

		window.addEventListener("resize", this.onWindowResize);
	}

	destroyGame() {
		this.target.removeChild(this.app.view);
		this.app.stage.destroy(true);
		this.app.renderer.destroy(true);
		this.app = null;
		this.updateGameState(PENDING);
	}
}

export default new Game();