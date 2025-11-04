import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { NUM_PARTICLES, PARTICLE_COLOR, PARTICLE_SIZE, VERTEX_PARTICLE_SIZE } from '../config/constants';

/**
 * Create particles using surface sampling
 */
export function createSurfaceParticles(mesh: THREE.Mesh): THREE.Points {
  const sampler = new MeshSurfaceSampler(mesh).build();
  const positions = new Float32Array(NUM_PARTICLES * 3);
  const tempPosition = new THREE.Vector3();

  for (let i = 0; i < NUM_PARTICLES; i++) {
    sampler.sample(tempPosition);
    tempPosition.applyMatrix4(mesh.matrixWorld);
    positions.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3);
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: PARTICLE_COLOR,
    size: PARTICLE_SIZE,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  });

  return new THREE.Points(particleGeometry, particleMaterial);
}

/**
 * Create vertex-only particles from mesh geometry
 */
export function createVertexParticles(mesh: THREE.Mesh): THREE.Points {
  const vertexPositions = new Float32Array(
    mesh.geometry.attributes.position.array as ArrayLike<number>
  );
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
  vertexPoints.applyMatrix4(mesh.matrixWorld);
  
  return vertexPoints;
}
