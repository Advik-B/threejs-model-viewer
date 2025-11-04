/**
 * Configuration for different view types
 */

export type ViewType = 'realistic' | 'wireframe' | 'surface-particles' | 'vertex-particles';

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
    type: 'realistic',
    description: 'Realistic rendered model with HDR environment'
  },
  {
    name: 'view1',
    type: 'wireframe',
    description: 'Wireframe visualization'
  },
  {
    name: 'view2',
    type: 'surface-particles',
    description: 'Surface-sampled particles'
  },
  {
    name: 'view3',
    type: 'vertex-particles',
    description: 'Vertex-only particles'
  }
];
