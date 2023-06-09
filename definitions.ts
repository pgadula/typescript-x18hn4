import { vec3, Vec3 } from 'wgpu-matrix';
import { sign } from './vector';

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

  public intersect(object: Object3d): IntersectionResult {
    let intersectionResult: IntersectionResult = null;
    switch (object.type) {
      case 'sphere':
        intersectionResult = this.IntersectSphere(this, object);
        break;
      case 'plane':
        intersectionResult = this.IntersectPlane(this, object);
        break;
      case 'cube':
        intersectionResult = this.IntersectCube(this, object);
        break;
    }
    return intersectionResult;
  }
  private IntersectSphere(ray: Ray, sphere: Sphere): IntersectionResult {
    const sphereToOrigin = vec3.sub(ray.origin, sphere.pos);
    const projection = vec3.dot(sphereToOrigin, ray.direction);
    const distance = vec3.len(sphereToOrigin) - projection;

    const radiusSquared = sphere.radius * sphere.radius;
    if (distance > radiusSquared) {
      return null;
    }

    const offset = Math.sqrt(radiusSquared - distance * distance);
    const intersection = vec3.add(
      ray.origin,
      vec3.mulScalar(ray.direction, projection - offset)
    );
    let roughness = vec3.mulScalar(
      getRandomUnitVector(ray.direction),
      sphere.material.roughness
    );
    let normal = vec3.normalize(vec3.sub(intersection, ray.origin));
    normal = vec3.add(normal, roughness);
    return {
      point: intersection,
      normal,
    };
  }

  private IntersectPlane(ray: Ray, plane: Plane): IntersectionResult {
    const dotProductResult = vec3.dot(plane.normal, ray.direction);

    if (Math.abs(dotProductResult) < 0.01) {
      return null;
    }

    const t =
      vec3.dot(vec3.sub(plane.pos, ray.origin), plane.normal) /
      vec3.dot(ray.direction, plane.normal);

    if (t < 0) {
      return null; // Intersection point is behind the ray's origin
    }

    const intersectionPoint = vec3.add(
      ray.origin,
      vec3.mulScalar(ray.direction, t)
    ) as Vec3;
    let roughness = vec3.mulScalar(
      getRandomUnitVector(ray.direction),
      plane.material.roughness
    );
    let normal = vec3.normalize(vec3.sub(intersectionPoint, ray.origin));
    normal = vec3.add(normal, roughness);

    return {
      point: intersectionPoint,
      normal: normal,
    };
  }

  private IntersectCube(ray: Ray, cube: Cube): IntersectionResult {
    const [originX, originY, originZ] = ray.origin;
    const [directionX, directionY, directionZ] = ray.direction;
    const [cubePosX, cubePosY, cubePosZ] = cube.pos;
    const [sizeX, sizeY, sizeZ] = cube.size;

    // Calculate the minimum and maximum intersection distances for each axis
    const tMinX = (cubePosX - originX) / directionX;
    const tMaxX = (cubePosX + sizeX - originX) / directionX;
    const tMinY = (cubePosY - originY) / directionY;
    const tMaxY = (cubePosY + sizeY - originY) / directionY;
    const tMinZ = (cubePosZ - originZ) / directionZ;
    const tMaxZ = (cubePosZ + sizeZ - originZ) / directionZ;

    // Calculate the minimum and maximum intersection distances overall
    const tMin = Math.max(
      Math.max(Math.min(tMinX, tMaxX), Math.min(tMinY, tMaxY)),
      Math.min(tMinZ, tMaxZ)
    );
    const tMax = Math.min(
      Math.min(Math.max(tMinX, tMaxX), Math.max(tMinY, tMaxY)),
      Math.max(tMinZ, tMaxZ)
    );

    // Check if there is a valid intersection
    if (tMax < 0 || tMin > tMax) {
      return null;
    }

    // Calculate the intersection point
    const intersectionPoint = vec3.add(
      ray.origin,
      vec3.mulScalar(ray.direction, tMin)
    );

    // Calculate the normal at the intersection point
    let normal: Vec3 = [0, 0, 0];
    if (Math.abs(intersectionPoint[0] - cubePosX) < 0.0001) {
      normal = [-1, 0, 0];
    } else if (Math.abs(intersectionPoint[0] - (cubePosX + sizeX)) < 0.0001) {
      normal = [1, 0, 0];
    } else if (Math.abs(intersectionPoint[1] - cubePosY) < 0.0001) {
      normal = [0, -1, 0];
    } else if (Math.abs(intersectionPoint[1] - (cubePosY + sizeY)) < 0.0001) {
      normal = [0, 1, 0];
    } else if (Math.abs(intersectionPoint[2] - cubePosZ) < 0.0001) {
      normal = [0, 0, -1];
    } else if (Math.abs(intersectionPoint[2] - (cubePosZ + sizeZ)) < 0.0001) {
      normal = [0, 0, 1];
    }
    return {
      point: intersectionPoint,
      normal: vec3.normalize(normal) as Vec3,
    };
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
