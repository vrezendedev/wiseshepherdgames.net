<script>
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { onMount } from 'svelte';

	let hubOptions = [
		{ title: 'Rezende Dev', description: '', href: 'rezende-dev', image: '/logo.png' },
		{
			title: 'Wise Shepherd Games',
			description: '',
			href: 'wise-shepherd-games',
			image: '/logo.png'
		}
	];

	let currentHover = -1;

	let currentText = '';
	let targetText = 'Select your destiny wisely...';
	let shouldDisplayCards = false;

	setTimeout(() => {
		let interval = setInterval(() => {
			if (currentText.length - 1 == targetText.length) {
				clearInterval(interval);
				shouldDisplayCards = true;
				setInterval(() => {
					currentText =
						currentText.length == targetText.length
							? currentText + ' |'
							: targetText.substring(0, currentText.length - 1);
				}, 500);
				return;
			}

			currentText = targetText.substring(0, currentText.length) + '|';
		}, 100);
	}, 1000);
</script>

<div style="display: flex; flex-direction: column; height: 100%; text-align: center;  ">
	<h1
		style="align-self: center; animation-name: fade-in;
	    animation-duration: 2s; "
	>
		{currentText}
	</h1>
	{#if shouldDisplayCards}
		<hr in:fade={{ easing: linear, delay: 0, duration: 750 }} style="width: 100%" />
		<div in:fade={{ easing: linear, delay: 0, duration: 750 }} class="hub">
			{#each hubOptions as { title, description, href, image }, i}
				<div class="hub-card-container">
					<img
						src="selected_00.png"
						class="hub-card-selected-image"
						style={`opacity: ${i == currentHover ? 1 : 0}`}
						alt={title}
					/>
					<div
						class="hub-card"
						role="button"
						tabindex={0}
						on:mouseenter={() => (currentHover = i)}
						on:mouseleave={() => (currentHover = -1)}
						on:mousedown={() => {
							let link = document.createElement('a');
							link.href = href;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						}}
					></div>
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
	}

	.hub-card:hover {
		cursor: pointer;
		opacity: 1;
	}

	.hub-card-selected-image {
		width: 50px;
		height: 50px;
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
			width: 35px;
			height: 35px;
		}
	}
</style>
