import { vec3 } from 'wgpu-matrix';

export function getRandomUnitVector(normal) {
  let direction = vec3.random();
  const d = vec3.dot(normal, direction);
  const s = d;
  direction = vec3.mul(normal, vec3.mulScalar(direction, s));
  return vec3.normalize(direction);
}
