import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { EquirectangularReflectionMapping } from 'three';
import { PARTICLE_COLOR, WIREFRAME_EMISSIVE_INTENSITY } from '../config/constants';

/**
 * Load and configure GLTF model materials
 */
export function loadModel(path: string): Promise<GLTF> {
  const loader = new GLTFLoader();
  
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf: GLTF) => {
        console.log('Model loaded:', gltf);
        
        // Configure all materials
        gltf.scene.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            console.log('Found mesh:', child.name);
            
            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              
              materials.forEach((mat: THREE.Material) => {
                mat.side = THREE.FrontSide;
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.metalness = 0.3;
                  mat.roughness = 0.4;
                }
              });
            }
          }
        });
        
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
}

/**
 * Load HDR environment map
 */
export function loadHDREnvironment(path: string, scene: THREE.Scene): void {
  const rgbeLoader = new HDRLoader();
  rgbeLoader.load(path, (texture: THREE.DataTexture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
}

/**
 * Create wireframe clone of a model
 */
export function createWireframeClone(object: THREE.Object3D): THREE.Object3D {
  const wireframeClone = object.clone();
  wireframeClone.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const meshChild = child as THREE.Mesh;
      meshChild.material = new THREE.MeshPhongMaterial({
        color: PARTICLE_COLOR,
        wireframe: true,
        emissive: PARTICLE_COLOR,
        emissiveIntensity: WIREFRAME_EMISSIVE_INTENSITY
      });
    }
  });
  return wireframeClone;
}

/**
 * Find the first mesh with geometry in an object
 */
export function findMeshWithGeometry(object: THREE.Object3D): THREE.Mesh | null {
  let foundMesh: THREE.Mesh | null = null;
  
  object.traverse((child: THREE.Object3D) => {
    if (!foundMesh && (child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        foundMesh = mesh;
      }
    }
  });
  
  return foundMesh;
}
