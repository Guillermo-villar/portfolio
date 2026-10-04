export interface Frame {
  w: number;
  h: number;
  data: Uint8ClampedArray;
  px: Uint32Array;
}

const packed = new Map<string, number>();

/** '#rrggbb' to a little-endian packed RGBA (opaque) word. */
export const packColor = (hex: string): number => {
  const cached = packed.get(hex);
  if (cached !== undefined) return cached;
  const v = parseInt(hex.slice(1), 16);
  const r = (v >> 16) & 255;
  const g = (v >> 8) & 255;
  const b = v & 255;
  const word = ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0;
  packed.set(hex, word);
  return word;
};

export const createFrame = (w: number, h: number): Frame => {
  const buffer = new ArrayBuffer(w * h * 4);
  return { w, h, data: new Uint8ClampedArray(buffer), px: new Uint32Array(buffer) };
};

export const clear = (frame: Frame, color: string) => {
  frame.px.fill(packColor(color));
};

const plot = (frame: Frame, x: number, y: number, color: number, alpha: number) => {
  if (x < 0 || y < 0 || x >= frame.w || y >= frame.h) return;
  const i = y * frame.w + x;
  if (alpha >= 1) {
    frame.px[i] = color;
    return;
  }
  const j = i * 4;
  const d = frame.data;
  d[j] += ((color & 255) - d[j]) * alpha;
  d[j + 1] += (((color >> 8) & 255) - d[j + 1]) * alpha;
  d[j + 2] += (((color >> 16) & 255) - d[j + 2]) * alpha;
  d[j + 3] = 255;
};

/** Opaque write of a packed colour; out-of-bounds coordinates are ignored. */
export const plotRaw = (frame: Frame, x: number, y: number, color: number) => {
  if (x < 0 || y < 0 || x >= frame.w || y >= frame.h) return;
  frame.px[y * frame.w + x] = color;
};

export const pixel = (frame: Frame, x: number, y: number, color: string, alpha = 1) =>
  plot(frame, Math.round(x), Math.round(y), packColor(color), alpha);

/** Filled rectangle, clipped to the frame. */
export const rect = (frame: Frame, x: number, y: number, w: number, h: number, color: string, alpha = 1) => {
  const c = packColor(color);
  const x0 = Math.max(0, Math.round(x));
  const y0 = Math.max(0, Math.round(y));
  const x1 = Math.min(frame.w, Math.round(x) + Math.round(w));
  const y1 = Math.min(frame.h, Math.round(y) + Math.round(h));
  for (let yy = y0; yy < y1; yy += 1) {
    for (let xx = x0; xx < x1; xx += 1) plot(frame, xx, yy, c, alpha);
  }
};

/** Integer Bresenham line, no anti-aliasing, endpoints included. */
export const line = (
  frame: Frame,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  alpha = 1
) => {
  const c = packColor(color);
  let x = Math.round(x0);
  let y = Math.round(y0);
  const ex = Math.round(x1);
  const ey = Math.round(y1);
  const dx = Math.abs(ex - x);
  const dy = -Math.abs(ey - y);
  const sx = x < ex ? 1 : -1;
  const sy = y < ey ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    plot(frame, x, y, c, alpha);
    if (x === ex && y === ey) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
};

export const present = (ctx: CanvasRenderingContext2D, frame: Frame) => {
  ctx.putImageData(new ImageData(frame.data, frame.w, frame.h), 0, 0);
};
