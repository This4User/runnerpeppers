import * as PIXI from "pixi.js";
import hero from "../../assets/hero.png";
import wave from "../../assets/wave.png";
import hole from "../../assets/enemies/enemy_2.png";
import snowHole from "../../assets/enemies/enemy_1.png";
import light from "../../assets/decorations/light.png";
import bonus from "../../assets/bonus.png";
import car from "../../assets/decorations/car.png";
import bench from "../../assets/decorations/bench.png";
import tree from "../../assets/decorations/tree.png";
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
	START, UPDATE_DIFFICULT
} from "../../store/slices/gameSlice/consts";
import {broadcast, subscribe} from "../../utils/eventBus";
import {gameHero} from "./hero";
import enemies from "./enemies";
import decorations from "./decorations";
import {updateGameState} from "../../store/slices/gameSlice";
import bonuses from "./bonuses";

class Game {
	isPaused = false;
	speed = 2;


	constructor() {
		this.resizeCanvas = this.resizeCanvas.bind(this);
	}

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

		subscribe(UPDATE_DIFFICULT, (delta) => {
			if (this.speed < 12) this.speed += delta;
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
		this.speed = 1.5;
		enemies.reset();
		bonuses.reset();
		this.greed = [this.generator.getBrick()];
		enemies.mapEnemies(this.greed);
		broadcast("update_distance", 0);
		broadcast("update_life", RESTART);
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


		targetElement.appendChild(this.app.view);

		this.app.stage.sortableChildren = true;
		this.app.renderer.options.resolution = window.devicePixelRatio;
		this.app.renderer.options.autoDensity = true;
		this.resizeCanvas();
	}

	resizeCanvas() {
		const canvas = this.app.renderer.view;
		const {clientWidth: width, clientHeight: height} = this.target;
		this.app.renderer.resize(width * window.devicePixelRatio, height * window.devicePixelRatio);
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		const scaleX = width / 660;
		console.log(scaleX * 880 - height * window.devicePixelRatio)
		this.app.stage.scale.set(scaleX);
		this.app.stage.y = height * window.devicePixelRatio - scaleX * 880 ;
		//this.app.stage.scale.set(scale, scale);
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
		decorations.initDecorations();
	}

	updateDecorations() {
		decorations.addDecorationsLine();
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

	onEnemyHit() {
		broadcast("update_life");
		gameHero.onHit();
	}

	initTicker() {
		this.app.ticker.add(() => {
			if (!this.isPaused) {
				broadcast("update_distance", this.speed / 50);
				gameHero.heroAnimation();
				enemies.moveEnemies(this.speed, this.hero, this.onEnemyHit);
				bonuses.moveBonuses(this.speed, this.hero, () => {
					broadcast("update_distance", 50);
				});
				decorations.moveDecorations(this.speed);
				this.updateGreed();
				this.updateDecorations();
				enemies.collectEnemies(this.app.renderer.height);
				bonuses.collectBonuses(this.app.renderer.height);
				decorations.collectDecorations(this.app.renderer.height);
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
			.add("car", car)
			.add("bench", bench)
			.add("tree", tree)
			.load((loader, resources) => {
				this.initHero(resources.hero.texture);
				this.initDecorations({
					wave: resources.wave.texture,
					light: resources.light.texture,
					car: resources.car.texture,
					tree: resources.tree.texture,
					bench: resources.bench.texture
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
		window.addEventListener("resize", this.resizeCanvas);
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