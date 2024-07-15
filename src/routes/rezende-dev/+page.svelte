<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { ThreeWrapper } from '$lib/wrappers';

	let div;
	$: div;

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
<div bind:this={div} id="canvasDiv" class="scene-change-fade-in"></div>

<style>
	#canvasDiv {
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
</style>
