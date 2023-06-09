import { Vec3 } from 'wgpu-matrix';

export interface Plane {
  type: 'plane';
  pos: Vec3;
  emission: Vec3;
  material: Material;

  normal: Vec3;
}

export interface Sphere {
  type: 'sphere';
  pos: Vec3;
  radius: number;
  emission: Vec3;
  material: Material;
}

export interface Cube {
  type: 'cube';
  pos: Vec3;
  size: Vec3;
  emission: Vec3;
  material: Material;
}
export type Object3d = Sphere | Plane | Cube;

interface Intersection {
  point: Vec3;
  normal: Vec3;
}
export type IntersectionResult = Intersection | null;
export interface Camera {
  pos: Vec3;
  fov: number;
  focalLength: number;
}

export interface Material {
  reflectivity: Vec3;
  roughness: number;
  reflectionStrength: number;
  specular: number;
}

export class Ray {
  direction: Vec3;
  origin: Vec3;
  constructor(origin: Vec3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }
}
export class Camera {
  origin: Vec3;
  fov: number;
  focalLength: number;
  constructor(origin: Vec3, fov: number, focalLength: number) {
    this.origin = origin;
    this.fov = fov;
    this.focalLength = focalLength;
  }
}
