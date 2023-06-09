import { vec3 } from 'wgpu-matrix';

export function getRandomUnitVector(normal) {
  let direction = vec3.random();
  const d = vec3.dot(normal, direction);
  const s = sign(d);
  direction = vec3.mul(normal, vec3.mulScalar(direction, s));
  return vec3.normalize(direction);
}
function sign(value) {
  return value == 0 ? 0 : value < 0 ? -1 : 1;
}
