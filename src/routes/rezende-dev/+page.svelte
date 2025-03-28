<script>
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import * as THREE from 'three';
	import PopUp from '$lib/components/PopUp.svelte';
	import { WiseShepherdGamesCommons } from '$lib/commons';
	import * as helpers from '$lib/helpers';
	import { ThreeWrapper } from '$lib/wrappers';
	import AboutMeBook from '$lib/components/rezende-dev/books/AboutMeBook.svelte';
	import CurriculumBook from '$lib/components/rezende-dev/books/CurriculumBook.svelte';
	import ProgrammingBook from '$lib/components/rezende-dev/books/ProgrammingBook.svelte';
	import GameDevBook from '$lib/components/rezende-dev/books/GameDevBook.svelte';
	import ArtAndMusicBook from '$lib/components/rezende-dev/books/ArtAndMusicBook.svelte';

	let div;
	$: div;

	let displayDisclaimerPopUp = false;
	let displayBookTitle = false;
	let displayBookContent = false;
	let displayHelpInfo = false;
	let upperControlsRef;

	const books = [];
	let currentHoveredBookIndex = -1;
	const booksContent = [
		{ title: 'Art and Music', content: ArtAndMusicBook },
		{ title: 'Game Development', content: GameDevBook },
		{ title: 'About Me', content: AboutMeBook },
		{ title: 'Curriculum Vitae', content: CurriculumBook },
		{ title: 'Programming', content: ProgrammingBook }
	];

	const pointer = new THREE.Vector2();
	const rendererSizeOffset = 0.05;
	let renderer;
	let camera;
	let audio;

	function onPointerMove(event) {
		event.preventDefault();
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	function onWindowResize(event) {
		event.preventDefault();

		if (renderer && camera) {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			let offsetX = width * rendererSizeOffset;
			let offsetY = height * rendererSizeOffset;

			renderer.setSize(width - offsetX, height - offsetY);
		}
	}

	function onPointerClick(event) {
		event.preventDefault();

		if (currentHoveredBookIndex != -1 && displayBookContent == false) {
			document.body.style.cursor = 'default';
			displayBookContent = true;
			upperControlsRef.enabled = false;
			displayBookTitle = false;
			WiseShepherdGamesCommons.AudioCommons.playClickSound();
		}
	}

	onMount(() => {
		const scene = new THREE.Scene();

		camera = ThreeWrapper.cameraSetup(75, window.innerWidth, window.innerHeight, 1, 1000);
		camera.position.set(15, 15, -3);

		renderer = ThreeWrapper.rendererSetup(
			window.innerWidth,
			window.innerHeight,
			rendererSizeOffset,
			{
				antialias: true
			}
		);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;

		const canvas = div.appendChild(renderer.domElement);
		canvas.id = 'renderer';

		const controls = ThreeWrapper.orbitControlsSetup(
			camera,
			canvas,
			false,
			true,
			0.05,
			10,
			60,
			Math.PI
		);

		controls.enabled = false;
		upperControlsRef = controls;

		let pointLightPosition;

		ThreeWrapper.loadGLTF(
			'models/dungeon.glb',
			scene,
			(child) => {
				if (child.isMesh && child.name != 'Candle') {
					child.castShadow = true;
					child.receiveShadow = true;
					child.material.side = THREE.FrontSide;
				} else if (child.name == 'Candle') {
					child.castShadow = false;
					child.receiveShadow = false;
					child.material.side = THREE.FrontSide;
					pointLightPosition = new THREE.Vector3(child.position.x, 5, child.position.z);
				}

				if (child.name == 'Bookcase') child.material.roughness = 1;

				if (child.name.includes('Book_0')) {
					child.layers.enable(1);

					ThreeWrapper.addPointLight(
						scene,
						'#FF8D5A',
						4,
						1.5,
						0.25,
						false,
						false,
						new THREE.Vector2(128, 128),
						new THREE.Vector3(child.position.x - 0.15, child.position.y + 0.5, child.position.z),
						false
					);

					books.push({
						obj: child,
						hovered: false,
						moved: false,
						originalPosition: new THREE.Vector3(
							child.position.x,
							child.position.y,
							child.position.z
						),
						lightRef: undefined
					});
				}
			},
			(gltf) => {
				ThreeWrapper.addPointLight(
					scene,
					'#FF8D5A',
					15.5,
					11.5,
					0.5,
					true,
					false,
					new THREE.Vector2(2048, 2048),
					pointLightPosition,
					false
				);

				setTimeout(() => {
					displayDisclaimerPopUp = true;
				}, 500);
			},
			(xhr) => {},
			(error) => {}
		);

		const ambientLight = new THREE.AmbientLight(new THREE.Color('#534D8F'), 1);
		scene.add(ambientLight);

		scene.fog = new THREE.Fog('#1d3f58', 45, 70);

		const raycaster = new THREE.Raycaster();
		raycaster.layers.set(1);

		renderer.setAnimationLoop(
			ThreeWrapper.renderFunctionSetup(renderer, camera, scene, controls, [
				() => {
					if (!controls.enabled) return;

					raycaster.setFromCamera(pointer, camera);

					const intersects = raycaster.intersectObjects(scene.children);

					for (let i = 0; i < intersects.length; i++) {
						const targetBookIndex = books.findIndex((b) => b.obj.name == intersects[i].object.name);
						currentHoveredBookIndex = targetBookIndex;
						displayBookTitle = true;
						const targetBook = books[targetBookIndex];
						targetBook.hovered = true;

						if (!targetBook.moved) {
							targetBook.moved = true;

							intersects[i].object.position.setX(intersects[i].object.position.x + 0.25);

							const pointLight = new THREE.PointLight(new THREE.Color('#FF8D2E'), 5);
							pointLight.castShadow = false;
							pointLight.position.set(
								intersects[i].object.position.x,
								intersects[i].object.position.y + 0.01,
								intersects[i].object.position.z
							);

							targetBook.lightRef = pointLight;

							scene.add(pointLight);
						}
					}

					books.forEach((b) => {
						if (intersects.find((i) => i.object.name == b.obj.name) == undefined) {
							b.hovered = false;
						}

						if (b.hovered == false && b.moved == true) {
							b.moved = false;
							b.obj.position.setX(b.originalPosition.x);
							scene.remove(b.lightRef);
							b.lightRef = undefined;
							currentHoveredBookIndex = -1;
							displayBookTitle = false;
						}
					});

					if (intersects.length > 0) {
						document.body.style.cursor = 'pointer';
					} else {
						document.body.style.cursor = 'default';
					}
				}
			])
		);
	});

	onDestroy(() => {
		if (audio) {
			audio.pause();
		}
	});
</script>

<svelte:window
	on:pointermove={onPointerMove}
	on:pointerup={onPointerClick}
	on:resize={onWindowResize}
/>
<div bind:this={div} id="canvas-div" class="scene-change-fade-in">
	{#if upperControlsRef != undefined && upperControlsRef.enabled == true}
		<div in:fade={{ easing: linear, delay: 750, duration: 750 }} class="controls">
			<div style="display: flex; flex-direction: column; gap: 0.1rem;">
				{#if displayHelpInfo}
					<div
						in:fade={{ easing: linear, delay: 0, duration: 500 }}
						out:fade={{ easing: linear, delay: 0, duration: 325 }}
						style="margin-left: 50px;"
					>
						<p><b>Camera Zoom In/Out</b>: Mouse Wheel | Pinch Open/Close</p>
						<p><b>Rotate Camera</b>: Hold Mouse Left-Button and Move | Touch and Hold and Move</p>
						<p>
							<b>Move Camera</b>: Hold Left-Shift and Mouse Left-Button and Move | Touch and Hold
							with Two Fingers and Move
						</p>
						<p>
							<b>Interact</b>: Aim at the Target with the Mouse Pointer and Click Mouse Left-Button
							| Tap at the Target
						</p>
					</div>
				{/if}
				<button
					class="bottom-buttons base-hover"
					title="Controls"
					on:click={() => (displayHelpInfo = !displayHelpInfo)}
				>
					<img
						draggable="false"
						style="align-self: center;"
						src="/mark_question_00.png"
						alt="Help"
					/>
				</button>
			</div>
		</div>
		<div in:fade={{ easing: linear, delay: 750, duration: 750 }} class="go-to-wise-shepherd-games">
			<button
				class="bottom-buttons base-hover"
				title="Go to Wise Shepherd Games Page!"
				on:click={() => helpers.DomHelper.redirect('/wise-shepherd-games')}
			>
				<img
					draggable="false"
					style="align-self: center; border-radius:50%;"
					src="/favicon.png"
					alt="Wise Shepherd Games"
				/>
			</button>
			<button
				class="bottom-buttons base-hover"
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
	{/if}

	{#if displayBookTitle}
		<div
			in:fade={{ easing: linear, delay: 0, duration: 325 }}
			out:fade={{ easing: linear, delay: 0, duration: 325 }}
			class="book-title jost-light-300"
			style="z-index: 9"
		>
			<div
				style="display: flex; flex-direction: row; gap: 3rem; justify-content: center; align-items: center;"
			>
				<img
					style="width: 30px; height: 30px; transform: rotateZ(180deg)"
					src="/selected_00.png"
					alt="Attachment"
				/>
				<h1 style="z-index: 10; text-align:center;">
					{booksContent[currentHoveredBookIndex].title}
				</h1>
				<img style="width: 30px; height: 30px;" src="/selected_00.png" alt="Attachment" />
			</div>
			<div
				style="position: absolute; margin: 10px; width: 100%; height: 90%; 
				background-color: rgb(0, 0, 0);
				background: linear-gradient(
					90deg,
					rgba(0, 0, 0, 0) 0%,
					rgba(50, 50, 50, 0.25) 15%,
					rgba(50, 50, 50, 0.5) 50%,
					rgba(50, 50, 50, 0.25) 85%,
					rgba(0, 0, 0, 0) 100%
				);
				z-index: 1"
			/>
		</div>
	{/if}

	{#if displayBookContent}
		<PopUp width={undefined} height={undefined}>
			<div class="pop-up-content jost-light-300">
				<div
					style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
				>
					<svelte:component this={booksContent[currentHoveredBookIndex].content} />
					<br />
					<button
						on:click={() => {
							displayBookContent = false;
							upperControlsRef.enabled = true;
						}}
						on:mousedown={() => {
							WiseShepherdGamesCommons.AudioCommons.playClickSound();
						}}
						class="base-hover jost-light-300"
					>
						Ok!</button
					>
					<br />
				</div>
			</div>
		</PopUp>
	{/if}

	{#if displayDisclaimerPopUp}
		<PopUp width={undefined} height={undefined}>
			<div class="pop-up-content jost-light-300">
				<div
					style="display: flex; flex-direction: row; justify-content: center; align-items: center;"
				>
					<img draggable="false" src="/books.png" alt="Book" />
				</div>
				<div
					style="display: flex; flex-direction: column; justify-content: center; align-items: left;"
				>
					<h1>Disclaimer</h1>
					<p>For a better experience, try this webpage on a computer.</p>
					<h1>Quick Tip</h1>
					<p>Not every element displayed on the scenario is interactable, therefore...</p>
					<p>
						Only the <b>BOOKS</b> on the <b>BOOKSHELF</b> are interactable by
						<b>CLICKING</b> on it.
					</p>
					<br />
					<button
						on:click={() => {
							displayDisclaimerPopUp = false;
							upperControlsRef.enabled = true;
							audio = new Audio('/dungeon_ambience.mp3');
							audio.volume = 0.025;
							audio.play();
							audio.loop = true;
						}}
						on:mousedown={() => {
							WiseShepherdGamesCommons.AudioCommons.playClickSound();
						}}
						class="base-hover jost-light-300">Ok!</button
					>
				</div>
			</div>
		</PopUp>
	{/if}
</div>

<style>
	#canvas-div {
		margin: 0;
		padding: 0;
		padding-top: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#renderer {
		margin: 0;
		padding: 0;
	}

	.pop-up-content {
		display: flex;
		flex-direction: row;
	}

	.pop-up-content p {
		margin: 0;
		padding-right: 42px;
	}

	.pop-up-content img {
		width: 350px;
		height: auto;
	}

	.pop-up-content button {
		width: 100px;
		height: 40px;
		background-color: var(--card-bg-color);
		color: white;
		font-size: 24px;
		align-self: center;
		opacity: 0.5;
		border: none;
		border-radius: 4px;
	}

	.bottom-buttons {
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
		animation: shake 2s infinite;
	}

	.bottom-buttons:hover {
		animation: none;
	}

	.bottom-buttons img {
		width: 50px;
		height: 50px;
	}

	.controls {
		user-select: none;
		position: absolute;
		width: auto;
		height: auto;
		margin-left: calc(100% * 0.03);
		margin-bottom: calc(100% * 0.0125);
		display: flex;
		flex-direction: column;
		align-items: left;
		bottom: 0;
		left: 0;
	}

	.go-to-wise-shepherd-games {
		user-select: none;
		position: absolute;
		width: auto;
		height: auto;
		margin-right: calc(100% * 0.03);
		margin-bottom: calc(100% * 0.0125);
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		align-items: right;
		bottom: 0;
		right: 0;
	}

	.book-title {
		user-select: none;
		position: absolute;
		width: 50%;
		top: 0;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 24px;
		border: 10px solid;
		border-image-slice: 1;
		border-width: 5px;
		border-image-source: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(50, 50, 50, 0.25) 15%,
			rgba(50, 50, 50, 0.5) 50%,
			rgba(50, 50, 50, 0.25) 85%,
			rgba(0, 0, 0, 0) 100%
		);
		border-right: none;
		border-left: none;
	}

	.controls p {
		margin: 0;
		padding: 0;
		font-size: 16px;
	}

	@media (max-width: 600px) {
		.pop-up-content {
			flex-direction: column-reverse;
		}

		.pop-up-content img {
			width: 200px;
			height: 200px;
		}

		.pop-up-content div {
			justify-content: center;
			align-items: center;
			text-align: justify;
		}

		.pop-up-content p {
			padding-left: 16px;
			padding-right: 16px;
		}

		.controls p {
			font-size: 12px;
		}

		.bottom-buttons {
			width: 35px;
			height: 35px;
		}

		.bottom-buttons img {
			width: 35px;
			height: 35px;
		}
	}
</style>
