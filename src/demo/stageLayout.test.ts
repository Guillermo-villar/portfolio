import {
  Orientation,
  PAD_ART,
  PAD_PIXELS,
  Pt,
  Rect,
  computeStageLayout,
  padCssRect,
  toPadCoords,
  DOT,
  MIN_GAP,
} from './stageLayout';

const inside = (r: Rect, w: number, h: number) => r.x >= 0 && r.y >= 0 && r.x + r.w <= w && r.y + r.h <= h;
const overlap = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const dotRect = (p: Pt): Rect => ({ x: p.x, y: p.y, w: DOT, h: DOT });

const cases: Array<[string, number, Orientation]> = [
  ['1440 desktop', 567, 'horizontal'],
  ['1024 medium', 471, 'horizontal'],
  ['threshold', 450, 'horizontal'],
  ['800 stacked', 359, 'vertical'],
  ['390 mobile', 154, 'vertical'],
];

test.each(cases)('%s layout stays inside the art with nothing overlapping', (_name, artW, orientation) => {
  const layout = computeStageLayout(artW, orientation);
  const { artH } = layout;
  const named: Array<[string, Rect]> = [
    ['pad', layout.pad],
    ['box', layout.box],
    ...layout.l1.dots.map((p, i) => [`l1-${i}`, dotRect(p)] as [string, Rect]),
    ...layout.l2.dots.map((p, i) => [`l2-${i}`, dotRect(p)] as [string, Rect]),
    ...layout.out.dots.map((p, i) => [`out-${i}`, dotRect(p)] as [string, Rect]),
    ...layout.out.digits.map((p, i) => [`digit-${i}`, { x: p.x, y: p.y, w: 3, h: 5 }] as [string, Rect]),
    ...layout.out.bars.map((r, i) => [`bar-${i}`, r] as [string, Rect]),
    ...layout.labels.map((l) => [l.id, l.rect] as [string, Rect]),
  ];
  named.forEach(([, r]) => expect(inside(r, artW, artH)).toBe(true));
  expect(inside({ x: layout.pad.x - 1, y: layout.pad.y - 1, w: PAD_ART + 2, h: PAD_ART + 2 }, artW, artH)).toBe(true);
  expect(layout.l1.dots).toHaveLength(16);
  expect(layout.l2.dots).toHaveLength(12);
  expect(layout.out.dots).toHaveLength(10);
  expect(layout.ports).toHaveLength(28);
  for (let i = 0; i < named.length; i += 1) {
    for (let j = i + 1; j < named.length; j += 1) {
      expect([named[i][0], named[j][0], overlap(named[i][1], named[j][1])]).toEqual([named[i][0], named[j][0], false]);
    }
  }
});

test.each(cases)('%s columns are strictly shorter along the flow and centred on the axis', (_name, artW, orientation) => {
  const layout = computeStageLayout(artW, orientation);
  const across = (r: Rect) => (orientation === 'horizontal' ? r.h : r.w);
  const sizes = [layout.pad, layout.l1.rect, layout.l2.rect, layout.out.rect].map(across);
  for (let i = 1; i < sizes.length; i += 1) expect(sizes[i]).toBeLessThan(sizes[i - 1]);
  expect(sizes[0]).toBe(140);
  const axis = (r: Rect) => (orientation === 'horizontal' ? r.y + r.h / 2 : r.x + r.w / 2);
  [layout.l1.rect, layout.l2.rect, layout.out.rect].forEach((r) => expect(Math.abs(axis(r) - axis(layout.pad))).toBeLessThanOrEqual(1.5));
  const flow = (r: Rect) => (orientation === 'horizontal' ? r.x : r.y);
  const order = [layout.pad, layout.l1.rect, layout.l2.rect, layout.out.rect, layout.box].map(flow);
  for (let i = 1; i < order.length; i += 1) expect(order[i]).toBeGreaterThan(order[i - 1]);
});

test.each(cases)('%s keeps room between columns for the connections', (_name, artW, orientation) => {
  const layout = computeStageLayout(artW, orientation);
  const start = (r: Rect) => (orientation === 'horizontal' ? r.x : r.y);
  const end = (r: Rect) => (orientation === 'horizontal' ? r.x + r.w : r.y + r.h);
  const columns = [layout.pad, layout.l1.rect, layout.l2.rect, layout.out.rect];
  for (let i = 1; i < columns.length; i += 1) expect(start(columns[i]) - end(columns[i - 1])).toBeGreaterThanOrEqual(MIN_GAP);
});

test('pad hit area maths maps css coordinates to pad pixels', () => {
  const layout = computeStageLayout(567, 'horizontal');
  const box = padCssRect(layout, 2);
  expect(box.width).toBe(PAD_ART * 2);
  expect(toPadCoords(box.left, box.top, box)).toEqual({ x: 0, y: 0 });
  expect(toPadCoords(box.left + box.width, box.top + box.height, box)).toEqual({ x: PAD_PIXELS, y: PAD_PIXELS });
  const mid = toPadCoords(box.left + box.width / 2, box.top + box.height / 2, box);
  expect(mid.x).toBeCloseTo(PAD_PIXELS / 2, 5);
  expect(mid.y).toBeCloseTo(PAD_PIXELS / 2, 5);
});
