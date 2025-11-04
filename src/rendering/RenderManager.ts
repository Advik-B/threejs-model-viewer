import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RendererLike } from '../types/renderer';

export interface ViewportConfig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Render Manager for handling multi-viewport rendering
 */
export class RenderManager {
  private renderer: RendererLike;
  private viewports: ViewportConfig[] = [];
  private lastWindowWidth = 0;
  private lastWindowHeight = 0;

  constructor(renderer: RendererLike) {
    this.renderer = renderer;
  }

  /**
   * Add a viewport to the render manager
   */
  addViewport(config: ViewportConfig): void {
    this.viewports.push(config);
  }

  /**
   * Update all controls
   */
  updateControls(): void {
    this.viewports.forEach(viewport => viewport.controls.update());
  }

  /**
   * Render all viewports
   */
  render(): void {
    this.renderer.clear();
    
    this.viewports.forEach(viewport => {
      this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
      this.renderer.setScissor(viewport.x, viewport.y, viewport.width, viewport.height);
      this.renderer.setScissorTest(true);
      this.renderer.render(viewport.scene, viewport.camera);
    });
    
    this.renderer.setScissorTest(false);
  }

  /**
   * Handle window resize for all viewports
   */
  handleResize(): void {
    // Skip if window dimensions haven't changed
    if (this.lastWindowWidth === window.innerWidth && 
        this.lastWindowHeight === window.innerHeight) {
      return;
    }

    this.lastWindowWidth = window.innerWidth;
    this.lastWindowHeight = window.innerHeight;

    const numViewports = this.viewports.length;
    const width = window.innerWidth / numViewports;
    const height = window.innerHeight;

    this.viewports.forEach((viewport, index) => {
      viewport.camera.aspect = width / height;
      viewport.camera.updateProjectionMatrix();
      
      // Update viewport dimensions
      viewport.x = width * index;
      viewport.width = width;
      viewport.height = height;
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
