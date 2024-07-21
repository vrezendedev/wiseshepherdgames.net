import * as helpers from '$lib/helpers';

export function playHoverSound() {
	helpers.AudioHelper.playAudio('/audio_hover.ogg', 0.7);
}

export function playClickSound() {
	helpers.AudioHelper.playAudio('/audio_click.ogg', 0.5);
}
