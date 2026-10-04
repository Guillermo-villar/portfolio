import { displayOffset, shiftedCell, shiftPortStrengths } from './centring';

const block = (r0: number, r1: number, c0: number, c1: number) => {
  const input = new Float32Array(784);
  for (let r = r0; r <= r1; r += 1) for (let c = c0; c <= c1; c += 1) input[r * 28 + c] = 1;
  return input;
};

const bounds = (input: Float32Array, dx: number, dy: number) => {
  let left = 28;
  let right = -1;
  let top = 28;
  let bottom = -1;
  for (let r = 0; r < 28; r += 1) {
    for (let c = 0; c < 28; c += 1) {
      if (shiftedCell(input, r, c, dx, dy) > 0) {
        left = Math.min(left, c);
        right = Math.max(right, c);
        top = Math.min(top, r);
        bottom = Math.max(bottom, r);
      }
    }
  }
  return { left, right, top, bottom };
};

test('an empty input needs no shift', () => {
  expect(displayOffset(new Float32Array(784))).toEqual({ dx: 0, dy: 0 });
});

test('an already centred block needs no shift', () => {
  expect(displayOffset(block(8, 19, 10, 17))).toEqual({ dx: 0, dy: 0 });
});

test('a block in the bottom-left corner is moved to the middle', () => {
  const input = block(20, 27, 0, 5);
  const { dx, dy } = displayOffset(input);
  const b = bounds(input, dx, dy);
  expect(Math.abs(b.left - (27 - b.right))).toBeLessThanOrEqual(1);
  expect(Math.abs(b.top - (27 - b.bottom))).toBeLessThanOrEqual(1);
  expect(shiftedCell(input, b.top, b.left, dx, dy)).toBe(1);
});

test('shifted port strengths follow the shifted rows', () => {
  const input = block(24, 27, 10, 14);
  const { dy } = displayOffset(input);
  const perPort = 3;
  const strengths = new Float32Array(28 * perPort);
  strengths[25 * perPort + 1] = 0.8;
  const shifted = shiftPortStrengths(strengths, perPort, dy);
  expect(shifted[(25 + dy) * perPort + 1]).toBeCloseTo(0.8, 5);
  expect(shifted.filter((v) => v > 0)).toHaveLength(1);
  expect(shiftPortStrengths(strengths, perPort, 40).every((v) => v === 0)).toBe(true);
});
