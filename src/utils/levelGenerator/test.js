const getNextBrick = (prevBrick) => {
	const newBrick = [];
	let availableCells = prevBrick.length;
	let isPathCellsAdded = false;

	prevBrick.forEach((cell, index) => {
		if (availableCells) {
			const currentCell = cell;
			const nextCell = prevBrick[index + 1];
			const prevNewCell = newBrick[index - 1];

			if (availableCells >= 2) {
				const side = Math.random() < 0.5 ? 1 : 0;
				if (!isPathCellsAdded) {
					if (currentCell === 1) {
						if (nextCell === 0) {
							newBrick.push(1, 1);
						} else {
							side ? newBrick.push(1, 0) : newBrick.push(0, 1);
						}
						availableCells -= 2;
						isPathCellsAdded = true;
					} else {
						if (nextCell === 1) {
							if (side) {
								newBrick.push(1, 1);
								availableCells -= 2;
							} else {
								newBrick.push(0, 1, 1);
								availableCells -= 3;
							}
							isPathCellsAdded = true;
						} else {
							newBrick.push(0);
							availableCells -= 1;
						}
					}
				} else {
					newBrick.push(0);
					availableCells -= 1;
				}
			} else {
				newBrick.push(0);
				availableCells -= 1;
			}
		}
	});

	return newBrick;
};
let prevBrick = [0, 0, 0, 1];

for (let i = 0; i < 10; i++) {
	console.log(prevBrick);
	prevBrick = [...getNextBrick(prevBrick)];
}