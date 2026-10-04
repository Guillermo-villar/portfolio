import { FONT_3X5, FONT_5X7, textWidth } from './pixelFont';

const used = ['INPUT', 'LAYER 1', 'LAYER 2', 'OUTPUT', '28×28 = 784', 'EXAMPLE · DRAW YOUR OWN', 'DRAW', '...', '0123456789', '99.8%'];

test('every character the stage uses has a 3x5 glyph of the right shape', () => {
  Array.from(new Set(used.join('').toUpperCase())).forEach((ch) => {
    const glyph = FONT_3X5.glyphs[ch];
    expect(glyph).toBeDefined();
    expect(glyph).toHaveLength(5);
    glyph.forEach((row) => expect(row).toHaveLength(3));
  });
});

test('digits 0-9 exist in the 5x7 font with the right shape', () => {
  for (const ch of '0123456789') {
    const glyph = FONT_5X7.glyphs[ch];
    expect(glyph).toHaveLength(7);
    glyph.forEach((row) => expect(row).toHaveLength(5));
  }
});

test('textWidth is glyph widths plus spacing, times scale', () => {
  expect(textWidth('', FONT_3X5)).toBe(0);
  expect(textWidth('AB', FONT_3X5)).toBe(3 + 1 + 3);
  expect(textWidth('7', FONT_5X7, 4)).toBe(20);
  expect(textWidth('99.8%', FONT_3X5)).toBe(5 * 3 + 4);
});
