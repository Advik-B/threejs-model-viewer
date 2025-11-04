import * as THREE from 'three';
import { CLIPPING_PLANE_MULTIPLIER } from '../config/constants';

/**
 * Update camera clipping planes based on model bounds
 */
export function updateCameraClippingPlanes(
  cameras: THREE.PerspectiveCamera[],
  box: THREE.Box3
): void {
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  const nearPlane = Math.max(0.01, maxDimension * 0.01);
  const distance = maxDimension * CLIPPING_PLANE_MULTIPLIER;
  const farPlane = distance * 10;
  
  console.log(`Updating camera clipping planes - Near: ${nearPlane.toFixed(2)}, Far: ${farPlane.toFixed(2)}`);
  
  cameras.forEach((camera) => {
    camera.near = nearPlane;
    camera.far = farPlane;
    camera.updateProjectionMatrix();
  });
}
