import * as PIXI from "pixi.js";
import hero from "../../assets/hero.png";
import wave from "../../assets/wave.png";
import hole from "../../assets/enemies/enemy_2.png";
import snowHole from "../../assets/enemies/enemy_1.png";
import light from "../../assets/decorations/light.png";
import bonus from "../../assets/bonus.png";
import {LevelGenerator} from "../../utils/levelGenerator";
import swipesTracker from "../../utils/swipesTracker";
import {
	IN_GAME,
	INIT_END,
	INIT_ERROR,
	INIT_START,
	LOADING_ASSETS,
	LOADING_ASSETS_END,
	LOADING_ERROR,
	LOOSE,
	PAUSED,
	PENDING,
	RESTART,
	START
} from "../../store/slices/gameSlice/consts";
import {broadcast, subscribe} from "../../utils/eventBus";
import {gameHero} from "./hero";
import enemies from "./enemies";
import decorations from "./decorations";
import {updateGameState} from "../../store/slices/gameSlice";
import bonuses from "./bonuses";

class Game {
	isPaused = false;

	addTarget(targetElement) {
		this.target = targetElement;
	}

	initGame() {
		this.initCanvas(this.target);

		subscribe(LOOSE, () => {
			this.isPaused = true;
		});

		subscribe(PAUSED, () => {
			this.isPaused = true;
		});

		subscribe(START, () => {
			this.isPaused = false;
		});

		subscribe(LOADING_ASSETS_END, () => {
			try {
				this.updateGameState(INIT_START);
				this.initInteraction();
				this.greed = [this.generator.getBrick()];
				enemies.connectStage(this.app.stage);
				bonuses.connectStage(this.app.stage);
				this.updateGameState(INIT_END);
			} catch (error) {
				this.updateGameState(INIT_ERROR);
				console.log(error);
			}
		});

		subscribe(INIT_END, () => {
			enemies.mapEnemies(this.greed);
			this.initTicker();
			this.updateGameState(IN_GAME);
			this.initOnResize();
		});

		subscribe(RESTART, this.restart);

		this.initLevelGenerator();
		this.initLines();
		enemies.addLines(this.lines);
		bonuses.addLines(this.lines);
		this.initLoader();
	}

	restart = () => {
		enemies.reset();
		bonuses.reset();
		this.greed = [this.generator.getBrick()];
		enemies.mapEnemies(this.greed);
		broadcast("update_distance", 0);
		this.isPaused = false;
		this.updateGameState(IN_GAME);
	};

	updateGameState = (newState) => {
		this.state = newState;
		broadcast("update_state", newState);
	};

	initCanvas(targetElement) {
		this.app = new PIXI.Application({
			backgroundColor: 0x333333,
			width: targetElement.clientWidth,
			height: targetElement.clientHeight
		});
		const canvas = this.app.renderer.view;
		const scale = window.devicePixelRatio;

		canvas.width *= scale;
		canvas.height *= scale;

		this.app.stage.sortableChildren = true;

		targetElement.appendChild(this.app.view);
	}

	initInteraction() {
		swipesTracker.addTargetElement(this.target);
		swipesTracker.addRightSwipeEvent(() => {
			if (!this.isPaused && this.heroLine + 1 < this.lines.length) {
				this.heroLine += 1;
				this.hero.item.x = this.lines[this.heroLine];
			}
		});

		swipesTracker.addLeftSwipeEvent(() => {
			if (!this.isPaused && this.heroLine - 1 >= 0) {
				this.heroLine -= 1;
				this.hero.item.x = this.lines[this.heroLine];
			}
		});
	}

	initLevelGenerator() {
		this.greedSize = 4;
		this.generator = new LevelGenerator(this.greedSize);
	}

	initDecorations(textures) {
		decorations.connectApp(this.app);
		decorations.addTextures(textures);
		decorations.mapDecorations();
	}

	updateDecorations() {
		decorations.addLightsLine();
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

	updateGreed() {
		if (enemies.lastEnemyPosition.y > this.app.renderer.height / 6) {
			const newBrick = this.generator.getBrick();
			this.greed.pop();
			this.greed.push(newBrick);
			enemies.mapEnemies(this.greed);
			bonuses.mapBonuses(this.greed);
		}
	}

	initTicker() {
		this.app.ticker.add(() => {
			if (!this.isPaused) {
				broadcast("update_distance", 0.01);
				gameHero.heroAnimation();
				enemies.moveEnemies(this.hero, this.updateGameState);
				bonuses.moveBonuses(this.hero, () => {
					broadcast("update_distance", 50);
				});
				decorations.moveDecorations();
				this.updateGreed();
				this.updateDecorations();
				enemies.collectEnemies(this.app.renderer.height);
				bonuses.collectBonuses(this.app.renderer.height);
				decorations.collectLights(this.app.renderer.height);
			}
		});
	}

	initLoader() {
		this.updateGameState(LOADING_ASSETS);
		this.app.loader
			.onError.add((error) => {
			updateGameState(LOADING_ERROR);
			console.error(error);
		});
		this.app.loader
			.add("wave", wave)
			.add("hero", hero)
			.add("hole", hole)
			.add("snowHole", snowHole)
			.add("light", light)
			.add("bonus", bonus)
			.load((loader, resources) => {
				this.initHero(resources.hero.texture);
				this.initDecorations({
					wave: resources.wave.texture,
					light: resources.light.texture
				});
				enemies.addTextures({
					snowHole: resources.snowHole.texture,
					hole: resources.hole.texture
				});

				bonuses.addTextures({
					bonus: resources.bonus.texture
				});
			})
			.onComplete.add(() => {
			this.updateGameState(LOADING_ASSETS_END);
		});
	}

	initOnResize() {
		this.onWindowResize = () => {
			this.app.view.width = this.target.innerWidth;
			this.app.view.height = this.target.innerHeight;
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