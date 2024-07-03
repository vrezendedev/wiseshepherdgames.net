<script>
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';

	export let data;
</script>

{#key data.url}
	<div
		class="fade-div"
		in:fade={{ easing: quadInOut, delay: 0, duration: 500 }}
		out:fade={{ easing: quadInOut, delay: 0, duration: 500 }}
	>
		<slot />
	</div>
{/key}

<style>
	.fade-div {
		margin: 0;
		padding: 0;
	}
</style>
