const getRandomNumber = (min = 0, max = 10) => {
	let random;

	do {
		random = Math.floor(Math.random() * (max - min)) + min;
	} while (random === getRandomNumber.last);
	getRandomNumber.last = random;
	return random;
};


const generationConfig = {
	"100": [
		[1, 1, 0],
		[1, 0, 0]
	],
	"010": [
		[1, 1, 0],
		[0, 1, 1]
	],
	"001": [
		[0, 1, 1],
		[0, 0, 1]
	],
	"110": [
		[0, 1, 1],
		[1, 0, 0],
	],
	"011": [
		[1, 1, 0],
		[0, 0, 1],
	],
	"101": [
		[1, 1, 0],
		[0, 1, 1]
	]
};

let prevIndex = 0;

const getNextBrick = (prevBrick) => {
	const newBrick = [];
	let availableCells = prevBrick.length;
	let pathNumber = 1;
	const targetBunchIndex = prevIndex;
	const isTargetBunchExist = prevBrick.slice(targetBunchIndex, targetBunchIndex + 3).indexOf(1) !== -1;
	const getBunch = (bunchIndex) => {
		return prevBrick.slice(bunchIndex, bunchIndex + 3).join("");
	};
	const targetBunch = getBunch(targetBunchIndex);

	prevBrick.forEach((cell, index) => {

		const bunch = getBunch(index);
		const allowedBunches = isTargetBunchExist ? (index === targetBunchIndex ? generationConfig[targetBunch] : false) : generationConfig[bunch];

		if (availableCells >= 3 && allowedBunches) {
			const randomBunch = allowedBunches[Math.floor(Math.random() * allowedBunches.length)];
			newBrick.push(...randomBunch);
			availableCells -= 3;
			pathNumber -= 1;
			if ((prevIndex + 3 < prevBrick.length)) {
				prevIndex++;
			} else {
				if (randomBunch.join("") !== "011" && randomBunch.join("") !== "110") {
					prevIndex--;
				}
			}
		} else if (availableCells >= 1) {
			newBrick.push(0);
			availableCells -= 1;
		}
	});

	return newBrick;
};
let prevBrick = [0, 1, 0, 0];

for (let i = 0; i < 10; i++) {
	console.log(prevBrick);
	prevBrick = [...getNextBrick(prevBrick)];
}