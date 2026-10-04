import { GRID_SIDE } from './stageLayout';

/**
 * How far to shift the 28x28 input so the ink looks centred. MNIST centres digits by mass, so the
 * model input stays as it is; only the picture of it is moved.
 */
export const displayOffset = (input: Float32Array): { dx: number; dy: number } => {
  let left = GRID_SIDE;
  let right = -1;
  let top = GRID_SIDE;
  let bottom = -1;
  for (let i = 0; i < GRID_SIDE * GRID_SIDE; i += 1) {
    if (input[i] > 0) {
      const c = i % GRID_SIDE;
      const r = Math.floor(i / GRID_SIDE);
      if (c < left) left = c;
      if (c > right) right = c;
      if (r < top) top = r;
      if (r > bottom) bottom = r;
    }
  }
  if (right < 0) return { dx: 0, dy: 0 };
  const w = right - left + 1;
  const h = bottom - top + 1;
  return { dx: Math.round((GRID_SIDE - w) / 2) - left, dy: Math.round((GRID_SIDE - h) / 2) - top };
};

/** The input value shown at displayed cell (r, c). */
export const shiftedCell = (input: Float32Array, r: number, c: number, dx: number, dy: number): number => {
  const sr = r - dy;
  const sc = c - dx;
  return sr < 0 || sr >= GRID_SIDE || sc < 0 || sc >= GRID_SIDE ? 0 : input[sr * GRID_SIDE + sc];
};

/**
 * Re-indexes per-port strengths (`port * perPort + n`) so the port drawn at displayed row (or
 * column) r carries the strength of source row r - shift.
 */
export const shiftPortStrengths = (strengths: Float32Array, perPort: number, shift: number): Float32Array => {
  const out = new Float32Array(strengths.length);
  for (let port = 0; port < GRID_SIDE; port += 1) {
    const source = port - shift;
    if (source < 0 || source >= GRID_SIDE) continue;
    for (let n = 0; n < perPort; n += 1) out[port * perPort + n] = strengths[source * perPort + n];
  }
  return out;
};
