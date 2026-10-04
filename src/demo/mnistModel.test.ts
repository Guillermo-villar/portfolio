import fs from 'fs';
import path from 'path';
import { parseModel, predict } from './mnistModel';

const loadBuffer = (): ArrayBuffer => {
  const file = fs.readFileSync(path.join(__dirname, '../../public/models/mnist-mlp.bin'));
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
};

const sum = (values: Float32Array) => Array.from(values).reduce((a, b) => a + b, 0);

test('parses the shipped weights into the 784-128-64-10 layout', () => {
  const model = parseModel(loadBuffer());
  expect(model.layers.map((l) => [l.inDim, l.outDim])).toEqual([
    [784, 128],
    [128, 64],
    [64, 10],
  ]);
});

test('predict returns a probability distribution for a blank input', () => {
  const output = predict(parseModel(loadBuffer()), new Float32Array(784));
  expect(output).toHaveLength(10);
  expect(sum(output)).toBeCloseTo(1, 5);
});

test('predict returns a probability distribution for a drawn input', () => {
  const input = new Float32Array(784);
  for (let y = 4; y < 24; y += 1) {
    input[y * 28 + 14] = 1;
    input[y * 28 + 15] = 1;
  }
  const output = predict(parseModel(loadBuffer()), input);
  expect(output).toHaveLength(10);
  expect(sum(output)).toBeCloseTo(1, 5);
  expect(Math.max(...Array.from(output))).toBeGreaterThan(0.1);
});

test('parseModel rejects a buffer with the wrong magic', () => {
  const bytes = new Uint8Array(loadBuffer());
  bytes.set(new TextEncoder().encode('NOTAMODEL'.slice(0, 8)), 0);
  expect(() => parseModel(bytes.buffer)).toThrow(/Not a digit model file/);
});
