import { PixelShaderProgram } from './drawer';
import { sign } from './vector';
import {
  Camera,
  Cube,
  IntersectionResult,
  Object3d,
  Plane,
  Ray,
  Sphere,
} from './definitions';
import { Vec3, vec3 } from 'wgpu-matrix';
import { dot } from 'vec3';
const maxDepth = 4;
const camera: Camera = {
  pos: [0, 0, -1],
  fov: 60,
  focalLength: 0.55,
};

let obj: Object3d[];
export const shaderFn: PixelShaderProgram<{
  objects3d: Object3d[];
  numberOfRays: number;
}> = (color, coord, resolution, mouse, { objects3d, numberOfRays }) => {
  obj = objects3d;

  const max_x = resolution[0] - 1;
  const max_y = resolution[1] - 1;
  const aspectRatio = resolution[0] / resolution[1];

  // Calculate the normalized device coordinates (NDC) within the range [-1, 1]
  const ndcX = (coord[0] / max_x) * 2 - 1;
  const ndcY = (coord[1] / max_y) * 2 - 1;

  // Convert FOV to radians and calculate the half-width and half-height of the near plane
  const fovRadians = (camera.fov * Math.PI) / 180;
  const halfHeight = Math.tan(fovRadians / 2);
  const halfWidth = aspectRatio * halfHeight;

  // Calculate the direction vector
  const direction = vec3.normalize([
    ndcX * halfWidth,
    ndcY * halfHeight,
    -camera.focalLength,
  ]);
  const ray: Ray = {
    direction,
    origin: camera.pos,
  };
  const results = [];
  for (let i = 0; i < numberOfRays; i++) {
    const tracedColor = trace(ray, maxDepth, objects3d);
    results.push(tracedColor);
  }
  const newColor = results.reduce((c, p) => vec3.add(c, p), [0, 0, 0]);
  return vec3.divScalar(newColor, numberOfRays);
};
function trace(ray: Ray, depth: number, objects: Object3d[]): Vec3 {
  for (let object of objects) {
    let intersectionResult: IntersectionResult;
    let objects = obj.filter((x) => x != object);
    switch (object.type) {
      case 'sphere':
        intersectionResult = sphereIntersection(ray, object);
        break;
      case 'plane':
        intersectionResult = planeIntersection(ray, object);
        break;
      case 'cube':
        intersectionResult = cubeIntersection(ray, object);
        break;
    }

    if (intersectionResult) {
      let emission = object.emission;
      if (depth >= 0) {
        const newRay: Ray = {
          origin: intersectionResult.point,
          direction: intersectionResult.normal,
        };
        // Calculate the reflected ray direction
        const reflectDir = vec3.sub(ray.direction, intersectionResult.normal);

        // Calculate the specular intensity based on the dot product between the reflected ray direction and the viewing direction
        // const specularIntensity = Math.pow(Math.max(vec3.dot(reflectDir, vec3.negate(ray.direction)), 0), object.specular);

        // Calculate the reflected color recursively
        const reflectedColor = vec3.multiply(
          trace(newRay, depth - 1, objects),
          object.reflectivity
        );
        const lightStrength = vec3.dot(
          intersectionResult.normal,
          ray.direction
        );

        // Apply the specular reflection to the emission color
        emission = vec3.mulScalar(
          vec3.add(emission, reflectedColor),
          lightStrength * 1.5
        );
      }

      return emission;
    }
  }

  return [0, 0, 0];
}

function sphereIntersection(ray: Ray, sphere: Sphere): IntersectionResult {
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
    sphere.roughness
  );
  let normal = vec3.normalize(vec3.sub(intersection, ray.origin));
  normal = vec3.add(normal, roughness);
  return {
    point: intersection,
    normal,
  };
}

function planeIntersection(ray: Ray, plane: Plane): IntersectionResult {
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
    plane.roughness
  );
  let normal = vec3.normalize(vec3.sub(intersectionPoint, ray.origin));
  normal = vec3.add(normal, roughness);

  return {
    point: intersectionPoint,
    normal: normal,
  };
}

function getRandomUnitVector(normal) {
  let direction = vec3.random();
  const d = vec3.dot(normal, direction);
  const s = sign(d);
  direction = vec3.mul(normal, vec3.mulScalar(direction, s));
  return vec3.normalize(direction);
}

function cubeIntersection(ray: Ray, cube: Cube): IntersectionResult {
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
  console.log(intersectionPoint)
  return {
    point: intersectionPoint,
    normal: vec3.normalize(normal) as Vec3,
  };
}
