export class LevelGenerator {
	prevBrick = [];

	constructor(width = 3) {
		this.width = width;

		for (let i = 0; i < width; i++) {
			const cell = Math.random() < 0.5 ? 1 : 0;

			this.prevBrick.push(cell);
		}
	}

	getBrick() {
		const newBrick = [];
		if (this.prevBrick) {
			this.prevBrick.forEach((cell, index) => {
				const side = Math.random() < 0.5 ? 1 : 0;

				if (newBrick.length !== this.prevBrick.length) {
					if (cell === 1 && this.prevBrick[index + 1] === 0 && this.prevBrick[index + 2] === 1) {
						if (newBrick.length + 2 <= this.prevBrick.length) {
							newBrick.push(0, 0);
						}
					} else if (cell === 0 && this.prevBrick[index + 1] === 1) {
						newBrick.push(0, 0);
					} else if (cell === 0 && this.prevBrick[index + 1] === 0) {
						side ? newBrick.push(1, 0) : newBrick.push(0, 1);
					} else if (cell !== 0) {
						side ? newBrick.push(1, 0) : newBrick.push(0, 1);
					}
				}
			});
		}

		if (newBrick.length > this.prevBrick.length) {
			newBrick.length = this.prevBrick.length;
		}

		this.prevBrick = newBrick;
		return newBrick;
	}
}

