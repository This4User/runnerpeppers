const prevBrick = [0, 1, 0, 1];

const getNextBrick = (prevBrick) => {
	const newBrick = [];
	let availableCells = prevBrick.length;

	prevBrick.forEach((cell, index) => {
		if (availableCells) {
			if (cell === 1) {
				if (index === 1) {
					newBrick.push(1, 1);
					availableCells -= 2;
				} else {
					if (prevBrick.length - index - 1 >= 2){
						if(prevBrick[index + 1] === 1){
							const side = Math.random() < 0.5 ? 1 : 0;

						}
					}
				}
			}
		}
	});

	return newBrick;
};