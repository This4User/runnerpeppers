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
		let availableCells = this.prevBrick.length;

		this.prevBrick.forEach((cell, index) => {
			if (availableCells) {
				const currentCell = cell;
				const nextCell = this.prevBrick[index + 1];
				const prevNewCell = newBrick[index - 1];

				if (availableCells >= 2) {
					const side = Math.random() < 0.5 ? 1 : 0;
					if (currentCell === 0 && nextCell === 1) {
						if (side && availableCells >= 3) {
							const firstCell = Math.random() < 0.5 ? 1 : 0;

							newBrick.push(firstCell, 1, 1);
							availableCells -= 3;
						} else {
							newBrick.push(1, 1);
							availableCells -= 2;
						}
					} else if (currentCell === 1) {
						if (nextCell === 0) {
							if (prevNewCell === 1) {
								newBrick.push(1, 0);
							} else {
								newBrick.push(1, 1);
							}
						} else {
							side ? newBrick.push(1, 0) : newBrick.push(0, 1);
						}
						availableCells -= 2;
					}
				} else {
					const randomCell = Math.random() < 0.5 ? 1 : 0;
					let numberOfFreeCells = 0;

					if (this.prevBrick.length - newBrick.length === 1) {
						newBrick.forEach(cell => {
							if (cell) numberOfFreeCells++;
						});

						if (!numberOfFreeCells) {
							newBrick.push(1);
							availableCells -= 1;
						} else {
							newBrick.push(randomCell);
							availableCells -= 1;
						}
					} else {
						if (prevNewCell === 1) {
							newBrick.push(0);
						} else {
							newBrick.push(randomCell);
						}
						availableCells -= 1;
					}
				}
			}
		});

		this.prevBrick = newBrick;
		return newBrick;
	}
}

