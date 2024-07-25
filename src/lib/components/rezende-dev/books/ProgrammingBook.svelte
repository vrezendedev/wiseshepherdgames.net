<script>
	const programmingLanguages = [
		'C#',
		'Javascript',
		'Typescript',
		'Lua',
		'Go',
		'OCaml',
		'SQL',
		'HTML',
		'CSS'
	];
</script>

<div class="programming-book">
	<h1>Programming</h1>
	<p style="text-align: justify;">
		Mainly, I try to be a generalist, but specifically, I consider myself a programmer. I graduated
		in Information Systems in 2024 - achieving a bachelor's degree. I've been working in the IT
		industry since 2021. Also, I know different stacks of technology <a
			data-sveltekit-reload
			rel="external"
			class="base-hover"
			target="_blank"
			href={'https://github.com/vrezendedev'}
		>
			(check on GitHub)</a
		> and find no trouble learning new ones. I'm well acquainted with data structures, design patterns,
		and programming paradigms, nonetheless, I'm well versed in many programming languages, listed below:
	</p>
	<div
		style="width: 100%; display: flex; flex-direction: row; justify-content: space-around; flex-wrap: wrap; gap:0.5rem;"
	>
		{#each programmingLanguages as pl}
			<span>◻ {pl}</span>
		{/each}
	</div>
</div>

<style>
	.programming-book {
		width: 550px;
		display: flex;
		flex-direction: column;
		padding: 24px;
		justify-content: center;
		align-items: center;
	}

	.programming-book span {
		font-size: 1rem;
		vertical-align: middle;
	}

	@media (max-width: 600px) {
		.programming-book {
			width: 90%;
			padding: 8px;
		}
	}
</style>
