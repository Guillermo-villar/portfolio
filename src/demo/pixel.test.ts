import { clear, createFrame, line, packColor, rect } from './pixel';

const lit = (frame: ReturnType<typeof createFrame>, x: number, y: number) =>
  frame.px[y * frame.w + x] !== packColor('#000000');

const cells = (frame: ReturnType<typeof createFrame>) => {
  const out: Array<[number, number]> = [];
  for (let y = 0; y < frame.h; y += 1) {
    for (let x = 0; x < frame.w; x += 1) if (lit(frame, x, y)) out.push([x, y]);
  }
  return out;
};

test('line hits both endpoints and is 8-connected', () => {
  const frame = createFrame(40, 30);
  clear(frame, '#000000');
  line(frame, 3, 2, 35, 27, '#ffffff');
  expect(lit(frame, 3, 2)).toBe(true);
  expect(lit(frame, 35, 27)).toBe(true);
  const pts = cells(frame);
  pts.forEach(([x, y]) => {
    const neighbours = pts.filter(([a, b]) => (a !== x || b !== y) && Math.abs(a - x) <= 1 && Math.abs(b - y) <= 1);
    expect(neighbours.length).toBeGreaterThanOrEqual(1);
  });
  expect(pts.length).toBe(33);
});

test('line with alpha blends instead of overwriting', () => {
  const frame = createFrame(4, 1);
  clear(frame, '#000000');
  line(frame, 0, 0, 3, 0, '#ffffff', 0.5);
  expect(frame.data[0]).toBeGreaterThan(100);
  expect(frame.data[0]).toBeLessThan(160);
});

test('rect clips at the frame bounds without throwing', () => {
  const frame = createFrame(10, 10);
  clear(frame, '#000000');
  expect(() => rect(frame, -5, -5, 8, 8, '#ffffff')).not.toThrow();
  expect(() => rect(frame, 8, 8, 20, 20, '#ffffff')).not.toThrow();
  expect(lit(frame, 0, 0)).toBe(true);
  expect(lit(frame, 3, 3)).toBe(false);
  expect(lit(frame, 9, 9)).toBe(true);
});
