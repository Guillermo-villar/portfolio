import { FONT_3X5, textWidth } from './pixelFont';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Pt {
  x: number;
  y: number;
}

export type Orientation = 'horizontal' | 'vertical';

/** One layer of neuron discs, all centred on the flow axis. */
export interface Column {
  /** Top-left corner of each DOT x DOT disc. */
  dots: Pt[];
  /** Bounding box of the discs (and digits for the output). */
  rect: Rect;
  /** Three single-pixel dots marking the neurons left out of the middle. */
  ellipsis: Pt[];
}

export interface Label {
  id: string;
  text: string;
  kind: 'name' | 'dim';
  rect: Rect;
}

export interface StageLayout {
  artW: number;
  artH: number;
  orientation: Orientation;
  /** The drawing pad: the input layer of the network. */
  pad: Rect;
  /** One port per input row (horizontal) or column (vertical) on the pad's facing edge. */
  ports: Pt[];
  l1: Column;
  l2: Column;
  out: Column & { digits: Pt[]; bars: Rect[] };
  box: Rect;
  labels: Label[];
}

export const PAD_PIXELS = 70;
export const PAD_SCALE = 2;
export const PAD_ART = PAD_PIXELS * PAD_SCALE;
export const GRID_SIDE = 28;
export const GRID_PITCH = 5;
export const GRID_CELL = 4;
export const DOT = 5;
export const BOX_W = 46;
export const BOX_H = 51;
export const H1_SHOWN = 16;
export const H2_SHOWN = 12;
export const HORIZONTAL_MIN_ART = 450;
export const MIN_GAP = 40;
const MARGIN = 8;
const READOUT_GAP = 24;
const TOP = 14;
const LABEL_H = 5;
const ELLIPSIS_EXTRA = 4;
const L1_PITCH = 8;
const L2_PITCH = 7;
const OUT_PITCH_H = 8;
const OUT_PITCH_V = 8;
const DIGIT_GAP = 2;
export const BAR_MAX_H = 16;
export const BAR_MAX_V = 12;
const BAR_H = 3;
const ROW_GAP = 48;

const extent = (count: number, pitch: number, extra: number) => (count - 1) * pitch + DOT + extra;

/** Lays `count` discs along one axis, centred on `centre`, with optional elision in the middle. */
const lay = (
  count: number,
  pitch: number,
  extra: number,
  centre: number,
  place: (along: number) => Pt
): { dots: Pt[]; ellipsis: Pt[]; span: number; start: number } => {
  const span = extent(count, pitch, extra);
  const start = Math.round(centre - span / 2);
  const half = count / 2;
  const offsets = Array.from({ length: count }, (_, i) => start + i * pitch + (extra > 0 && i >= half ? extra : 0));
  const dots = offsets.map(place);
  const ellipsis: Pt[] = [];
  if (extra > 0) {
    const mid = Math.round((offsets[half - 1] + DOT + offsets[half]) / 2);
    [-2, 0, 2].forEach((d) => ellipsis.push(place(mid + d)));
  }
  return { dots, ellipsis, span, start };
};

export const EXAMPLE_LABEL = 'EXAMPLE · DRAW YOUR OWN';

/** The label above the pad reads INPUT, or EXAMPLE · DRAW YOUR OWN while an example is shown. */
const padNameLabel = (centreX: number, y: number): Label => {
  const w = textWidth(EXAMPLE_LABEL, FONT_3X5);
  return { id: 'pad-name', text: 'INPUT', kind: 'name', rect: { x: Math.round(centreX - w / 2), y, w, h: LABEL_H } };
};

const centredLabel = (id: string, text: string, kind: Label['kind'], centreX: number, y: number): Label => {
  const w = textWidth(text, FONT_3X5);
  return { id, text, kind, rect: { x: Math.round(centreX - w / 2), y, w, h: LABEL_H } };
};

const horizontal = (artW: number): StageLayout => {
  const cy = TOP + PAD_ART / 2;
  const outW = DOT + DIGIT_GAP + 3 + 2 + BAR_MAX_H;
  const fixed = PAD_ART + DOT + DOT + outW + READOUT_GAP + BOX_W;
  const gap = Math.max(MIN_GAP, Math.floor((artW - 2 * MARGIN - fixed) / 3));

  const padX = MARGIN;
  const l1X = padX + PAD_ART + gap;
  const l2X = l1X + DOT + gap;
  const outX = l2X + DOT + gap;
  const boxX = outX + outW + READOUT_GAP;

  const pad: Rect = { x: padX, y: TOP, w: PAD_ART, h: PAD_ART };
  const ports = Array.from({ length: GRID_SIDE }, (_, r) => ({ x: padX + PAD_ART + 2, y: TOP + r * GRID_PITCH + 2 }));

  const a = lay(H1_SHOWN, L1_PITCH, ELLIPSIS_EXTRA, cy, (y) => ({ x: l1X, y }));
  const b = lay(H2_SHOWN, L2_PITCH, ELLIPSIS_EXTRA, cy, (y) => ({ x: l2X, y }));
  const o = lay(10, OUT_PITCH_H, 0, cy, (y) => ({ x: outX, y }));
  const l1: Column = { dots: a.dots, ellipsis: a.ellipsis, rect: { x: l1X, y: a.start, w: DOT, h: a.span } };
  const l2: Column = { dots: b.dots, ellipsis: b.ellipsis, rect: { x: l2X, y: b.start, w: DOT, h: b.span } };
  const out = {
    dots: o.dots,
    ellipsis: [],
    rect: { x: outX, y: o.start, w: outW, h: o.span },
    digits: o.dots.map((d) => ({ x: d.x + DOT + DIGIT_GAP, y: d.y })),
    bars: o.dots.map((d) => ({ x: d.x + DOT + DIGIT_GAP + 3 + 2, y: d.y + 1, w: BAR_MAX_H, h: BAR_H })),
  };
  const box: Rect = { x: boxX, y: Math.round(cy - BOX_H / 2), w: BOX_W, h: BOX_H };

  const labels: Label[] = [];
  const addColumn = (id: string, name: string, dim: string, r: Rect) => {
    const centre = r.x + r.w / 2;
    labels.push(id === 'pad' ? padNameLabel(centre, r.y - LABEL_H - 4) : centredLabel(`${id}-name`, name, 'name', centre, r.y - LABEL_H - 4));
    labels.push(centredLabel(`${id}-dim`, dim, 'dim', centre, r.y + r.h + 4));
  };
  addColumn('pad', 'INPUT', '28×28 = 784', pad);
  addColumn('l1', 'LAYER 1', '128', l1.rect);
  addColumn('l2', 'LAYER 2', '64', l2.rect);
  addColumn('out', 'OUTPUT', '10', out.rect);

  return {
    artW,
    artH: TOP + PAD_ART + 4 + LABEL_H + 6,
    orientation: 'horizontal',
    pad,
    ports,
    l1,
    l2,
    out,
    box,
    labels,
  };
};

const vertical = (artW: number): StageLayout => {
  const cx = artW / 2;
  const pad: Rect = { x: Math.round(cx - PAD_ART / 2), y: TOP, w: PAD_ART, h: PAD_ART };
  const ports = Array.from({ length: GRID_SIDE }, (_, c) => ({ x: pad.x + c * GRID_PITCH + 2, y: pad.y + PAD_ART + 2 }));

  let y = pad.y + PAD_ART + ROW_GAP;
  const a = lay(H1_SHOWN, L1_PITCH, ELLIPSIS_EXTRA, cx, (x) => ({ x, y }));
  const l1: Column = { dots: a.dots, ellipsis: a.ellipsis, rect: { x: a.start, y, w: a.span, h: DOT } };
  y += DOT + ROW_GAP;
  const b = lay(H2_SHOWN, L2_PITCH, ELLIPSIS_EXTRA, cx, (x) => ({ x, y }));
  const l2: Column = { dots: b.dots, ellipsis: b.ellipsis, rect: { x: b.start, y, w: b.span, h: DOT } };
  y += DOT + ROW_GAP;
  const outY = y;
  const o = lay(10, OUT_PITCH_V, 0, cx, (x) => ({ x, y: outY }));
  const out = {
    dots: o.dots,
    ellipsis: [],
    rect: { x: o.start, y: outY, w: o.span, h: DOT + DIGIT_GAP + 5 + 2 + BAR_MAX_V },
    digits: o.dots.map((d) => ({ x: d.x + 1, y: outY + DOT + DIGIT_GAP })),
    bars: o.dots.map((d) => ({ x: d.x + 1, y: outY + DOT + DIGIT_GAP + 5 + 2, w: BAR_H, h: BAR_MAX_V })),
  };
  y = outY + DOT + DIGIT_GAP + 5 + 2 + BAR_MAX_V + READOUT_GAP;
  const box: Rect = { x: Math.round(cx - BOX_W / 2), y, w: BOX_W, h: BOX_H };

  return {
    artW,
    artH: y + BOX_H + 8,
    orientation: 'vertical',
    pad,
    ports,
    l1,
    l2,
    out,
    box,
    labels: [padNameLabel(cx, TOP - LABEL_H - 4)],
  };
};

export const computeStageLayout = (artW: number, orientation: Orientation): StageLayout =>
  orientation === 'horizontal' ? horizontal(artW) : vertical(artW);

/** CSS-pixel rectangle of the pad inside the scaled stage canvas. */
export const padCssRect = (layout: StageLayout, scale: number) => ({
  left: layout.pad.x * scale,
  top: layout.pad.y * scale,
  width: layout.pad.w * scale,
  height: layout.pad.h * scale,
});

/** Viewport coordinates to pad-pixel coordinates (0..PAD_PIXELS) inside `box`. */
export const toPadCoords = (
  clientX: number,
  clientY: number,
  box: { left: number; top: number; width: number; height: number }
): Pt => ({
  x: ((clientX - box.left) / box.width) * PAD_PIXELS,
  y: ((clientY - box.top) / box.height) * PAD_PIXELS,
});
