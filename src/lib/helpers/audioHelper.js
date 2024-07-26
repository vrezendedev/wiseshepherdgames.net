export function playAudio(path, vol = 1, loop = false) {
	let audio = new Audio(path);
	audio.volume = vol;
	audio.play();
	audio.loop = loop;
}
