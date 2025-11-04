import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CAMERA_FOV, DARK_BG_COLOR, ORBIT_DAMPING_FACTOR } from '../config/constants';
import { RendererLike } from '../types/renderer';
import { ViewType } from '../config/viewConfigs';

export interface SceneConfig {
  type: ViewType;
  backgroundColor?: number;
}

export interface SceneComponents {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
}

/**
 * Create a scene with camera and orbit controls
 */
export function createScene(
  renderer: RendererLike,
  config: SceneConfig
): SceneComponents {
  const scene = new THREE.Scene();
  
  if (config.backgroundColor !== undefined) {
    scene.background = new THREE.Color(config.backgroundColor);
  } else if (config.type !== 'realistic') {
    scene.background = new THREE.Color(DARK_BG_COLOR);
  }
  
  // Initial aspect ratio - will be properly set when viewports are configured
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    1,
    0.1,
    1000
  );
  camera.position.set(0, 2, 5);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = ORBIT_DAMPING_FACTOR;
  controls.autoRotate = false;
  controls.target.set(0, 1, 0);
  controls.update();
  
  return { scene, camera, controls };
}

/**
 * Synchronize secondary cameras with the primary camera
 */
export function syncCameras(
  primaryCamera: THREE.PerspectiveCamera,
  primaryControls: OrbitControls,
  secondaryCameras: Array<{ camera: THREE.PerspectiveCamera; controls: OrbitControls }>
): void {
  secondaryCameras.forEach(({ camera, controls }) => {
    camera.position.copy(primaryCamera.position);
    camera.quaternion.copy(primaryCamera.quaternion);
    camera.updateProjectionMatrix();
    controls.target.copy(primaryControls.target);
  });
}
