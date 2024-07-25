<script>
	const links = [
		{ title: 'LinkedIn', url: 'https://www.linkedin.com/in/vinicius-inacio-rezende' },
		{ title: 'GitHub', url: 'https://github.com/vrezendedev' },
		{ title: 'Itch.Io', url: 'https://wiseshepherd.itch.io' },
		{ title: 'Bandcamp', url: 'https://wiseshepherd.bandcamp.com' },
		{ title: 'YouTube', url: 'https://www.youtube.com/@wsvrez' }
	];
</script>

<div class="curriculum-book">
	<h1>Curriculum Vitae</h1>
	<p style="text-align: justify;">
		To showcase different skill sets, I published all created content on specific websites based on
		its type. You can see all visual art produced through the videos or images published on my
		YouTube channel or any other social media, including the studio's website - also, of course, by
		playing released games. By the way, you can also check my music on YouTube and, sometimes, on
		Bandcamp. For professional background, check my LinkedIn and, for programming stuff, you can
		check my GitHub. My Itch.io is a good spot to check some game jam or prototype stuff.
	</p>
	<div data-sveltekit-reload class="curriculum-book-links">
		{#each links as { title, url }, i}
			<a data-sveltekit-reload rel="external" class="base-hover" target="_blank" href={url}
				>{title}</a
			>
		{/each}
	</div>
</div>

<style>
	.curriculum-book {
		width: 550px;
		display: flex;
		flex-direction: column;
		padding: 24px;
		justify-content: center;
		align-items: center;
	}

	.curriculum-book-links {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		flex-wrap: wrap;
	}

	@media (max-width: 600px) {
		.curriculum-book {
			width: 90%;
			padding: 8px;
		}
	}
</style>
