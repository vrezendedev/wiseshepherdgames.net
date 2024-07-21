<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import * as THREE from 'three';
	import PopUp from '$lib/components/PopUp.svelte';
	import { WiseShepherdGamesCommons } from '$lib/commons';
	import { ThreeWrapper } from '$lib/wrappers';

	let div;
	$: div;

	let displayPopUp = false;
	let upperControlsRef;

	const books = [];

	const pointer = new THREE.Vector2();

	function onPointerMove(event) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	onMount(() => {
		const scene = new THREE.Scene();

		const camera = ThreeWrapper.cameraSetup(75, window.innerWidth, window.innerHeight, 1, 1000);
		camera.position.set(10, 10, 0);

		const renderer = ThreeWrapper.rendererSetup(window.innerWidth, window.innerHeight, 0.05, {
			antialias: true
		});
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

				if (child.name.includes('Book_0')) {
					child.layers.enable(1);
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
					displayPopUp = true;
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
						const targetBook = books.find((b) => b.obj.name == intersects[i].object.name);
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
</script>

<svelte:window on:pointermove={onPointerMove} />
<div bind:this={div} id="canvas-div" class="scene-change-fade-in">
	{#if upperControlsRef != undefined && upperControlsRef.enabled == true}
		<div in:fade={{ easing: linear, delay: 750, duration: 750 }} class="controls">
			<p>Camera Zoom In/Out: Mouse Wheel | Pinch Open/Close</p>
			<p>Rotate Camera: Hold Mouse Left-Button and Move | Touch and Hold and Move Finger</p>
			<p>
				Move Camera: Hold Left-Shift and Mouse Left-Button and Move | Touch and Hold with Two
				Fingers and Move
			</p>
			<p>
				Interact: aim at the target with the Mouse Pointer and click Mouse Left-Button | Tap at the
				target
			</p>
		</div>
	{/if}
	{#if displayPopUp}
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
							displayPopUp = false;
							upperControlsRef.enabled = true;
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
	}
</style>
