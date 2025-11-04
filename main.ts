import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { EquirectangularReflectionMapping } from 'three';
import { WebGPURenderer } from 'three/webgpu';


// Constants
const PARTICLE_COLOR = 0x00ff88;
const PARTICLE_SIZE = 0.02;
const VERTEX_PARTICLE_SIZE = PARTICLE_SIZE;
const NUM_PARTICLES = 10000;
const CAMERA_FOV = 60;
const DARK_BG_COLOR = 0x0a0a0a;
const WIREFRAME_EMISSIVE_INTENSITY = 0.5;
const ORBIT_DAMPING_FACTOR = 0.05;
const MODEL_PATH = 'Y-Bot/result.gltf';
const SKYBOX_TEXTURE = 'skybox_4k.hdr';
const CLIPPING_PLANE_MULTIPLIER = 2.0; // Multiplier to add padding to calculated far plane

// Helper function to update camera clipping planes based on model bounds
function updateCameraClippingPlanes(
  cameras: THREE.PerspectiveCamera[],
  box: THREE.Box3
): void {
  // Calculate the size of the bounding box
  const size = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  
  // Calculate appropriate near and far planes
  const center = box.getCenter(new THREE.Vector3());
  const distance = maxDimension * CLIPPING_PLANE_MULTIPLIER;
  
  // Set near plane to a small fraction of the model size to avoid clipping nearby geometry
  const nearPlane = Math.max(0.01, maxDimension * 0.01);
  
  // Set far plane to accommodate the model + extra padding for camera movement
  const farPlane = distance * 10;
  
  console.log(`Updating camera clipping planes - Near: ${nearPlane.toFixed(2)}, Far: ${farPlane.toFixed(2)}`);
  
  // Update all provided cameras
  cameras.forEach((camera) => {
    camera.near = nearPlane;
    camera.far = farPlane;
    camera.updateProjectionMatrix();
  });
}

// Create main renderer
const renderer = new WebGPURenderer({ antialias: true });
await renderer.init(); // This is required for WebGPURenderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

// Left scene - Realistic rendered model
const sceneLeft = new THREE.Scene();


const rgbeLoader = new HDRLoader();
rgbeLoader.load(SKYBOX_TEXTURE, (texture: THREE.DataTexture) => {
  texture.mapping = EquirectangularReflectionMapping;
  sceneLeft.background = texture;
  sceneLeft.environment = texture; // Optional: affects reflections
});


const cameraLeft = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth/4/window.innerHeight, 0.1, 1000);
cameraLeft.position.set(0, 2, 5);

const controlsLeft = new OrbitControls(cameraLeft, renderer.domElement);
controlsLeft.enableDamping = true;
controlsLeft.dampingFactor = ORBIT_DAMPING_FACTOR;
controlsLeft.autoRotate = false;
controlsLeft.target.set(0, 1, 0);
controlsLeft.update();

// Middle-Left scene - Wireframe
const sceneMiddleLeft = new THREE.Scene();
sceneMiddleLeft.background = new THREE.Color(DARK_BG_COLOR);

const cameraMiddleLeft = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth/4/window.innerHeight, 0.1, 1000);
cameraMiddleLeft.position.set(0, 2, 5);

const controlsMiddleLeft = new OrbitControls(cameraMiddleLeft, renderer.domElement);
controlsMiddleLeft.enableDamping = true;
controlsMiddleLeft.dampingFactor = ORBIT_DAMPING_FACTOR;
controlsMiddleLeft.autoRotate = false;
controlsMiddleLeft.target.set(0, 1, 0);
controlsMiddleLeft.update();

// Middle-Right scene - Particle projection
const sceneMiddleRight = new THREE.Scene();
sceneMiddleRight.background = new THREE.Color(DARK_BG_COLOR);

const cameraMiddleRight = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth/4/window.innerHeight, 0.1, 1000);
cameraMiddleRight.position.set(0, 2, 5);

const controlsMiddleRight = new OrbitControls(cameraMiddleRight, renderer.domElement);
controlsMiddleRight.enableDamping = true;
controlsMiddleRight.dampingFactor = ORBIT_DAMPING_FACTOR;
controlsMiddleRight.autoRotate = false;
controlsMiddleRight.target.set(0, 1, 0);
controlsMiddleRight.update();

// Right scene - Vertices only
const sceneRight = new THREE.Scene();
sceneRight.background = new THREE.Color(DARK_BG_COLOR);

const cameraRight = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth/4/window.innerHeight, 0.1, 1000);
cameraRight.position.set(0, 2, 5);

const controlsRight = new OrbitControls(cameraRight, renderer.domElement);
controlsRight.enableDamping = true;
controlsRight.dampingFactor = ORBIT_DAMPING_FACTOR;
controlsRight.autoRotate = false;
controlsRight.target.set(0, 1, 0);
controlsRight.update();

// Lighting for left scene (realistic)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
sceneLeft.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.far = 50;
sceneLeft.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xff6b9d, 1.0);
pointLight1.position.set(-10, 5, 5);
sceneLeft.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00d4ff, 1.0);
pointLight2.position.set(10, 5, -5);
sceneLeft.add(pointLight2);

// Lighting for right scene (particle visualization)
const ambientLightRight = new THREE.AmbientLight(0xffffff, 0.4);
sceneRight.add(ambientLightRight);

const pointLightRight = new THREE.PointLight(0xffffff, 0.8);
pointLightRight.position.set(5, 5, 5);
sceneRight.add(pointLightRight);

// Lighting for middle-left scene (wireframe visualization)
const ambientLightMiddleLeft = new THREE.AmbientLight(0xffffff, 0.4);
sceneMiddleLeft.add(ambientLightMiddleLeft);

const pointLightMiddleLeft = new THREE.PointLight(0xffffff, 0.8);
pointLightMiddleLeft.position.set(5, 5, 5);
sceneMiddleLeft.add(pointLightMiddleLeft);

// Lighting for middle-right scene (particle visualization)
const ambientLightMiddleRight = new THREE.AmbientLight(0xffffff, 0.4);
sceneMiddleRight.add(ambientLightMiddleRight);

const pointLightMiddleRight = new THREE.PointLight(0xffffff, 0.8);
pointLightMiddleRight.position.set(5, 5, 5);
sceneMiddleRight.add(pointLightMiddleRight);

// Load model
const loader = new GLTFLoader();
loader.load(MODEL_PATH, (gltf: GLTF) => {
  console.log('Model loaded:', gltf);
  
  let mesh: THREE.Mesh | null = null;
  const materials: THREE.Material[] = [];
  
  // Configure all materials in original scene
  gltf.scene.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      mesh = child as THREE.Mesh;
      console.log('Found mesh:', child.name);
      
      // Store original materials
      if (Array.isArray(mesh.material)) {
        materials.push(...mesh.material);
      } else if (mesh.material) {
        materials.push(mesh.material);
      }
      
      // Configure material for proper rendering
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => {
            mat.side = THREE.FrontSide;
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.metalness = 0.3;
              mat.roughness = 0.4;
            }
          });
        } else {
          mesh.material.side = THREE.FrontSide;
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.metalness = 0.3;
            mesh.material.roughness = 0.4;
          }
        }
      }
    }
  });

  // Guard check to ensure mesh exists and has geometry
  if (!mesh) {
    console.error('No mesh found');
    return;
  }

  // Cast mesh as Mesh (now guaranteed to exist) to help TypeScript
  const typedMesh: THREE.Mesh = mesh as THREE.Mesh;
  
  if (!typedMesh.geometry) {
    console.error('No mesh with geometry found');
    return;
  }

  // Add the original scene directly (don't clone to preserve materials)
  sceneLeft.add(gltf.scene);
  console.log('Added model to scene');
  
  // Log the bounds of the model
  const box = new THREE.Box3().setFromObject(gltf.scene);
  console.log('Model bounds:', box.min, box.max);
  const center = box.getCenter(new THREE.Vector3());
  console.log('Model center:', center);
  
  // Dynamically adjust camera clipping planes based on model size
  updateCameraClippingPlanes(
    [cameraLeft, cameraMiddleLeft, cameraMiddleRight, cameraRight],
    box
  );
  
  // Point camera at the model center
  controlsLeft.target.copy(center);
  controlsLeft.update();

  // Use MeshSurfaceSampler to generate particles
  const sampler = new MeshSurfaceSampler(typedMesh).build();

  const numParticles = NUM_PARTICLES;
  const positions = new Float32Array(numParticles * 3);
  const tempPosition = new THREE.Vector3();

  for (let i = 0; i < numParticles; i++) {
    sampler.sample(tempPosition);
    // Apply the mesh's world matrix to the sampled position
    tempPosition.applyMatrix4(typedMesh.matrixWorld);
    positions.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3);
  }

  // Create geometry + material for particles
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: PARTICLE_COLOR,
    size: PARTICLE_SIZE,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });

  const points = new THREE.Points(particleGeometry, particleMaterial);
  sceneMiddleRight.add(points);

  // Create wireframe view of the model in particle color
  const wireframeClone = gltf.scene.clone();
  wireframeClone.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const meshChild = child as THREE.Mesh;
      // Create wireframe material in particle color
      meshChild.material = new THREE.MeshPhongMaterial({
        color: PARTICLE_COLOR,
        wireframe: true,
        emissive: PARTICLE_COLOR,
        emissiveIntensity: WIREFRAME_EMISSIVE_INTENSITY
      });
    }
  });
  sceneMiddleLeft.add(wireframeClone);

  // Create vertices-only particles
  const vertexPositions = new Float32Array(typedMesh.geometry.attributes.position.array as ArrayLike<number>);
  const vertexGeometry = new THREE.BufferGeometry();
  vertexGeometry.setAttribute('position', new THREE.BufferAttribute(vertexPositions, 3));

  const vertexMaterial = new THREE.PointsMaterial({
    color: PARTICLE_COLOR,
    size: VERTEX_PARTICLE_SIZE,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });

  const vertexPoints = new THREE.Points(vertexGeometry, vertexMaterial);
  vertexPoints.applyMatrix4(typedMesh.matrixWorld);
  sceneRight.add(vertexPoints);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controlsLeft.update();
    controlsMiddleLeft.update();
    controlsMiddleRight.update();
    controlsRight.update();
    
    // Sync all cameras to the left camera (master control)
    cameraMiddleLeft.position.copy(cameraLeft.position);
    cameraMiddleLeft.quaternion.copy(cameraLeft.quaternion);
    cameraMiddleLeft.updateProjectionMatrix();
    controlsMiddleLeft.target.copy(controlsLeft.target);

    cameraMiddleRight.position.copy(cameraLeft.position);
    cameraMiddleRight.quaternion.copy(cameraLeft.quaternion);
    cameraMiddleRight.updateProjectionMatrix();
    controlsMiddleRight.target.copy(controlsLeft.target);

    cameraRight.position.copy(cameraLeft.position);
    cameraRight.quaternion.copy(cameraLeft.quaternion);
    cameraRight.updateProjectionMatrix();
    controlsRight.target.copy(controlsLeft.target);

    // Clear the canvas
    renderer.clear();

    // Render left scene (left quarter)
    renderer.setViewport(0, 0, window.innerWidth / 4, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth / 4, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.render(sceneLeft, cameraLeft);

    // Render middle-left scene (middle-left quarter)
    renderer.setViewport(window.innerWidth / 4, 0, window.innerWidth / 4, window.innerHeight);
    renderer.setScissor(window.innerWidth / 4, 0, window.innerWidth / 4, window.innerHeight);
    renderer.render(sceneMiddleLeft, cameraMiddleLeft);

    // Render middle-right scene (middle-right quarter)
    renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 4, window.innerHeight);
    renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 4, window.innerHeight);
    renderer.render(sceneMiddleRight, cameraMiddleRight);

    // Render right scene (right quarter)
    renderer.setViewport(window.innerWidth * 3 / 4, 0, window.innerWidth / 4, window.innerHeight);
    renderer.setScissor(window.innerWidth * 3 / 4, 0, window.innerWidth / 4, window.innerHeight);
    renderer.render(sceneRight, cameraRight);
    
    renderer.setScissorTest(false);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    const width = window.innerWidth / 4;
    const height = window.innerHeight;

    cameraLeft.aspect = width / height;
    cameraLeft.updateProjectionMatrix();

    cameraMiddleLeft.aspect = width / height;
    cameraMiddleLeft.updateProjectionMatrix();

    cameraMiddleRight.aspect = width / height;
    cameraMiddleRight.updateProjectionMatrix();

    cameraRight.aspect = width / height;
    cameraRight.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
