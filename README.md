# Three.js Model Viewer

A modular Three.js application that displays a 3D model with multiple visualization modes.

## Features

- **Multiple View Modes**: 
  - Main View: Realistic rendering with HDR environment
  - View 1: Wireframe visualization
  - View 2: Surface-sampled particle effect
  - View 3: Vertex-only particle visualization
  
- **Synchronized Controls**: All views are synchronized - interact with any view to control all cameras
- **Modular Architecture**: Clean, maintainable code structure with separation of concerns
- **Easy to Extend**: Add new views by editing the configuration file

## Project Structure

```
threejs-model-viewer/
├── src/
│   ├── config/
│   │   ├── constants.ts       # Application constants
│   │   └── viewConfigs.ts     # View configuration (add/remove views here)
│   ├── scenes/
│   │   └── SceneSetup.ts      # Scene, camera, and controls setup
│   ├── lighting/
│   │   └── LightingSetup.ts   # Lighting configurations
│   ├── utils/
│   │   └── cameraUtils.ts     # Camera utility functions
│   ├── loaders/
│   │   └── ModelLoader.ts     # Model loading and processing
│   ├── effects/
│   │   └── ParticleSystem.ts  # Particle system generation
│   ├── rendering/
│   │   └── RenderManager.ts   # Multi-viewport rendering
│   └── types/
│       └── renderer.ts        # TypeScript type definitions
├── main.ts                     # Application entry point
└── index.html                  # HTML template

```

## Development

### Prerequisites

- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Adding New Views

To add a new view to the application:

1. Open `src/config/viewConfigs.ts`
2. Add a new entry to the `VIEWS` array:

```typescript
{
  name: 'view4',
  type: 'your-view-type',
  description: 'Description of your view'
}
```

3. If you need a new view type, add the logic in `main.ts` switch statement

The application will automatically:
- Create the scene and camera
- Add it to the viewport grid
- Synchronize controls with other views

## Deployment

This project is configured to deploy to GitHub Pages automatically:

1. Push to the `main` branch
2. GitHub Actions will build and deploy the site
3. Access it at: `https://[username].github.io/threejs-model-viewer/`

## Technologies

- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Bun** - JavaScript runtime and package manager
- **WebGPU** - Next-generation graphics API

## License

MIT
