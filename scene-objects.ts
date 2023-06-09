import { Cube, Object3d, Plane, Sphere } from './definitions';
const planes: Plane[] = [
  // {
  //   emission: [0, 0, 0],
  //   normal: [0, 1, 0],
  //   pos: [0, -5, 0],
  //   reflectionStrength: 1,
  //   reflectivity: [1, 1, 1],
  //   roughness: 0.001,
  //   type: 'plane',
  //   specular: 0.01,
  // },
];
const spheres: Sphere[] = [
  {
    type: 'sphere',
    pos: [0, -1, 5],
    radius: 0.5,
    emission: [1, 1, 1],
    material: {
      reflectivity: [1, 1, 1],
      roughness: 0,
      reflectionStrength: 1,
      specular: 1,
    },
  },
  {
    type: 'sphere',
    pos: [0, -1, 1.5],
    radius: 0.1,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0, 0.5, 0.5],
      roughness: 0.001,
      reflectionStrength: 1,
      specular: 1,
    },
  },
  {
    type: 'sphere',
    pos: [0, -1.5, 1.5],
    radius: 1,
    emission: [0, 0, 0],
    material: {
      reflectivity: [1, 1, 1],
      roughness: 0.001,
      reflectionStrength: 1,
      specular: 1,
    },
  },
];
const cubes: Cube[] = [
  {
    pos: [0, 1, 5],
    type: 'cube',
    emission: [0, 0, 0],
    size: [51, 51, 51],
    material: {
      roughness: 0.1,
      specular: 0,
      reflectionStrength: 1,
      reflectivity: [1, 1, 1],
    },
  },
];
export const objects3d: Array<Object3d> = [
  ...spheres,
  ...planes,
  ...cubes,
].sort((a, b) => a.pos[2] - b.pos[2]);
