import * as PIXI from "pixi.js";
import decorationsFactory from "../decorationsFactory";

class Decorations {
	lightsStorage = [];

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

	initLights(isRightSide) {
		const lights = [decorationsFactory.getLight(this.textures.light)];
		for (let i = 0; i < this.app.renderer.height / lights[0].item.height; i++) {
			if (isRightSide) {
				lights[i].item.x += this.app.renderer.width - 100 - lights[i].item.width / 3;
				lights[i].item.anchor.x = 0.5;
				lights[i].item.scale.x = -1;
			} else {
				lights[i].item.x += 100 - lights[i].item.width / 4;
			}

			lights[i].item.y = (lights[i].item.height - lights[i].item.height / 4) * i - lights[i].item.height * 3 / 4;
			this.app.stage.addChild(lights[i].item);
			lights.push(decorationsFactory.getLight(this.textures.light));
		}

		return lights;
	}

	addLightsLine() {
		if (this.lastDecorationPosition.y > -this.lightsStorage[0][0].item.height / 2) {
			const leftLight = decorationsFactory.getLight(this.textures.light);
			const rightLight = decorationsFactory.getLight(this.textures.light);
			leftLight.item.x = 100 - leftLight.item.width / 4;
			leftLight.item.y = -leftLight.item.height * 5 / 4;

			rightLight.item.x = this.app.renderer.width - 100 - rightLight.item.width / 3;
			rightLight.item.anchor.x = 0.5;
			rightLight.item.scale.x = -1;
			rightLight.item.y = -rightLight.item.height * 5 / 4;

			this.lightsStorage[0].push(leftLight);
			this.lightsStorage[1].push(rightLight);

			this.app.stage.addChild(leftLight.item);
			this.app.stage.addChild(rightLight.item);
		}
	}

	mapDecorations() {
		const leftSnow = this.initSnow();
		const rightSnow = this.initSnow();
		rightSnow.x = this.app.renderer.width - rightSnow.width;
		this.app.stage.addChild(leftSnow);
		this.app.stage.addChild(rightSnow);
		this.app.stage.addChild(this.initWave());
		this.lightsStorage.push(
			this.initLights(),
			this.initLights(true)
		);
	}

	moveDecorations() {
		this.lightsStorage.forEach(decArray => {
			decArray.forEach(dec => {
				dec.item.y += 2;
			});
		});
	}

	collectLights(edge) {
		this.lightsStorage.forEach((lightsArray, index) => {
			lightsArray.forEach(light => {
				if (light.item.y > edge) {
					light.item.y = 0;
					light.item.x = 0;
					light.item.anchor.x = 0;
					light.item.scale.x = 1;
					decorationsFactory.returnLight(light);
					this.lightsStorage[index] = lightsArray.filter(({id}) => id !== light.id);
					this.app.stage.removeChild(light.item);
				}
			});
		});
	}

	get lastDecorationPosition() {
		const {x, y} = this.lightsStorage[0][this.lightsStorage[0].length - 1].item;
		return {x, y};
	}
}

export default new Decorations();