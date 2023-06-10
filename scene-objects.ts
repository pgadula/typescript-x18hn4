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
    pos: [2, 1.5, 1.9],
    radius: 0.9,
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
    pos: [-2, -0.5, 1],
    radius: 0.1,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0.8, 0, 0],
      roughness: 0.1,
      reflectionStrength: 1,
      specular: 0.1,
    },
  },
  {
    type: 'sphere',
    pos: [-0.5, -1, 1.3],
    radius: 0.2,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0, 1, 1],
      roughness: 0.1,
      reflectionStrength: 1,
      specular: 0.1,
    },
  },

  {
    type: 'sphere',
    pos: [0, -1, 1],
    radius: 0.25,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0, 0.5, 0.5],
      roughness: 0.001,
      reflectionStrength: 1,
      specular: 0.01,
    },
  },
  {
    type: 'sphere',
    pos: [1.1, -1, 0.8],
    radius: 0.15,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0.5, 0.5, 1],
      roughness: 0.1,
      reflectionStrength: 1,
      specular: 1,
    },
  },
  {
    type: 'sphere',
    pos: [2, -1, 1],
    radius: 0.1,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0.5, 0.5, 0],
      roughness: 0.01,
      reflectionStrength: 1,
      specular: 1,
    },
  },
  {
    type: 'sphere',
    pos: [0, -2, 1],
    radius: 1,
    emission: [0, 0, 0],
    material: {
      reflectivity: [0.5, 0.5, 0.5],
      roughness: 0.02,
      reflectionStrength: 1,
      specular: 1,
    },
  },
];
const cubes: Cube[] = [
  {
    emission: [1, 1, 1],
    pos: [1, 1, 5],
    material: {
      reflectionStrength: 1,
      reflectivity: [1, 1, 1],
      roughness: 0.1,
      specular: 0,
    },

    size: [51, 51, 51],
    type: 'cube',
  },
];
const objects3d: Array<Object3d> = [...spheres, ...planes, ...cubes].sort(
  (a, b) => a.pos[2] - b.pos[2]
);
export const objects3d: Array<Object3d> = [
  ...spheres,
  ...planes,
  ...cubes,
].sort((a, b) => a.pos[2] - b.pos[2]);
