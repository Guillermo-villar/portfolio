/**
 * Inference for the MNIST digit classifier trained in
 * https://github.com/Guillermo-villar/AI-project (MLmodel.py).
 *
 * The network is small enough — 784 -> 128 -> 64 -> 10, three dense layers —
 * that running it by hand costs a few hundred microseconds and saves pulling in
 * TensorFlow.js, which would be ~900 kB of JavaScript to evaluate 110 kB of
 * weights. The weights come from `public/models/mnist-mlp.bin`, produced by
 * `tools/export_mnist_model.py`.
 */

export const MAGIC = 'GVMNIST1';

interface Layer {
  inDim: number;
  outDim: number;
  /** Per-output-unit dequantization scale. */
  scales: Float32Array;
  biases: Float32Array;
  /** int8 kernel, row-major, shape (inDim, outDim) — same layout as Keras. */
  weights: Int8Array;
}

export interface MnistModel {
  layers: Layer[];
}

/** Reads the binary produced by tools/export_mnist_model.py. */
export const parseModel = (buffer: ArrayBuffer): MnistModel => {
  const bytes = new Uint8Array(buffer);
  const magic = String.fromCharCode(...Array.from(bytes.subarray(0, 8)));
  if (magic !== MAGIC) {
    throw new Error(`Not a digit model file (magic was "${magic}")`);
  }

  const view = new DataView(buffer);
  const count = view.getUint32(8, true);

  const shapes: Array<[number, number]> = [];
  let offset = 12;
  for (let i = 0; i < count; i += 1) {
    shapes.push([view.getUint32(offset, true), view.getUint32(offset + 4, true)]);
    offset += 8;
  }

  const layers = shapes.map(([inDim, outDim]) => {
    // Float32Array needs a 4-byte-aligned offset, which the header does not
    // guarantee once a layer's int8 block has an odd length, so copy instead of
    // creating a view. At this size the copy is free.
    const scales = new Float32Array(buffer.slice(offset, offset + outDim * 4));
    offset += outDim * 4;
    const biases = new Float32Array(buffer.slice(offset, offset + outDim * 4));
    offset += outDim * 4;
    const weights = new Int8Array(buffer.slice(offset, offset + inDim * outDim));
    offset += inDim * outDim;
    return { inDim, outDim, scales, biases, weights };
  });

  if (offset !== buffer.byteLength) {
    throw new Error(`Model file has ${buffer.byteLength - offset} trailing bytes`);
  }
  return { layers };
};

const dense = (input: Float32Array, layer: Layer): Float32Array => {
  const { inDim, outDim, scales, biases, weights } = layer;
  const output = new Float32Array(outDim);

  // Accumulate in the quantized domain and scale once at the end: one multiply
  // per output unit instead of one per weight.
  for (let i = 0; i < inDim; i += 1) {
    const x = input[i];
    if (x === 0) continue; // Binarized inputs are mostly zero — skip those rows.
    const row = i * outDim;
    for (let j = 0; j < outDim; j += 1) {
      output[j] += x * weights[row + j];
    }
  }
  for (let j = 0; j < outDim; j += 1) {
    output[j] = output[j] * scales[j] + biases[j];
  }
  return output;
};

const relu = (v: Float32Array): Float32Array => {
  for (let i = 0; i < v.length; i += 1) {
    if (v[i] < 0) v[i] = 0;
  }
  return v;
};

const softmax = (v: Float32Array): Float32Array => {
  let max = -Infinity;
  for (let i = 0; i < v.length; i += 1) {
    if (v[i] > max) max = v[i];
  }
  let sum = 0;
  for (let i = 0; i < v.length; i += 1) {
    v[i] = Math.exp(v[i] - max);
    sum += v[i];
  }
  for (let i = 0; i < v.length; i += 1) {
    v[i] /= sum;
  }
  return v;
};

/** Runs the 784-value input through the network and returns 10 probabilities. */
export const predict = (model: MnistModel, input: Float32Array): Float32Array => {
  const [first, second, third] = model.layers;
  return softmax(dense(relu(dense(relu(dense(input, first)), second)), third));
};

let cached: Promise<MnistModel> | null = null;

/** Fetches and caches the weights. Safe to call on every render. */
export const loadModel = (url: string): Promise<MnistModel> => {
  if (!cached) {
    cached = fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load the model (HTTP ${response.status})`);
        return response.arrayBuffer();
      })
      .then(parseModel)
      .catch((error) => {
        cached = null; // Let the user retry a failed download.
        throw error;
      });
  }
  return cached;
};
