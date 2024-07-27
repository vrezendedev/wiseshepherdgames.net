<script>
	const navbarElements = [
		{ title: 'HOME', elementID: 'home-div' },
		{ title: 'ABOUT US', elementID: 'about-div' },
		{ title: 'GAMES', elementID: '' },
		{ title: 'CONTACT', elementID: '' }
	];

	const team = [
		{
			name: 'Vinicius Rezende',
			img: '/rezende_bw_00.png',
			title: 'Programmer, designer, artist, sound designer and musician.',
			website: '/rezende-dev',
			pronoum: 'him'
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
					let pos = element.getBoundingClientRect();
					window.scrollTo(pos.left, pos.top);
				}}>{title}</button
			>
			{#if i == navbarElements.length / 2 - 1}
				<img style="" draggable="false" src="favicon.png" alt="Wise Shepherd Games Icon" />
			{/if}
		{/each}
	</div>
	<div id="home-div" class="content-div jost-light-300">
		<img src="/logo.png" draggable="false" alt="Wise Shepherd Games Logo" />
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
	<div id="about-div" class="content-div jost-light-300">
		<div style="display: flex; flex-direction: column; justify-content: center; align-items:left;">
			<h1>About Us</h1>
			<p style="text-align: justify;">
				Wise Shepherd Games is an indie game developer from Brazil. Founded by Vinicius Rezende,
				also known by his nickname, Wise Shepherd. On Wise Shepherd Games, we share a deep passion
				for unique, fantastical, and complex worlds. Our goal is to create a new universe to explore
				through different experiences. Heavily inspired by well-known sci-fi and high-fantasy
				masterpieces, our designs focus on immersion - mechanic-wise and story-wise.
			</p>
			<p style="text-align: right; font-weight: bold;">Meet our team:</p>
			{#each team as member}
				<div style="display: flex; flex-direction: row; gap: 1rem; margin-bottom: 10px;">
					<img
						style="width: 125px; height: 125px; border-radius:50%"
						src={member.img}
						alt="Member"
					/>
					<div style="display: flex; flex-direction: column; justify-content: center;">
						<p><b>{member.name}</b></p>
						<p style="margin-top: 0;">{member.title}</p>
						<a href={member.website} class="base-hover" style="opacity: 0.5; color:white;"
							>Know more about {member.pronoum}</a
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="divider" />
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

	@media (max-width: 1440px) {
		.contents {
			padding-top: 8%;
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

		.content-div {
			max-width: 100%;
			align-items: center;
		}

		.divider {
			width: 100%;
		}
	}
</style>
