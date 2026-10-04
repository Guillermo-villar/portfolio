import { Frame, rect } from './pixel';

export interface PixelFont {
  w: number;
  h: number;
  spacing: number;
  glyphs: Record<string, string[]>;
}

const rows = (spec: string) => spec.split('/');

const SMALL: Record<string, string> = {
  '0': '111/101/101/101/111',
  '1': '010/110/010/010/111',
  '2': '111/001/111/100/111',
  '3': '111/001/111/001/111',
  '4': '101/101/111/001/001',
  '5': '111/100/111/001/111',
  '6': '111/100/111/101/111',
  '7': '111/001/010/010/010',
  '8': '111/101/111/101/111',
  '9': '111/101/111/001/111',
  A: '010/101/111/101/101',
  B: '110/101/110/101/110',
  C: '011/100/100/100/011',
  D: '110/101/101/101/110',
  E: '111/100/110/100/111',
  F: '111/100/110/100/100',
  G: '011/100/101/101/011',
  H: '101/101/111/101/101',
  I: '111/010/010/010/111',
  J: '001/001/001/101/010',
  K: '101/101/110/101/101',
  L: '100/100/100/100/111',
  M: '101/111/111/101/101',
  N: '110/101/101/101/101',
  O: '010/101/101/101/010',
  P: '110/101/110/100/100',
  Q: '010/101/101/111/011',
  R: '110/101/110/101/101',
  S: '011/100/010/001/110',
  T: '111/010/010/010/010',
  U: '101/101/101/101/111',
  V: '101/101/101/101/010',
  W: '101/101/111/111/101',
  X: '101/101/010/101/101',
  Y: '101/101/010/010/010',
  Z: '111/001/010/100/111',
  '%': '101/001/010/100/101',
  '.': '000/000/000/000/010',
  '·': '000/000/010/000/000',
  '×': '000/101/010/101/000',
  '+': '000/010/111/010/000',
  '-': '000/000/111/000/000',
  '=': '000/111/000/111/000',
  ' ': '000/000/000/000/000',
};

const BIG: Record<string, string> = {
  '0': '01110/10001/10011/10101/11001/10001/01110',
  '1': '00100/01100/00100/00100/00100/00100/01110',
  '2': '01110/10001/00001/00010/00100/01000/11111',
  '3': '11110/00001/00001/01110/00001/00001/11110',
  '4': '00010/00110/01010/10010/11111/00010/00010',
  '5': '11111/10000/11110/00001/00001/10001/01110',
  '6': '00110/01000/10000/11110/10001/10001/01110',
  '7': '11111/00001/00010/00100/01000/01000/01000',
  '8': '01110/10001/10001/01110/10001/10001/01110',
  '9': '01110/10001/10001/01111/00001/00010/01100',
};

const build = (w: number, h: number, table: Record<string, string>): PixelFont => ({
  w,
  h,
  spacing: 1,
  glyphs: Object.fromEntries(Object.entries(table).map(([ch, spec]) => [ch, rows(spec)])),
});

export const FONT_3X5 = build(3, 5, SMALL);
export const FONT_5X7 = build(5, 7, BIG);

export const textWidth = (text: string, font: PixelFont, scale = 1): number =>
  text.length === 0 ? 0 : (text.length * font.w + (text.length - 1) * font.spacing) * scale;

/** Draws text; `maxRows` limits how many glyph rows are drawn (top first). */
export const drawText = (
  frame: Frame,
  text: string,
  x: number,
  y: number,
  color: string,
  font: PixelFont,
  scale = 1,
  maxRows = font.h
) => {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const glyph = font.glyphs[ch];
    if (glyph) {
      for (let r = 0; r < Math.min(font.h, maxRows); r += 1) {
        for (let c = 0; c < font.w; c += 1) {
          if (glyph[r][c] === '1') rect(frame, cx + c * scale, y + r * scale, scale, scale, color);
        }
      }
    }
    cx += (font.w + font.spacing) * scale;
  }
};
