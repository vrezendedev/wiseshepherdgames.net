<script>
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import * as helpers from '$lib/helpers.js';
	import { WiseShepherdGamesCommons } from '$lib/commons';

	let hubOptions = [
		{
			title: `Rezende's Portfolio`,
			description: `Interactive portfolio of a solo indie game developer/programmer. Get to know more about his experience, knowledge, and skills.`,
			href: 'rezende-dev'
		},
		{
			title: 'Wise Shepherd Games',
			description: '<i>Sheeping</i> unique and enjoyable games.',
			href: 'wise-shepherd-games'
		}
	];

	let focused = false;

	let typing = {
		updatedText: '',
		targetText: 'Hello, fellow member of the flock! Choose your path wisely...'
	};

	let currentText = '';

	let shouldDisplayCards = false;

	let currentHover = -1;

	function startHub() {
		focused = true;
		setTimeout(() => {
			helpers.EffectsHelper.typeEffect(
				75,
				() => {
					let path = `/audio_keyboard_` + helpers.RandomHelper.getRandomInt(16, 1) + `.ogg`;
					helpers.AudioHelper.playAudio(path);
				},
				() => {
					currentText = typing.updatedText;
				},
				() => (shouldDisplayCards = true),
				typing,
				'updatedText',
				'targetText'
			);
		}, 1250);
	}
</script>

<div style="display: flex; flex-direction: column; height: 100%; text-align: center;  ">
	<div class="fog-background">
		<div class="infinite-fog" style="animation-duration: 5s; opacity: 0.05;" />
		<div class="infinite-fog" />
	</div>

	{#if focused == false}
		<div style="animation: fade-in 3s ease-in;">
			<button
				on:click={() => startHub()}
				class="base-border base-hover hub-focus-button jost-light-300"
				>Start your journey on wiseshepherdgames.net!
			</button>
		</div>
	{/if}

	<h1 style="animation-name: fade-in; animation-duration: 2s;">
		{currentText}
	</h1>

	{#if shouldDisplayCards}
		<hr
			in:fade={{ easing: linear, delay: 0, duration: 750 }}
			style="width: 100%; border-color: var(--card-bg-color)"
		/>

		<div in:fade={{ easing: linear, delay: 0, duration: 750 }} class="hub">
			{#each hubOptions as { title, description, href }, i}
				<div class="hub-card-container">
					<img
						src="selected_00.png"
						class="hub-card-selected-image"
						style={`opacity: ${i == currentHover ? 1 : 0}`}
						alt={`Select ${title}`}
					/>

					<div
						class="base-border base-hover hub-card"
						role="button"
						tabindex={0}
						on:mouseenter={() => {
							WiseShepherdGamesCommons.AudioCommons.playHoverSound();
							currentHover = i;
						}}
						on:mouseleave={() => (currentHover = -1)}
						on:mousedown={() => {
							WiseShepherdGamesCommons.AudioCommons.playClickSound();
							helpers.DomHelper.redirect(href);
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
	.fog-background {
		position: fixed;
		min-width: 100%;
		min-height: 100%;
		animation: fade-in 1s ease-in;
	}

	.infinite-fog {
		position: fixed;
		bottom: 0;
		min-width: 5760px;
		min-height: 512px;
		background: url('/fog_00.png') repeat-x;
		animation: slide 20s linear infinite;
		opacity: 0.08;
	}

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
		color: white;
		font-size: 24px;
		padding: 24px;
		align-self: center;
		transform: translateY(35vh);
		opacity: 0.5;
		border-image-slice: 96;
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
		border-image-slice: 192;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
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
