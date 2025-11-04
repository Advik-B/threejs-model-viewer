import * as THREE from 'three';

/**
 * Type definitions for renderer compatibility
 * This interface covers both WebGLRenderer and WebGPURenderer
 */
export interface RendererLike {
  domElement: HTMLCanvasElement;
  setSize(width: number, height: number): void;
  clear(): void;
  setViewport(x: number, y: number, width: number, height: number): void;
  setScissor(x: number, y: number, width: number, height: number): void;
  setScissorTest(enable: boolean): void;
  render(scene: THREE.Scene, camera: THREE.Camera): void;
  shadowMap: {
    enabled: boolean;
    type: THREE.ShadowMapType | null;
  };
}
