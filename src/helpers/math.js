export function mapRange(in_min, in_max, input, out_min, out_max) {
  return ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)