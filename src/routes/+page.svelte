<script>
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { onMount } from 'svelte';

	onMount(() => {
		document.body.focus();
	});

	let hubOptions = [
		{
			title: `Rezende's Portfolio`,
			description: `Interactive portfolio of a solo indie game developer/programmer. Get to know more about his experience, knowledge, and skills.`,
			href: 'rezende-dev',
			image: '/logo.png'
		},
		{
			title: 'Wise Shepherd Games',
			description: '<i>Sheeping</i> unique and enjoyable games.',
			href: 'wise-shepherd-games',
			image: '/logo.png'
		}
	];

	let currentHover = -1;

	let currentText = '';
	let targetText = 'Hello, fellow member of the flock! Choose your path wisely...';
	let shouldDisplayCards = false;
	let keyboardAudioMinMaxIndex = { min: 1, max: 16 };

	let focused = true;

	setTimeout(() => {
		focused = false;
	}, 100);

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function startHub() {
		focused = true;
		setTimeout(() => {
			let interval = setInterval(() => {
				if (currentText.length == targetText.length) {
					clearInterval(interval);
					shouldDisplayCards = true;
					return;
				}
				let keyboardAudio = new Audio(
					`/audio_keyboard_` + (getRandomInt(keyboardAudioMinMaxIndex.max) + 1) + `.ogg`
				);
				keyboardAudio.play();
				currentText = targetText.substring(0, currentText.length + 1);
			}, 100);
		}, 1000);
	}
</script>

<div style="display: flex; flex-direction: column; height: 100%; text-align: center;  ">
	{#if focused == false}
		<button
			in:fade={{ easing: linear, delay: 0, duration: 1500 }}
			on:click={() => startHub()}
			class="hub-focus-button jost-light-300"
			>Start your journey on wiseshepherdgames.net!
		</button>
	{/if}

	<h1 style="animation-name: fade-in;animation-duration: 2s;">
		{currentText}
	</h1>
	{#if shouldDisplayCards}
		<hr
			in:fade={{ easing: linear, delay: 0, duration: 750 }}
			style="width: 100%; border-color: var(--card-bg-color)"
		/>
		<div in:fade={{ easing: linear, delay: 0, duration: 750 }} class="hub">
			{#each hubOptions as { title, description, href, image }, i}
				<div class="hub-card-container">
					<img
						src="selected_00.png"
						class="hub-card-selected-image"
						style={`opacity: ${i == currentHover ? 1 : 0}`}
						alt={`Select ${title}`}
					/>
					<div
						class="hub-card"
						role="button"
						tabindex={0}
						on:mouseenter={() => {
							let hover = new Audio('/audio_hover.ogg');
							hover.volume = 0.8;
							hover.play();
							currentHover = i;
						}}
						on:mouseleave={() => (currentHover = -1)}
						on:mousedown={() => {
							let click = new Audio('/audio_click.ogg');
							click.volume = 0.5;
							click.play();
							let link = document.createElement('a');
							link.style = 'width: 0; height: 0; margin: 0; padding: 0;';
							link.href = href;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						}}
					>
						<h1>{title}</h1>
						<p contenteditable="false" bind:innerHTML={description}></p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.hub {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 1%;
		padding-top: 12px;
	}

	.hub-focus-button {
		background-color: var(--card-bg-color);
		border: 0;
		color: white;
		font-size: 24px;
		padding: 24px;
		align-self: center;
		transform: translateY(35vh);
		opacity: 0.5;
		border-radius: 4px;
	}

	.hub-focus-button:hover {
		opacity: 1;
		cursor: pointer;
	}

	.hub-card-container {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 12px;
		width: 100%;
	}

	.hub-card {
		flex: 1;
		position: relative;
		width: 100%;
		max-width: 85%;
		min-height: 600px;
		background-color: var(--card-bg-color);
		opacity: 0.5;
		border-image: round;
		border-image-source: url('border_image_00.png');
		border-image-slice: 192;
		border-image-width: auto;
		border-image-repeat: stretch;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	.hub-card:hover {
		cursor: pointer;
		opacity: 1;
	}

	.hub-card-selected-image {
		width: 60px;
		height: 60px;
		transform: rotateZ(270deg);
	}

	@media (max-width: 600px) {
		.hub {
			flex: 1;
			margin-top: 6px;
			margin-bottom: 6px;
			flex-direction: column;
			justify-content: flex-start;
			gap: 14px;
		}

		.hub-focus-button {
			opacity: 1;
		}

		.hub-card-container {
			min-height: 0px;
			min-width: calc(100% - 12px);
		}

		.hub-card {
			min-height: 250px;
			min-width: 100%;
			opacity: 1;
		}

		.hub-card-selected-image {
			width: 45px;
			height: 45px;
		}
	}
</style>
