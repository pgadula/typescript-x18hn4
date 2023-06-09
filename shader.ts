import { PixelShaderProgram } from './drawer';
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
const maxDepth = 6;
const camera: Camera = new Camera([0, 0, 0], 60, 0.55);

let obj: Object3d[];
export const rayTracer: PixelShaderProgram<{
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
  const ray: Ray = new Ray(camera.origin, direction);
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
    let intersectionResult = ray.intersect(object);
    let objects = obj.filter((x) => x != object);

    if (intersectionResult) {
      let emission = object.emission;
      if (depth >= 0) {
        const newRay: Ray = new Ray(
          intersectionResult.point,
          intersectionResult.normal
        );
        const reflectDir = vec3.sub(ray.direction, intersectionResult.normal);

        const reflectedColor = vec3.multiply(
          trace(newRay, depth - 1, objects),
          object.material.reflectivity
        );
        const lightStrength = vec3.dot(
          intersectionResult.normal,
          ray.direction
        );

        // Apply the specular reflection to the emission color
        emission = vec3.mulScalar(
          vec3.add(emission, reflectedColor),
          lightStrength * 2
        );
      }

      return emission;
    }
  }

  return [0, 0, 0];
}
