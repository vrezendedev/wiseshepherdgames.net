export function playAudio(path, vol = 1) {
	let audio = new Audio(path);
	audio.volume = vol;
	audio.play();
}
