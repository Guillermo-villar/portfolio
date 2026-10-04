import fs from 'fs';
import path from 'path';
import { Layer, forward, parseModel, predict } from './mnistModel';
import { buildTrace, outputLines, stageStrengths, topActive } from './trace';

const model = (() => {
  const file = fs.readFileSync(path.join(__dirname, '../../public/models/mnist-mlp.bin'));
  return parseModel(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer);
})();

const stroke = (() => {
  const input = new Float32Array(784);
  for (let x = 6; x < 22; x += 1) input[5 * 28 + x] = 1;
  for (let y = 5; y < 24; y += 1) {
    const x = Math.round(21 - (y - 5) * 0.55);
    input[y * 28 + x] = 1;
    input[y * 28 + x - 1] = 1;
  }
  return input;
})();

test('forward output matches predict and layer sizes are right', () => {
  const { hidden1, hidden2, output } = forward(model, stroke);
  const expected = predict(model, stroke);
  expect(hidden1).toHaveLength(128);
  expect(hidden2).toHaveLength(64);
  expect(output).toHaveLength(10);
  output.forEach((v, i) => expect(v).toBeCloseTo(expected[i], 6));
  expect(Array.from(hidden1).every((v) => v >= 0)).toBe(true);
  expect(Array.from(hidden2).every((v) => v >= 0)).toBe(true);
});

test('buildTrace keeps every layer and best is the argmax of the output', () => {
  const trace = buildTrace(model, stroke);
  expect(trace.input).toBe(stroke);
  expect(trace.hidden1).toHaveLength(128);
  expect(trace.hidden2).toHaveLength(64);
  const sorted = Array.from(trace.output).map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]);
  expect(trace.best).toBe(sorted[0][1]);
  expect(trace.runnerUp).toBe(sorted[1][1]);
});

test('topActive returns the n most active units in ascending index order', () => {
  expect(topActive(Float32Array.from([0, 5, 1, 9, 3, 0, 7]), 3)).toEqual([1, 3, 6]);
});

const layer = (inDim: number, outDim: number, weights: Record<number, number> = {}): Layer => {
  const w = new Int8Array(inDim * outDim);
  Object.entries(weights).forEach(([idx, v]) => {
    w[Number(idx)] = v;
  });
  return { inDim, outDim, scales: new Float32Array(outDim).fill(1), biases: new Float32Array(outDim), weights: w };
};

test('stageStrengths sums the right input row or column per port and normalises each pair', () => {
  const input = new Float32Array(784);
  [2 * 28 + 3, 2 * 28 + 5, 4 * 28 + 1].forEach((i) => {
    input[i] = 1;
  });
  // Shown neuron 0 is fed by both pixels of row 2 (weight 1) and by the one in row 4 with a negative weight.
  const weights: Record<number, number> = { [(2 * 28 + 3) * 128 + 0]: 1, [(2 * 28 + 5) * 128 + 0]: 1, [(4 * 28 + 1) * 128 + 0]: -3 };
  const fake = { layers: [layer(784, 128, weights), layer(128, 64, { [0 * 64 + 0]: 4 }), layer(64, 10, { [0 * 10 + 7]: 2 })] };
  const hidden1 = new Float32Array(128);
  hidden1[0] = 3;
  const hidden2 = new Float32Array(64);
  hidden2[0] = 5;
  const trace = { input, hidden1, hidden2, output: new Float32Array(10), best: 7, runnerUp: 0 };

  const s = stageStrengths(fake, trace, [0], [0], 'horizontal');
  expect(s.inH1).toHaveLength(28);
  expect(s.inH1[2]).toBe(1);
  expect(s.inH1[4]).toBe(0);
  expect(Array.from(s.inH1).filter((v) => v > 0)).toHaveLength(1);
  expect(s.h1H2).toHaveLength(1);
  expect(s.h1H2[0]).toBe(1);
  expect(s.h2Out).toHaveLength(10);
  expect(s.h2Out[7]).toBe(1);
  expect(Math.max(...Array.from(s.h2Out))).toBe(1);

  // Columns 3 and 5 each carry one of row 2's pixels, so both reach the layer maximum.
  const v = stageStrengths(fake, trace, [0], [0], 'vertical');
  expect(v.inH1[3]).toBe(1);
  expect(v.inH1[5]).toBe(1);
  expect(v.inH1[1]).toBe(0);
});

test('stageStrengths on the real model stays within 0..1 and reaches 1', () => {
  const trace = buildTrace(model, stroke);
  const shown1 = topActive(trace.hidden1, 16);
  const shown2 = topActive(trace.hidden2, 12);
  (['horizontal', 'vertical'] as const).forEach((orientation) => {
    const s = stageStrengths(model, trace, shown1, shown2, orientation);
    expect(s.inH1).toHaveLength(28 * 16);
    expect(s.h1H2).toHaveLength(16 * 12);
    expect(s.h2Out).toHaveLength(12 * 10);
    [s.inH1, s.h1H2, s.h2Out].forEach((group) => {
      const values = Array.from(group);
      expect(values.every((x) => x >= 0 && x <= 1)).toBe(true);
      expect(Math.max(...values)).toBe(1);
    });
  });
});


const synthetic = (probs: number[]) => {
  const out = Float32Array.from(probs);
  const h2Out = new Float32Array(12 * 10);
  for (let b = 0; b < 12; b += 1) {
    for (let k = 0; k < 10; k += 1) h2Out[b * 10 + k] = ((b * 7 + k * 3) % 11) / 10;
  }
  return { out, h2Out };
};
const OPTIONS = { maxLines: 6, minProb: 0.05 };

test('outputLines gives a confident pick all the lines and nothing else', () => {
  const { out, h2Out } = synthetic([0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.99, 0.001, 0.002]);
  const lines = outputLines(h2Out, out, OPTIONS);
  expect(lines).toHaveLength(6);
  lines.forEach((l) => expect(l.to).toBe(7));
});

test('outputLines splits an ambiguous case by probability', () => {
  const { out, h2Out } = synthetic([0.0005, 0.0005, 0.0005, 0.0005, 0.6, 0.0005, 0.0005, 0.38, 0.0005, 0.0185]);
  const lines = outputLines(h2Out, out, OPTIONS);
  expect(lines.filter((l) => l.to === 4)).toHaveLength(4);
  expect(lines.filter((l) => l.to === 7)).toHaveLength(2);
  expect(lines.filter((l) => l.to !== 4 && l.to !== 7)).toHaveLength(0);
});

test('outputLines are positive, bounded and ordered by contribution within a class', () => {
  const { out, h2Out } = synthetic([0.05, 0.05, 0.05, 0.05, 0.4, 0.05, 0.05, 0.25, 0.05, 0.05]);
  const lines = outputLines(h2Out, out, OPTIONS);
  lines.forEach((l) => {
    expect(h2Out[l.from * 10 + l.to]).toBeGreaterThan(0);
    expect(l.v).toBeGreaterThan(0);
    expect(l.v).toBeLessThanOrEqual(1);
  });
  for (let k = 0; k < 10; k += 1) {
    const mine = lines.filter((l) => l.to === k).map((l) => h2Out[l.from * 10 + k]);
    expect(mine).toEqual([...mine].sort((a, b) => b - a));
  }
});

test('outputLines on the real model target the predicted class', () => {
  const trace = buildTrace(model, stroke);
  const shown1 = topActive(trace.hidden1, 16);
  const shown2 = topActive(trace.hidden2, 12);
  const s = stageStrengths(model, trace, shown1, shown2, 'horizontal');
  const lines = outputLines(s.h2Out, trace.output, OPTIONS);
  expect(lines.length).toBeGreaterThan(0);
  expect(lines.some((l) => l.to === trace.best)).toBe(true);
  const counts = Array.from({ length: 10 }, (_, k) => lines.filter((l) => l.to === k).length);
  expect(counts[trace.best]).toBe(Math.max(...counts));
  lines.forEach((l) => expect(trace.output[l.to]).toBeGreaterThanOrEqual(0.05));
});
