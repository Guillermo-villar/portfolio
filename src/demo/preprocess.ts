/**
 * Turns whatever the visitor draws into the 28x28 input the model was trained
 * on.
 *
 * This is the part that decides whether an in-browser MNIST demo feels accurate
 * or broken. The model never saw raw drawings: every training image was
 * size-normalized into a 20x20 box and then centred in a 28x28 field *by its
 * centre of mass*, and finally binarized at 0.5 (MLmodel.py does the
 * binarization). Naively squashing the canvas to 28x28 skips all of that and
 * the accuracy falls off a cliff, so the same normalization is reproduced here.
 */

export const SIZE = 28;
/** MNIST fits the digit itself into 20x20, leaving a 4px margin all round. */
export const BOX = 20;
/** Anything fainter than this is antialiasing, not ink. */
const INK = 0.05;
/** MLmodel.py trains on `(x / 255) >= 0.5`. */
const BINARIZE = 0.5;

export interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Tightest box containing ink, or null when the canvas is blank. */
export const inkBounds = (pixels: Float32Array, width: number, height: number): Bounds | null => {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[y * width + x] > INK) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < 0) return null;
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
};

/**
 * Area-averaged resample of a sub-rectangle. Averaging (rather than sampling)
 * matters here: a thin stroke shrunk 10x by nearest-neighbour breaks into
 * dashes, and the model then sees a digit drawn with a dotted pen.
 */
const resample = (
  pixels: Float32Array,
  width: number,
  bounds: Bounds,
  outWidth: number,
  outHeight: number
): Float32Array => {
  const out = new Float32Array(outWidth * outHeight);
  const scaleX = bounds.width / outWidth;
  const scaleY = bounds.height / outHeight;

  for (let y = 0; y < outHeight; y += 1) {
    const y0 = bounds.top + y * scaleY;
    const y1 = y0 + scaleY;
    const firstRow = Math.floor(y0);
    const lastRow = Math.min(Math.ceil(y1) - 1, bounds.top + bounds.height - 1);

    for (let x = 0; x < outWidth; x += 1) {
      const x0 = bounds.left + x * scaleX;
      const x1 = x0 + scaleX;
      const firstCol = Math.floor(x0);
      const lastCol = Math.min(Math.ceil(x1) - 1, bounds.left + bounds.width - 1);

      let total = 0;
      let weight = 0;
      for (let row = firstRow; row <= lastRow; row += 1) {
        const coverY = Math.min(row + 1, y1) - Math.max(row, y0);
        if (coverY <= 0) continue;
        for (let col = firstCol; col <= lastCol; col += 1) {
          const coverX = Math.min(col + 1, x1) - Math.max(col, x0);
          if (coverX <= 0) continue;
          const area = coverX * coverY;
          total += pixels[row * width + col] * area;
          weight += area;
        }
      }
      out[y * outWidth + x] = weight > 0 ? total / weight : 0;
    }
  }
  return out;
};

/**
 * Normalizes a grayscale drawing (0 = background, 1 = ink) into the model's
 * 784-value input. Returns null for a blank canvas.
 */
export const toModelInput = (
  pixels: Float32Array,
  width: number,
  height: number
): Float32Array | null => {
  const bounds = inkBounds(pixels, width, height);
  if (!bounds) return null;

  // Fit the longer side to 20px, preserving the aspect ratio, so a "1" stays
  // narrow instead of being stretched into a "0".
  const scale = BOX / Math.max(bounds.width, bounds.height);
  const scaledWidth = Math.max(1, Math.min(BOX, Math.round(bounds.width * scale)));
  const scaledHeight = Math.max(1, Math.min(BOX, Math.round(bounds.height * scale)));
  const digit = resample(pixels, width, bounds, scaledWidth, scaledHeight);

  // Centre of mass of the ink, which is what MNIST aligns on — not the centre
  // of the bounding box. The difference is visible on digits with a long tail.
  let mass = 0;
  let massX = 0;
  let massY = 0;
  for (let y = 0; y < scaledHeight; y += 1) {
    for (let x = 0; x < scaledWidth; x += 1) {
      const v = digit[y * scaledWidth + x];
      mass += v;
      massX += v * x;
      massY += v * y;
    }
  }
  const centreX = mass > 0 ? massX / mass : (scaledWidth - 1) / 2;
  const centreY = mass > 0 ? massY / mass : (scaledHeight - 1) / 2;

  const offsetX = Math.round(SIZE / 2 - centreX);
  const offsetY = Math.round(SIZE / 2 - centreY);

  const input = new Float32Array(SIZE * SIZE);
  for (let y = 0; y < scaledHeight; y += 1) {
    const targetY = y + offsetY;
    if (targetY < 0 || targetY >= SIZE) continue;
    for (let x = 0; x < scaledWidth; x += 1) {
      const targetX = x + offsetX;
      if (targetX < 0 || targetX >= SIZE) continue;
      input[targetY * SIZE + targetX] = digit[y * scaledWidth + x] >= BINARIZE ? 1 : 0;
    }
  }
  return input;
};

/**
 * Pulls ink intensity out of a canvas. The demo draws white on black, so the
 * red channel is the intensity; the alpha channel is folded in so a canvas
 * cleared to transparent reads as empty rather than as solid ink.
 */
export const imageDataToIntensity = (image: ImageData): Float32Array => {
  const { data, width, height } = image;
  const pixels = new Float32Array(width * height);
  for (let i = 0; i < pixels.length; i += 1) {
    const p = i * 4;
    pixels[i] = (data[p] / 255) * (data[p + 3] / 255);
  }
  return pixels;
};
