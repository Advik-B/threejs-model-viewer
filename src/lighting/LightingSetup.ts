import * as THREE from 'three';

/**
 * Add realistic lighting to a scene
 */
export function addRealisticLighting(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xff6b9d, 1.0);
  pointLight1.position.set(-10, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x00d4ff, 1.0);
  pointLight2.position.set(10, 5, -5);
  scene.add(pointLight2);
}

/**
 * Add basic lighting to a scene (for visualization scenes)
 */
export function addBasicLighting(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.8);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
}
