export function typeEffect(
	typingSpeed,
	earlyTickCallback,
	lateTickCallback,
	endCallback,
	obj,
	newTextKey,
	targetTextKey
) {
	let interval = setInterval(() => {
		if (obj[newTextKey].length == obj[targetTextKey].length) {
			clearInterval(interval);
			endCallback();
			return;
		}

		earlyTickCallback();
		obj[newTextKey] = obj[targetTextKey].substring(0, obj[newTextKey].length + 1);
		lateTickCallback();
	}, typingSpeed);
}
