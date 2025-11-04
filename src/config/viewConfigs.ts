/**
 * Configuration for different view types
 */

export enum ViewType {
  Realistic = 'realistic',
  Minimal = 'minimal',
  Wireframe = 'wireframe',
  SurfaceParticles = 'surface-particles',
  VertexParticles = 'vertex-particles'
}

export interface ViewConfig {
  name: string;
  type: ViewType;
  description: string;
}

/**
 * Define all views to be rendered
 * Add or remove views from this array to change the number of viewports
 */
export const VIEWS: ViewConfig[] = [
  {
    name: 'main',
    type: ViewType.Realistic,
    description: 'Realistic rendered model with HDR environment and proper shading'
  },
  {
    name: 'view1',
    type: ViewType.Minimal,
    description: 'Minimal view with basic rendering'
  },
  {
    name: 'view2',
    type: ViewType.Wireframe,
    description: 'Wireframe visualization'
  },
  {
    name: 'view3',
    type: ViewType.SurfaceParticles,
    description: 'Surface-sampled particles'
  },
  {
    name: 'view4',
    type: ViewType.VertexParticles,
    description: 'Vertex-only particles'
  }
];
