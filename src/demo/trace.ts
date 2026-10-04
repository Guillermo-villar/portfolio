import { forward, MnistModel } from './mnistModel';

export interface Trace {
  input: Float32Array;
  hidden1: Float32Array;
  hidden2: Float32Array;
  output: Float32Array;
  best: number;
  runnerUp: number;
}

const argsortDesc = (values: Float32Array): number[] =>
  Array.from(values.keys()).sort((a, b) => values[b] - values[a]);

/** Runs the network and keeps every layer's activations for the stage to draw. */
export const buildTrace = (model: MnistModel, input: Float32Array): Trace => {
  const { hidden1, hidden2, output } = forward(model, input);
  const [best, runnerUp] = argsortDesc(output);
  return { input, hidden1, hidden2, output, best, runnerUp };
};

/** The `count` most active units, returned in ascending index order. */
export const topActive = (values: Float32Array, count: number): number[] =>
  argsortDesc(values)
    .slice(0, count)
    .sort((a, b) => a - b);

export interface Strengths {
  /** Indexed `port * shown1.length + n`: the input row (or column) port to the n-th shown layer-1 neuron. */
  inH1: Float32Array;
  /** Indexed `a * shown2.length + b` for the shown layer-1 and layer-2 neurons. */
  h1H2: Float32Array;
  /** Indexed `b * 10 + k` for the shown layer-2 neurons and every output. */
  h2Out: Float32Array;
}

const normalise = (values: Float32Array): Float32Array => {
  let max = 0;
  for (let i = 0; i < values.length; i += 1) if (values[i] > max) max = values[i];
  if (max > 0) for (let i = 0; i < values.length; i += 1) values[i] /= max;
  return values;
};

/**
 * Real connection strengths for the drawn mesh, each layer pair normalised to 0..1 by its own
 * maximum. The input ports are the 28 rows (or columns, when vertical) of the 28x28 input, so
 * a port's strength is the positive part of the summed contribution of all pixels in it.
 */
export const stageStrengths = (
  model: MnistModel,
  trace: Trace,
  shown1: number[],
  shown2: number[],
  orientation: 'horizontal' | 'vertical'
): Strengths => {
  const [first, second, third] = model.layers;
  const side = 28;

  const inH1 = new Float32Array(side * shown1.length);
  for (let port = 0; port < side; port += 1) {
    shown1.forEach((j, n) => {
      let total = 0;
      for (let k = 0; k < side; k += 1) {
        const pixel = orientation === 'horizontal' ? port * side + k : k * side + port;
        const x = trace.input[pixel];
        if (x !== 0) total += x * first.weights[pixel * first.outDim + j] * first.scales[j];
      }
      inH1[port * shown1.length + n] = Math.max(0, total);
    });
  }

  const h1H2 = new Float32Array(shown1.length * shown2.length);
  shown1.forEach((i, a) => {
    shown2.forEach((j, b) => {
      h1H2[a * shown2.length + b] = Math.max(0, trace.hidden1[i] * second.weights[i * second.outDim + j] * second.scales[j]);
    });
  });

  const h2Out = new Float32Array(shown2.length * 10);
  shown2.forEach((i, b) => {
    for (let k = 0; k < 10; k += 1) {
      h2Out[b * 10 + k] = Math.max(0, trace.hidden2[i] * third.weights[i * third.outDim + k] * third.scales[k]);
    }
  });

  return { inH1: normalise(inH1), h1H2: normalise(h1H2), h2Out: normalise(h2Out) };
};

export interface OutputLine {
  /** Index of the shown layer-2 neuron slot. */
  from: number;
  /** Output class. */
  to: number;
  /** Brightness: the class probability scaled by the line's share of that class's strongest line. */
  v: number;
}

/**
 * The few lines into the output layer that matter: only classes with at least `minProb` get any,
 * and a class with probability p gets max(1, round(maxLines * p)) of its strongest positive
 * contributions. `h2Out` is indexed `slot * 10 + class` as returned by `stageStrengths`.
 */
export const outputLines = (
  h2Out: Float32Array,
  output: Float32Array,
  { maxLines, minProb }: { maxLines: number; minProb: number }
): OutputLine[] => {
  const slots = h2Out.length / 10;
  const lines: OutputLine[] = [];
  for (let k = 0; k < 10; k += 1) {
    const p = output[k];
    if (p < minProb) continue;
    const ranked = Array.from({ length: slots }, (_, b) => b)
      .filter((b) => h2Out[b * 10 + k] > 0)
      .sort((x, y) => h2Out[y * 10 + k] - h2Out[x * 10 + k])
      .slice(0, Math.max(1, Math.round(maxLines * p)));
    if (ranked.length === 0) continue;
    const top = h2Out[ranked[0] * 10 + k];
    ranked.forEach((b) => lines.push({ from: b, to: k, v: p * (h2Out[b * 10 + k] / top) }));
  }
  return lines;
};
