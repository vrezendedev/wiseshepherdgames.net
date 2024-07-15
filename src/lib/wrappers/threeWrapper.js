import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function cameraSetup(fov, width, height, near, far) {
	const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
	return camera;
}

export function rendererSetup(width, height, offsetFactor, rendererParameters) {
	const renderer = new THREE.WebGLRenderer(rendererParameters);

	let offsetX = width * offsetFactor;
	let offsetY = height * offsetFactor;

	renderer.setSize(width - offsetX, height - offsetY);

	return renderer;
}

export function orbitControlsSetup(
	camera,
	canvas,
	screenSpacePanning,
	enableDamping,
	dampingFactor,
	minDistance,
	maxDistance,
	maxPolarAngle
) {
	const controls = new OrbitControls(camera, canvas);

	controls.screenSpacePanning = screenSpacePanning;
	controls.enableDamping = enableDamping;
	controls.dampingFactor = enableDamping ? dampingFactor : 0;
	controls.minDistance = minDistance;
	controls.maxDistance = maxDistance;
	controls.maxPolarAngle = maxPolarAngle;

	return controls;
}

export function renderFunctionSetup(renderer, camera, scene, controls, raycasterCallbacks) {
	return () => {
		controls?.update();
		raycasterCallbacks?.forEach((callback) => callback());
		renderer?.render(scene, camera);
	};
}

export function loadGLTF(
	path,
	scene,
	afterLoadTransverseCallback,
	afterLoadCallback,
	whileLoadingCallback,
	onErrorCallback
) {
	const loader = new GLTFLoader();

	loader.load(
		path,
		(gltf) => {
			gltf.scene.traverse((child) => afterLoadTransverseCallback(child));
			afterLoadCallback();
			scene.add(gltf.scene);
		},
		(xhr) => whileLoadingCallback(xhr),
		(error) => onErrorCallback(error)
	);
}

export function addPointLight(
	scene,
	color,
	intensity,
	distance,
	decay,
	castShadow,
	receiveShadow,
	mapSize,
	position,
	addHelper
) {
	const pointLight = new THREE.PointLight(new THREE.Color(color), intensity, distance, decay);

	pointLight.castShadow = castShadow;
	pointLight.receiveShadow = receiveShadow;
	pointLight.shadow.mapSize = mapSize;
	pointLight.position.set(position.x, position.y, position.z);

	if (addHelper) {
		const pointLightHelper = new THREE.PointLightHelper(pointLight);
		scene.add(pointLightHelper);
	}

	scene.add(pointLight);
}
