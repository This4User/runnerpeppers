import * as PIXI from "pixi.js";
import hero from "../../assets/hero.png";
import wave from "../../assets/wave.png";
import hole from "../../assets/enemies/enemy_2.png";
import snowHole from "../../assets/enemies/enemy_1.png";
import {hitTest} from "./hitTest";
import {LevelGenerator} from "../levelGenerator";
import spritesFactory from "./spritesFactory";
import {nanoid} from "@reduxjs/toolkit";
import swipesTracker from "../swipesTracker";

export class Game {
	holes = [];

	constructor(targetElement) {
		this.target = targetElement;
		this.initCanvas(targetElement);
		this.loadAssets();
		this.initLevelGenerator();
		this.initLines();
		this.initLoader();
		this.initInteraction();
		this.initOnResize();
		this.greed = [this.generator.getBrick()];
		this.mapEnemies();
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
				this.heroSprite.x = this.lines[this.heroLine];
			}
		});

		swipesTracker.addLeftSwipeEvent(() => {
			if (this.heroLine - 1 >= 0) {
				this.heroLine -= 1;
				this.heroSprite.x = this.lines[this.heroLine];
			}
		});
	}

	loadAssets() {
		this.app.loader
			.add("wave", wave)
			.add("hero", hero);
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
		this.heroSprite = spritesFactory.getHero(texture);
		this.heroSprite.interactive = true;
		this.heroSprite.zIndex = 10;

		this.heroSprite.on("click", () => {
			this.heroSprite.y -= 64;
		});

		this.heroLine = Math.floor(Math.random() * this.lines.length);
		this.heroSprite.x = this.lines[this.heroLine];
		this.heroSprite.y = this.app.renderer.height - this.heroSprite.height * 3;

		this.heroSprite.anchor.x = 0.5;
		this.heroSprite.scale.x *= -1;

		this.app.stage.addChild(this.heroSprite);
		this.isHeroFlipped = true;
	}

	heroAnimation() {
		if (this.isHeroFlipped) {
			this.heroSprite.scale.x *= -1;
			this.isHeroFlipped = false;
			setTimeout(() => {
				this.isHeroFlipped = true;
			}, 500);
		}
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

	mapEnemies() {
		this.greed.forEach((brick) => {
			brick.forEach((cell, cellIndex) => {
				if (cell > 0) {
					const texture = Math.random() < 0.5 ? hole : snowHole;
					const holeSprite = spritesFactory.getEnemy(texture);

					holeSprite.anchor.x = 0.5;
					holeSprite.x = this.lines[cellIndex];
					holeSprite.y = -holeSprite.height;

					this.holes.push({
						id: nanoid(),
						model: holeSprite
					});

					this.app.stage.addChild(holeSprite);
				}
			});
		});
	};

	updateGreed() {
		if (this.holes[this.holes.length - 1].model.y > this.app.renderer.height / 3) {
			const newBrick = this.generator.getBrick();
			this.greed.pop();
			this.greed.push(newBrick);
			this.mapEnemies();
		}
	}

	collectEnemies() {
		this.holes.forEach(hole => {
			if (hole.model.y > this.app.renderer.height + hole.model.height) {

				spritesFactory.returnEnemy(hole.model);
				this.holes = this.holes.filter(({id}) => id !== hole.id);
				this.app.stage.removeChild(hole.model);
			}
		});
	}

	moveEnemies() {
		this.holes.forEach((hole) => {
			hole.model.y += 2;
			if (hitTest(this.heroSprite, hole.model)) {
				console.log("Loose");
			}
		});
	}

	initLoader() {
		this.app.loader
			.load((loader, resources) => {
				this.initHero(resources.hero.texture);
				this.initDecorations(resources.wave.texture);

				this.app.ticker.add(() => {
					this.heroAnimation();
					this.moveEnemies();
					this.updateGreed();
					this.collectEnemies();
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
}