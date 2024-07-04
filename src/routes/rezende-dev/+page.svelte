<script>
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let div;
	$: div;

	onMount(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		let offsetFactor = 0.05;
		let offsetX = window.innerWidth * offsetFactor;
		let offsetY = window.innerHeight * offsetFactor;
		renderer.setSize(window.innerWidth - offsetX, window.innerHeight - offsetY);
		let child = div.appendChild(renderer.domElement);
		child.id = 'renderer';

		const geometry = new THREE.BoxGeometry(10, 10, 10);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
		scene.add(cube);

		camera.position.z = 20;

		function animate() {
			cube.rotateZ(0.01);
			cube.rotateY(0.01);
			renderer.render(scene, camera);
		}

		renderer.setAnimationLoop(animate);
	});
</script>

<div bind:this={div} id="canvasDiv" class="scene-change-fade-in"></div>

<style>
	#canvasDiv {
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#renderer {
		margin: 0;
		padding: 0;
	}
</style>
