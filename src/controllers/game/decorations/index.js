import * as PIXI from "pixi.js";
import Lights from "./lights";
import Cars from "./cars";
import Benches from "./benches";
import Trees from "./trees";
import Wave from "./wave";

class Decorations {
	storage = [];

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

	initDecorations() {
		const stage = this.app.stage;
		const stageHeight = this.app.renderer.height;
		const stageWidth = this.app.renderer.width;

		this.storage.push(new Lights(this.textures.light, stage, stageHeight, stageWidth));
		this.storage.push(new Cars(this.textures.car, stage, stageHeight, stageWidth));
		this.storage.push(new Benches(this.textures.bench, stage, stageHeight, stageWidth));
		this.storage.push(new Trees(this.textures.tree, stage, stageHeight, stageWidth));
		this.storage.push(new Wave(this.textures.wave, stage, stageHeight, stageWidth));

		const leftSnow = this.initSnow();
		const rightSnow = this.initSnow();
		rightSnow.x = this.app.renderer.width - rightSnow.width;
		this.app.stage.addChild(leftSnow);
		this.app.stage.addChild(rightSnow);

		this.storage.forEach(dec => {
			dec.initDecorations();
		});
	}

	addDecorationsLine() {
		this.storage.forEach(dec => {
			dec.addDecorations();
		});
	}

	moveDecorations(speed) {
		this.storage.forEach(dec => {
			dec.moveDecorations(speed);
		});
	}

	collectDecorations(edge) {
		this.storage.forEach(dec => {
			dec.collectDecorations(edge);
		});
	}
}

export default new Decorations();