<script>
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { onMount } from 'svelte';

	export let width;
	export let height;

	let popUpContainer;

	onMount(() => {
		if (width && height) {
			popUpContainer.style = `width:${width}px; height:${height}px`;
		}
	});
</script>

<div
	in:fade={{ easing: linear, delay: 0, duration: 750 }}
	out:fade={{ easing: linear, delay: 0, duration: 750 }}
	class="pop-up-background"
>
	<div bind:this={popUpContainer} class="base-border pop-up-container">
		<slot />
	</div>
</div>

<style>
	.pop-up-background {
		position: absolute;
		min-width: calc(100% - 32px);
		min-height: calc(100% - 32px);
		padding: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		backdrop-filter: blur(10px);
		overflow: hidden;
	}

	.pop-up-container {
		position: relative;
		background-color: var(--card-bg-color);
		padding: 12px;
		width: auto;
		height: auto;
	}
</style>
