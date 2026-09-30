import { toModelInput } from './preprocess';

const FIELD = 280;

const field = (paint: (x: number, y: number) => boolean) => {
  const pixels = new Float32Array(FIELD * FIELD);
  for (let y = 0; y < FIELD; y += 1) {
    for (let x = 0; x < FIELD; x += 1) {
      if (paint(x, y)) pixels[y * FIELD + x] = 1;
    }
  }
  return pixels;
};

test('a blank canvas produces no model input', () => {
  expect(toModelInput(new Float32Array(FIELD * FIELD), FIELD, FIELD)).toBeNull();
});

test('a thick stroke becomes a binary 28x28 input with ink in it', () => {
  const stroke = field((x, y) => x >= 130 && x < 152 && y >= 40 && y < 240);
  const input = toModelInput(stroke, FIELD, FIELD);
  expect(input).toBeInstanceOf(Float32Array);
  expect(input).toHaveLength(784);
  const values = Array.from(input as Float32Array);
  expect(values.every((v) => v === 0 || v === 1)).toBe(true);
  expect(values.some((v) => v === 1)).toBe(true);
});
