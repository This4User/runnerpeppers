const getRandomNumber = (min = 0, max = 10) => {
	let random;

	do {
		random = Math.floor(Math.random() * (max - min)) + min;
	} while (random === getRandomNumber.last);
	getRandomNumber.last = random;
	return random;
};

export default getRandomNumber;