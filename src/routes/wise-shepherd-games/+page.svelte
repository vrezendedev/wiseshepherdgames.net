<script>
	import * as helpers from '$lib/helpers';
	import { fade } from 'svelte/transition';
	import { linear, quadInOut } from 'svelte/easing';

	const navbarElements = [
		{ title: 'HOME', elementID: 'home-div' },
		{ title: 'ABOUT US', elementID: 'about-div' },
		{ title: 'GAMES', elementID: 'games-div' },
		{ title: 'CONTACT', elementID: 'contact-div' }
	];

	const team = [
		{
			name: 'Vinicius Rezende',
			img: '/rezende_bw_00.png',
			roles: 'Programmer, designer, artist, sound designer and musician.',
			website: { external: false, url: '/rezende-dev' },
			pronoum: 'him'
		}
	];

	const games = [
		{
			title: 'Sandtide',
			status: 'In Development',
			date: 'TBA',
			platform: 'PC',
			img: '/games/sandtide_logo_00.png',
			genres: 'Real Time Strategy | Roguelike | Management',
			description: `In the distant future, a new galaxy has been discovered, filled with floating islands containing Enud — the most valuable ore in the known universe. 
				Commanders from various factions of the Universal Order have been chosen to explore these newly discovered lands. 
				Choose between unique playable factions, explore randomly generated isometric worlds, build structures, recruit units, produce resources, research new technologies, and strive to survive. 
				<br/>
				<br/>
				Sandtide is an old-school-like 2D isometric real-time strategy and management game with a roguelike twist.
			`
		}
	];
</script>

<div style="font-size: 1.15rem;" class="contents">
	<div class="nav-bar">
		{#each navbarElements as { title, elementID }, i}
			<button
				class="base-hover jost-light-300"
				on:click={() => {
					let element = document.getElementById(elementID);
					element.scrollIntoView({
						behavior: 'smooth',
						block: 'end',
						inline: 'nearest'
					});
				}}>{title}</button
			>
			{#if i == navbarElements.length / 2 - 1}
				<img style="" draggable="false" src="favicon.png" alt="Wise Shepherd Games Icon" />
			{/if}
		{/each}
	</div>
	<div id="home-div" class="content-div jost-light-300">
		<img
			style="	align-self: center;"
			src="/logo.png"
			draggable="false"
			alt="Wise Shepherd Games Logo"
		/>
		<div style="display: flex; flex-direction: column; justify-content: center; align-items:left;">
			<h1>Home</h1>
			<p style="text-align: justify;">
				A one-guy "team" decided to start creating games under the name of Wise Shepherd Games.
				Different ideas, mixing genres, and trying out new mechanics to bring a breath of fresh air
				to, a sometimes, saturated environment. On top of that, all games share the same universe -
				within the same time-lines or not. Finally, expect an iterating process through each
				experience to improve the most valuable characteristic that a game can deliver: joy.
			</p>
			<p style="text-align: right; font-weight: bold;">
				<em>Sheeping</em> unique and enjoyable games.
			</p>
		</div>
	</div>
	<div class="divider" />
	<div class="content-div jost-light-300">
		<div
			id="about-div"
			style="display: flex; flex-direction: column; justify-content: center; align-items:left;"
		>
			<h1>About Us</h1>
			<p style="text-align: justify;">
				Wise Shepherd Games is an indie game developer "studio" from Brazil. Founded by Vinicius
				Rezende, also known by his nickname, Wise Shepherd. On Wise Shepherd Games, we share a deep
				passion for unique, fantastical, and complex worlds. Our goal is to create a new universe to
				explore through different experiences. Heavily inspired by well-known sci-fi and
				high-fantasy masterpieces, our designs focus on immersion - mechanic-wise and story-wise.
			</p>
			<p style="font-weight: bold;">Meet our team:</p>
			{#each team as member}
				<div style="display: flex; flex-direction: row-reverse; gap: 1rem; margin-bottom: 10px;">
					<img
						style="width: 125px; height: 125px; border-radius:50%"
						draggable="false"
						src={member.img}
						alt="Member"
					/>
					<div
						style="display: flex; flex-direction: column; justify-content: center; text-align: right;"
					>
						<p><b>{member.name}</b></p>
						<p style="margin-top: 0;">{member.roles}</p>
						<button
							data-sveltekit-reload
							on:click={() => helpers.DomHelper.redirect(member.website.url) }
							class="base-hover"
							style="background-color: transparent; border: none; opacity: 0.5; color:white; z-index: 1; text-align: right;">Know more about {member.pronoum}</button
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="divider" />
	<div id="games-div" class="content-div jost-light-300">
		<div style="display: flex; flex-direction: column; justify-content: center; align-items:left;">
			<h1>Games</h1>
			{#each games as game}
				<div class="games-div-game-info">
					<img
						style="width: 250px; height: 250px; margin-bottom: 0;"
						draggable="false"
						src={game.img}
						alt="Member"
					/>
					<div
						style="display: flex; flex-direction: column; justify-content: center; align-items: left;"
					>
						<h3 style="margin-bottom: 0;">{game.title}</h3>
						<p style="margin-top: 0; margin-bottom: 0;">Status: {game.status}</p>
						<p style="margin-top: 0; margin-bottom: 0;">Release Date: {game.date}</p>
						<p style="margin-top: 0; margin-bottom: 0;">Platform: {game.platform}</p>
						<p style="margin-top: 0;">Genres: {game.genres}</p>
						<p
							style="text-align: justify;"
							contenteditable="true"
							bind:innerHTML={game.description}
						></p>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="divider" />
	<div id="contact-div" class="content-div jost-light-300">
		<div style="display: flex; flex-direction: column; justify-content: center; align-items:left;">
			<h1>Contact</h1>
			<p style="text-align: justify;">
				Our official means of communication are through our e-mail, <em
					>contact@wiseshepherdgames.net</em
				>, and our Discord Channel, which you can join by clicking on the Discord icon below. Also,
				a lot of content related to our game's development is shared on Rezende's YouTube channel,
				which you can access by clicking on the YouTube icon below.
			</p>
			<br />
			<div style="display: flex; justify-content: center; align-items:center; gap: 2rem;">
				<button
					title="Redirect to discord's channel invite page."
					class="contact-buttons base-hover"
					on:click={() => {
						helpers.DomHelper.redirect('https://discord.gg/KbtsJ5jXQH');
					}}
				>
					<img src="discord_logo.png" alt="Discord Logo" />
				</button>
				<button
					title="Redirect to Rezende's YouTube channel."
					class="contact-buttons base-hover"
					on:click={() => {
						helpers.DomHelper.redirect('https://www.youtube.com/@wsvrez');
					}}
				>
					<img src="youtube_logo.png" alt="Youtube Logo" />
				</button>
			</div>
			<br />
			<p style="text-align: center; font-size: 0.75rem; margin-bottom: 0;">
				© WISE SHEPHERD GAMES. ALL RIGHTS RESERVED.
			</p>
		</div>
	</div>

	<button
		in:fade={{ easing: linear, delay: 250, duration: 750 }}
		class="ws-bottom-buttons base-hover"
		title="Go to Hub Page!"
		on:click={() => helpers.DomHelper.redirect('/')}
	>
		<img
			draggable="false"
			style="align-self: center; border-radius:50%;"
			src="/home_00.png"
			alt="Hub"
		/>
	</button>
</div>

<style>
	.nav-bar {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		margin: 0;
		padding-top: 5px;
		padding-bottom: 5px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 2rem;
		align-items: center;
		background-color: #131313;
	}

	.nav-bar button {
		border: none;
		color: white;
		background-color: rgba(0, 0, 0, 0);
		font-size: 1rem;
		font-weight: bold;
		opacity: 0.5;
		z-index: 10;
	}

	.nav-bar img {
		width: 75px;
		height: 75px;
	}

	.contents {
		display: flex;
		flex-direction: column;
		padding: 0;
		margin: 0;
		padding-top: 3.5%;
		width: 100%;
		align-items: center;
	}

	.content-div {
		display: flex;
		flex-direction: row;
		max-width: 50%;
	}

	.content-div h1 {
		margin-bottom: 0;
	}

	.content-div img {
		width: 250px;
		height: 250px;
	}

	.divider {
		width: 50%;
		height: 4px;
		margin: 0;
		padding: 0;
		background-color: #131313;
		border-radius: 10px;
	}

	.games-div-game-info {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}

	.games-div-game-info img {
		align-self: center;
	}

	.contact-buttons {
		background-color: white;
		width: 50px;
		height: 50px;
		opacity: 0.5;
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.contact-buttons img {
		width: 50px;
		height: 50px;
	}

	.ws-bottom-buttons {
		position: fixed;
		left: 16px;
		bottom: 16px;
		width: 50px;
		height: 50px;
		background-color: var(--card-bg-color);
		opacity: 0.5;
		border: none;
		border-radius: 60px;
		align-self: flex-start;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ws-bottom-buttons :hover {
		animation: none;
	}

	.ws-bottom-buttons img {
		width: 50px;
		height: 50px;
	}

	@media (max-width: 1440px) {
		.contents {
			padding-top: 8%;
		}
	}

	@media (max-width: 1024px) {
		.games-div-game-info {
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	@media (max-width: 768px) {
		.contents {
			padding-top: 10%;
		}

		.nav-bar {
			gap: 0.75rem;
		}

		.nav-bar button {
			font-size: 0.75rem;
		}

		.nav-bar img {
			width: 40px;
			height: 40px;
		}

		.content-div {
			flex-direction: column-reverse;
		}

		.content-div img {
			width: 150px;
			height: 150px;
		}

		.contact-buttons img {
			width: 50px;
			height: 50px;
		}

		.content-div {
			max-width: 100%;
			align-items: center;
		}

		.divider {
			width: 100%;
		}
	}
</style>
