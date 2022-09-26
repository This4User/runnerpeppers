import * as PIXI from "pixi.js";
import spritesFactory, {CAR, LIGHT} from "../spritesFactory";

class Decorations {
	lightsStorage = [];
	treesStorage = [];
	benchesStorage = [];
	carsStorage = [];

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

	initDecorations(isRightSide) {
		const lights = [spritesFactory.getItem(LIGHT, this.textures.light)];
		const cars = [spritesFactory.getItem(CAR, this.textures.car)];
		for (let i = 0; i < this.app.renderer.height / lights[0].item.height; i++) {
			if (isRightSide) {
				lights[i].item.x += this.app.renderer.width - 100 - lights[i].item.width / 3;
				lights[i].item.anchor.x = 0.5;
				lights[i].item.scale.x = -1;
				cars[i].item.x += this.app.renderer.width - 100;
			} else {
				lights[i].item.x += 100 - lights[i].item.width / 4;
				cars[i].item.x += 100 - lights[i].item.width;
			}

			cars[i].item.y = cars[i].item.height * 4 * i;
			cars[i].item.zIndex = 10;
			lights[i].item.y = (lights[i].item.height - lights[i].item.height / 4) * i - lights[i].item.height * 3 / 4;
			lights[i].item.zIndex = 10;
			this.app.stage.addChild(lights[i].item);
			this.app.stage.addChild(cars[i].item);
			console.log(cars[i]);
			cars.push(spritesFactory.getItem(CAR, this.textures.car));
			lights.push(spritesFactory.getItem(LIGHT, this.textures.light));
		}

		return {
			lights,
			cars
		};
	}

	addDecorationsLine() {
		if (this.lastDecorationPosition.y > -this.lightsStorage[0][0].item.height / 2) {
			const leftLight = spritesFactory.getItem(LIGHT, this.textures.light);
			leftLight.item.x = 100 - leftLight.item.width / 4;
			leftLight.item.y = -leftLight.item.height * 5 / 4;
			leftLight.item.zIndex = 10;

			const rightLight = spritesFactory.getItem(LIGHT, this.textures.light);
			rightLight.item.x = this.app.renderer.width - 100 - rightLight.item.width / 3;
			rightLight.item.anchor.x = 0.5;
			rightLight.item.scale.x = -1;
			rightLight.item.y = -rightLight.item.height * 5 / 4;
			leftLight.item.zIndex = 10;

			this.lightsStorage[0].push(leftLight);
			this.lightsStorage[1].push(rightLight);

			this.app.stage.addChild(leftLight.item);
			this.app.stage.addChild(rightLight.item);
		}
	}

	mapDecorations() {
		const leftSnow = this.initSnow();
		const rightSnow = this.initSnow();
		const leftDecorations = this.initDecorations();
		const rightDecorations = this.initDecorations(true);
		rightSnow.x = this.app.renderer.width - rightSnow.width;
		this.app.stage.addChild(leftSnow);
		this.app.stage.addChild(rightSnow);
		this.app.stage.addChild(this.initWave());
		this.lightsStorage.push(
			leftDecorations.lights,
			rightDecorations.lights
		);
		this.carsStorage.push(
			leftDecorations.cars,
			rightDecorations.cars
		);
	}

	moveDecorations(speed) {
		this.lightsStorage.forEach(decArray => {
			decArray.forEach(dec => {
				dec.item.y += speed || 2;
			});
		});
		this.carsStorage.forEach(decArray => {
			decArray.forEach(dec => {
				dec.item.y += speed || 2;
			});
		});
	}

	collectDecorations(edge) {
		this.collectLights(edge);
		this.collectCars(edge);
	}

	collectLights(edge) {
		this.lightsStorage.forEach((lightsArray, index) => {
			lightsArray.forEach(light => {
				if (light.item.y > edge + light.item.height / 2) {
					this.app.stage.removeChild(light.item);
					this.lightsStorage[index] = lightsArray.filter(({id}) => id !== light.id);
					spritesFactory.returnItem(LIGHT, light);
					light.item.y = 0;
					light.item.x = 0;
					light.item.anchor.x = 0;
					light.item.scale.x = 1;
				}
			});
		});
	}

	collectCars(edge) {
		this.carsStorage.forEach((carsArray, index) => {
			carsArray.forEach(car => {
				if (car.item.y > edge + car.item.height / 2) {
					this.app.stage.removeChild(car.item);
					this.carsStorage[index] = carsArray.filter(({id}) => id !== car.id);
					spritesFactory.returnItem(CAR, car);
					car.item.y = 0;
					car.item.x = 0;
					car.item.anchor.x = 0;
					car.item.scale.x = 1;
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