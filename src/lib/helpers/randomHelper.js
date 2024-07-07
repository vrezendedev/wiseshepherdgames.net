export function getRandomInt(max, min = 0) {
	let value = Math.floor(Math.random() * max);
	return value < min ? min : value;
}
