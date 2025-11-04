import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';
import { MODEL_PATH, SKYBOX_TEXTURE } from './src/config/constants';
import { VIEWS, ViewType } from './src/config/viewConfigs';
import { createScene, syncCameras, SceneComponents } from './src/scenes/SceneSetup';
import { addRealisticLighting, addBasicLighting } from './src/lighting/LightingSetup';
import { updateCameraClippingPlanes } from './src/utils/cameraUtils';
import { loadModel, loadHDREnvironment, createWireframeClone, findMeshWithGeometry } from './src/loaders/ModelLoader';
import { createSurfaceParticles, createVertexParticles } from './src/effects/ParticleSystem';
import { RenderManager } from './src/rendering/RenderManager';
import { RendererLike } from './src/types/renderer';

// Create renderer with WebGPU fallback to WebGL
let renderer: RendererLike;
try {
  const webgpuRenderer = new WebGPURenderer({ antialias: true });
  await webgpuRenderer.init();
  renderer = webgpuRenderer;
  console.log('Using WebGPU renderer');
} catch (error) {
  console.warn('WebGPU not supported, falling back to WebGL:', error);
  renderer = new THREE.WebGLRenderer({ antialias: true });
}

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

// Create scenes dynamically based on VIEWS configuration
const views: Map<string, SceneComponents> = new Map();

VIEWS.forEach((viewConfig) => {
  const sceneComponents = createScene(renderer, { type: viewConfig.type });
  views.set(viewConfig.name, sceneComponents);
  
  // Add appropriate lighting based on view type
  if (viewConfig.type === ViewType.Realistic) {
    addRealisticLighting(sceneComponents.scene);
    loadHDREnvironment(SKYBOX_TEXTURE, sceneComponents.scene);
  } else if (viewConfig.type === ViewType.Minimal) {
    // Minimal view has minimal lighting - just ambient light
    const minimalLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneComponents.scene.add(minimalLight);
  } else {
    addBasicLighting(sceneComponents.scene);
  }
});

// Initialize render manager
const renderManager = new RenderManager(renderer);

// Get main view for primary controls
const mainView = views.get('main');
if (!mainView) {
  throw new Error('Main view not found');
}
const { camera: mainCamera, controls: mainControls } = mainView;

// Load and setup model
loadModel(MODEL_PATH).then((gltf) => {
  const mesh = findMeshWithGeometry(gltf.scene);
  
  if (!mesh || !mesh.geometry) {
    console.error('No mesh with geometry found');
    return;
  }

  console.log('Added model to scene');
  
  // Calculate model bounds and update cameras
  const box = new THREE.Box3().setFromObject(gltf.scene);
  console.log('Model bounds:', box.min, box.max);
  const center = box.getCenter(new THREE.Vector3());
  console.log('Model center:', center);
  
  const allCameras = Array.from(views.values()).map(v => v.camera);
  updateCameraClippingPlanes(allCameras, box);
  
  mainControls.target.copy(center);
  mainControls.update();

  // Add content to each view based on its type
  VIEWS.forEach((viewConfig) => {
    const view = views.get(viewConfig.name);
    if (!view) return;

    switch (viewConfig.type) {
      case ViewType.Realistic:
        view.scene.add(gltf.scene);
        break;
      case ViewType.Minimal:
        // Minimal view - clone the model without fancy materials
        const minimalClone = gltf.scene.clone();
        minimalClone.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const meshChild = child as THREE.Mesh;
            // Use basic material for minimal rendering
            meshChild.material = new THREE.MeshBasicMaterial({
              color: 0xcccccc,
              side: THREE.FrontSide
            });
          }
        });
        view.scene.add(minimalClone);
        break;
      case ViewType.Wireframe:
        const wireframeClone = createWireframeClone(gltf.scene);
        view.scene.add(wireframeClone);
        break;
      case ViewType.SurfaceParticles:
        const surfaceParticles = createSurfaceParticles(mesh);
        view.scene.add(surfaceParticles);
        break;
      case ViewType.VertexParticles:
        const vertexParticles = createVertexParticles(mesh);
        view.scene.add(vertexParticles);
        break;
    }
  });

  // Setup viewports dynamically based on number of views
  const viewportWidth = window.innerWidth / VIEWS.length;
  VIEWS.forEach((viewConfig, index) => {
    const view = views.get(viewConfig.name);
    if (!view) return;

    renderManager.addViewport({
      scene: view.scene,
      camera: view.camera,
      controls: view.controls,
      x: viewportWidth * index,
      y: 0,
      width: viewportWidth,
      height: window.innerHeight
    });
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    renderManager.updateControls();
    
    // Sync all secondary cameras to the main camera
    const secondaryViews = Array.from(views.entries())
      .filter(([name]) => name !== 'main')
      .map(([_, view]) => ({ camera: view.camera, controls: view.controls }));
    
    syncCameras(mainCamera, mainControls, secondaryViews);

    renderManager.render();
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    renderManager.handleResize();
  });
}).catch((error) => {
  console.error('Error loading model:', error);
});
