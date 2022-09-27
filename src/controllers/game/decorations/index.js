import * as PIXI from "pixi.js";
import Lights from "./lights";
import Cars from "./cars";

class Decorations {

	connectApp(app) {
		this.app = app;
	}

	addTextures(textures) {
		this.textures = textures;
	}

	initSnow() {
		const snow = new PIXI.Graphics();
		snow.beginFill(0xffffff);
		snow.drawRect(0, 0, 100, this.app.renderer.height);

		return snow;
	}

	initWave() {
		const waveSprite = new PIXI.Sprite(this.textures.wave);
		waveSprite.position.y = this.app.renderer.height - waveSprite.height;
		waveSprite.position.x = (this.app.renderer.width / 2) - (waveSprite.width / 2);
		waveSprite.zIndex = 20;

		return waveSprite;
	}

	initDecorations() {
		const stage = this.app.stage;
		const stageHeight = this.app.renderer.height;
		const stageWidth = this.app.renderer.width;

		this.lights = new Lights(this.textures.light, stage, stageHeight, stageWidth);
		this.cars = new Cars(this.textures.car, stage, stageHeight, stageWidth);

		const leftSnow = this.initSnow();
		const rightSnow = this.initSnow();
		rightSnow.x = this.app.renderer.width - rightSnow.width;
		this.app.stage.addChild(leftSnow);
		this.app.stage.addChild(rightSnow);
		this.app.stage.addChild(this.initWave());

		this.lights.initDecorations();
		this.lights.initDecorations(true);
		this.cars.initDecorations();
		this.cars.initDecorations(true);
	}

	addDecorationsLine() {
		this.lights.addDecorationsLine();
		this.cars.addDecorationsLine();
	}

	moveDecorations(speed) {
		this.lights.moveDecorations(speed);
		this.cars.moveDecorations(speed);
	}

	collectDecorations(edge) {
		this.lights.collectDecorations(edge);
		this.cars.collectDecorations(edge);
	}
}

export default new Decorations();