import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MnistModel } from './mnistModel';
import { displayOffset, shiftedCell, shiftPortStrengths } from './centring';
import { OutputLine, Trace, Strengths, outputLines, stageStrengths, topActive } from './trace';
import { Frame, clear, createFrame, line, plotRaw, packColor, present, rect } from './pixel';
import { FONT_3X5, FONT_5X7, drawText, textWidth } from './pixelFont';
import {
  DOT,
  GRID_CELL,
  GRID_PITCH,
  GRID_SIDE,
  H1_SHOWN,
  H2_SHOWN,
  Orientation,
  PAD_PIXELS,
  PAD_SCALE,
  Pt,
  StageLayout,
  EXAMPLE_LABEL,
  computeStageLayout,
  padCssRect,
  toPadCoords,
} from './stageLayout';

export { computeStageLayout } from './stageLayout';

const BG = '#141414';
const PAD_BG = '#000000';
const LEVELS = ['#333333', '#7a4c0c', '#e68900', '#ff9800'];
const RINGS = ['#333333', '#3a2608', '#9a5a08', '#b86f06'];
const HIGHLIGHT = '#ffd08a';
const MESH_IDLE = '#1f1f1f';
const MESH_IDLE_LAST = '#1a1a1a';
const SWEEP = '#3b2c14';
const TEXT = '#9e9e9e';
const DIM_TEXT = '#666666';
const LABEL = '#cfcfcf';

const T_READ = 600;
const PHASES: Array<[number, number]> = [
  [600, 1300],
  [1300, 1900],
  [1900, 2500],
];
const T_REVEAL = 2500;
const T_END = 3000;
const FINAL = Number.POSITIVE_INFINITY;
const LIGHT_SPREAD = 120;
const LIT_CUTOFF = 0.35;
const MAX_FAN_LINES = 40;
const AMBIENT_MS = 83;
const SWEEP_EVERY = 3200;
const SWEEP_MS = 1500;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const level = (r: number) => (r < 0.05 ? 0 : r < 0.35 ? 1 : r < 0.7 ? 2 : 3);
const hiddenLevel = (r: number) => (r >= 0.75 ? 3 : r >= 0.45 ? 2 : 1);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const phaseAt = (t: number) => {
  if (t < T_READ) return 0;
  if (t < PHASES[1][0]) return 1;
  if (t < PHASES[2][0]) return 2;
  if (t < T_REVEAL) return 3;
  return 4;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lerp = (a: Pt, b: Pt, f: number): Pt => ({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f });
const centre = (p: Pt): Pt => ({ x: p.x + Math.floor(DOT / 2), y: p.y + Math.floor(DOT / 2) });

const frameBox = (frame: Frame, x: number, y: number, w: number, h: number, color: string) => {
  rect(frame, x, y, w, 1, color);
  rect(frame, x, y + h - 1, w, 1, color);
  rect(frame, x, y, 1, h, color);
  rect(frame, x + w - 1, y, 1, h, color);
};

const DISC = ['.###.', '#####', '#####', '#####', '.###.'];
const HALO = ['..###..', '.#####.', '#######', '#######', '#######', '.#####.', '..###..'];

const stamp = (frame: Frame, mask: string[], x: number, y: number, color: string) => {
  const c = packColor(color);
  mask.forEach((row, r) => {
    for (let k = 0; k < row.length; k += 1) if (row[k] === '#') plotRaw(frame, x + k, y + r, c);
  });
};

const drawDot = (frame: Frame, p: Pt, lv: number, flash: boolean, winner: boolean) => {
  if (winner) stamp(frame, HALO, p.x - 1, p.y - 1, LEVELS[3]);
  if (lv === 0 && !winner) {
    stamp(frame, DISC, p.x, p.y, LEVELS[0]);
    return;
  }
  stamp(frame, DISC, p.x, p.y, winner ? LEVELS[3] : RINGS[lv]);
  rect(frame, p.x + 1, p.y + 1, 3, 3, flash || winner ? HIGHLIGHT : LEVELS[lv]);
};

interface MeshPair {
  from: Pt[];
  to: Pt[];
  na: number;
  nb: number;
}

const buildMesh = (L: StageLayout): MeshPair[] => {
  const l1 = L.l1.dots.map(centre);
  const l2 = L.l2.dots.map(centre);
  const out = L.out.dots.map(centre);
  return [
    { from: L.ports, to: l1, na: L.ports.length, nb: l1.length },
    { from: l1, to: l2, na: l1.length, nb: l2.length },
    { from: l2, to: out, na: l2.length, nb: out.length },
  ];
};

interface Plan {
  shown1: number[];
  shown2: number[];
  s: Strengths;
  /** Per layer pair, the indices of lit lines from weakest to strongest, and the top-5% cut-off. */
  lit: Array<{ order: number[]; top: number }>;
  portStrength: Float32Array;
  lastLines: OutputLine[];
  offset: { dx: number; dy: number };
}

const buildPlan = (model: MnistModel, trace: Trace, orientation: Orientation): Plan => {
  const shown1 = topActive(trace.hidden1, H1_SHOWN);
  const shown2 = topActive(trace.hidden2, H2_SHOWN);
  const offset = displayOffset(trace.input);
  const raw = stageStrengths(model, trace, shown1, shown2, orientation);
  const s = { ...raw, inH1: shiftPortStrengths(raw.inH1, shown1.length, orientation === 'horizontal' ? offset.dy : offset.dx) };
  const groups = [s.inH1, s.h1H2, s.h2Out];
  const lit = groups.map((values, pair) => {
    let order = Array.from(values.keys())
      .filter((i) => values[i] >= LIT_CUTOFF)
      .sort((a, b) => values[a] - values[b]);
    if (pair === 0) order = order.slice(-MAX_FAN_LINES);
    const positive = Array.from(values).filter((v) => v > 0).sort((a, b) => b - a);
    const top = positive.length ? positive[Math.min(positive.length, Math.max(2, Math.ceil(positive.length * 0.03))) - 1] : 2;
    return { order, top };
  });
  const portStrength = new Float32Array(GRID_SIDE);
  lit[0].order.forEach((index) => {
    const port = Math.floor(index / shown1.length);
    portStrength[port] = Math.max(portStrength[port], s.inH1[index]);
  });
  const lastLines = outputLines(s.h2Out, trace.output, { maxLines: 6, minProb: 0.05 });
  return { shown1, shown2, s, lit, portStrength, lastLines, offset };
};

interface Props {
  model: MnistModel | null;
  trace: Trace | null;
  pad: Float32Array;
  padVersion: number;
  inking: boolean;
  exampleLabel: boolean;
  playKey: number;
  vertical: boolean;
  onPhase?: (phase: number) => void;
  onPadDown?: (point: Pt) => void;
  onPadMove?: (point: Pt) => void;
  onPadUp?: () => void;
}


const NetworkStage: React.FC<Props> = ({
  model,
  trace,
  pad,
  padVersion,
  inking,
  exampleLabel,
  playKey,
  vertical,
  onPhase,
  onPadDown,
  onPadMove,
  onPadUp,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cssWidth, setCssWidth] = useState(0);
  const frameRef = useRef<Frame | null>(null);
  const layoutRef = useRef<StageLayout | null>(null);
  const lastT = useRef<number | null>(null);
  const raf = useRef(0);
  const phase = useRef(-1);
  const blink = useRef(true);
  const ambient = useRef(0);
  const sweep = useRef<number | null>(null);
  const onPhaseRef = useRef(onPhase);
  onPhaseRef.current = onPhase;

  const orientation: Orientation = vertical ? 'vertical' : 'horizontal';
  const minArt = vertical ? 150 : 300;
  const scale = Math.floor(cssWidth / 2) >= minArt ? 2 : 1;
  const artWidth = Math.floor(cssWidth / scale);
  const layout = useMemo(
    () => (cssWidth > 0 ? computeStageLayout(artWidth, orientation) : null),
    [cssWidth, artWidth, orientation]
  );
  layoutRef.current = layout;
  const mesh = useMemo(() => (layout ? buildMesh(layout) : null), [layout]);
  const plan = useMemo(
    () => (model && trace ? buildPlan(model, trace, orientation) : null),
    [model, trace, orientation]
  );
  const propsRef = useRef({ trace, pad, inking, exampleLabel, mesh, plan });
  propsRef.current = { trace, pad, inking, exampleLabel, mesh, plan };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => setCssWidth(Math.round(el.clientWidth));
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const draw = useCallback((t: number | null) => {
    const canvas = canvasRef.current;
    const frame = frameRef.current;
    const L = layoutRef.current;
    const { trace: tr, pad: padPixels, inking: drawing, exampleLabel: example, mesh: m, plan: pl } = propsRef.current;
    if (!canvas || !frame || !L || !m) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const playing = tr !== null && pl !== null && t !== null;
    const now = t === null ? 0 : t;
    const isVertical = L.orientation === 'vertical';
    clear(frame, BG);

    // The idle mesh, with the faint attract-mode wavefront sweeping across it.
    const sweepFront = !playing && sweep.current !== null ? sweep.current : null;
    m.forEach((pair, p) => {
      const u0 = isVertical ? pair.from[0].y : pair.from[0].x;
      const u1 = isVertical ? pair.to[0].y : pair.to[0].x;
      const uMin = isVertical ? L.pad.y + L.pad.h : L.pad.x + L.pad.w;
      const uMax = isVertical ? L.out.dots[0].y : L.out.dots[0].x;
      const front = sweepFront === null ? null : uMin + sweepFront * (uMax - uMin);
      for (let a = 0; a < pair.na; a += 1) {
        for (let b = 0; b < pair.nb; b += 1) {
          const from = pair.from[a];
          const to = pair.to[b];
          line(frame, from.x, from.y, to.x, to.y, p === 2 ? MESH_IDLE_LAST : MESH_IDLE);
          if (front !== null) {
            const span = u1 - u0;
            const t1 = (front - u0) / span;
            const t0 = (front - 14 - u0) / span;
            if (t1 > 0 && t0 < 1) {
              const s = lerp(from, to, clamp01(t0));
              const e = lerp(from, to, clamp01(t1));
              line(frame, s.x, s.y, e.x, e.y, SWEEP);
            }
          }
        }
      }
    });

    if (playing && pl) {
      const groups = [pl.s.inH1, pl.s.h1H2, pl.s.h2Out];
      const lastColor = (v: number) => (v >= 0.75 ? HIGHLIGHT : v >= 0.45 ? '#b86f06' : v >= 0.2 ? '#7a4c0c' : '#4a300e');
      m.forEach((pair, p) => {
        const [start, end] = PHASES[p];
        const progress = clamp01((now - start) / (end - start));
        if (progress <= 0) return;
        if (p === 2) {
          pl.lastLines.forEach((ln) => {
            const a = pair.from[ln.from];
            const b = pair.to[ln.to];
            const tip = lerp(a, b, progress);
            line(frame, a.x, a.y, tip.x, tip.y, lastColor(ln.v));
            if (progress < 1) {
              const len = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
              const tail = lerp(a, b, Math.max(0, progress - 3 / len));
              line(frame, tail.x, tail.y, tip.x, tip.y, HIGHLIGHT);
            }
          });
          return;
        }
        pl.lit[p].order.forEach((index) => {
          const strength = groups[p][index];
          const a = pair.from[Math.floor(index / pair.nb)];
          const b = pair.to[index % pair.nb];
          const color =
            strength >= pl.lit[p].top ? HIGHLIGHT : strength < 0.45 ? '#4a300e' : strength < 0.75 ? '#7a4c0c' : '#b86f06';
          const tip = lerp(a, b, progress);
          line(frame, a.x, a.y, tip.x, tip.y, color);
          if (progress < 1) {
            const len = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
            const tail = lerp(a, b, Math.max(0, progress - 3 / len));
            line(frame, tail.x, tail.y, tip.x, tip.y, HIGHLIGHT);
          }
        });
      });
      if (now >= T_END && ambient.current > 0) {
        pl.lastLines.forEach((ln, k) => {
          const a = m[2].from[ln.from];
          const b = m[2].to[ln.to];
          const f = (ambient.current / 1400 + k * 0.37) % 1;
          const at = lerp(a, b, f);
          rect(frame, Math.round(at.x) - 1, Math.round(at.y) - 1, 2, 2, HIGHLIGHT);
        });
      }
    }

    // Input ports on the pad's facing edge.
    L.ports.forEach((port, i) => {
      const lit = playing && pl && now >= PHASES[0][0];
      const s = lit && pl ? pl.portStrength[i] : 0;
      const color = !lit ? '#3a3a3a' : s >= 0.75 ? '#b86f06' : s >= 0.35 ? '#7a4c0c' : '#3a3a3a';
      if (isVertical) rect(frame, port.x, port.y - 2, 1, 2, color);
      else rect(frame, port.x - 2, port.y, 2, 1, color);
    });

    // The pad: raw ink, morphing into the model's real 28x28 input while the scanline sweeps.
    frameBox(frame, L.pad.x - 1, L.pad.y - 1, L.pad.w + 2, L.pad.h + 2, '#2a2a2a');
    rect(frame, L.pad.x, L.pad.y, L.pad.w, L.pad.h, PAD_BG);
    const scanY = playing ? clamp01(now / T_READ) * L.pad.h : 0;
    const gridRows = playing && tr ? (now >= T_READ ? GRID_SIDE : Math.floor(scanY / GRID_PITCH)) : 0;
    const rawFrom = gridRows * GRID_PITCH;
    for (let i = 0; i < PAD_PIXELS * PAD_PIXELS; i += 1) {
      if (padPixels[i] <= 0) continue;
      const ay = Math.floor(i / PAD_PIXELS) * PAD_SCALE;
      if (ay < rawFrom) continue;
      const flash = playing && now < T_READ && ay - scanY >= -2 && ay - scanY < 4;
      rect(frame, L.pad.x + (i % PAD_PIXELS) * PAD_SCALE, L.pad.y + ay, PAD_SCALE, PAD_SCALE, flash ? HIGHLIGHT : '#f2f2f2');
    }
    if (tr) {
      const off = pl ? pl.offset : displayOffset(tr.input);
      for (let r = 0; r < gridRows; r += 1) {
        for (let c = 0; c < GRID_SIDE; c += 1) {
          const on = shiftedCell(tr.input, r, c, off.dx, off.dy) > 0;
          rect(frame, L.pad.x + c * GRID_PITCH, L.pad.y + r * GRID_PITCH, GRID_CELL, GRID_CELL, on ? '#f2f2f2' : '#1c1c1c');
        }
      }
    }
    if (playing && now < T_READ) rect(frame, L.pad.x, L.pad.y + Math.min(L.pad.h - 1, Math.floor(scanY)), L.pad.w, 1, LEVELS[3]);

    // Neurons.
    const drawColumn = (
      dots: Pt[],
      ellipsis: Pt[],
      values: Float32Array | null,
      shown: number[] | null,
      lightAt: number,
      salt: number
    ) => {
      const max = values && shown ? Math.max(...shown.map((i) => values[i]), 1e-6) : 1;
      dots.forEach((p, n) => {
        let lv = 0;
        let flash = false;
        if (playing && values && shown) {
          const at = lightAt + hash(n + salt) * LIGHT_SPREAD;
          if (now >= at) {
            lv = hiddenLevel(values[shown[n]] / max);
            flash = now - at < 40;
          }
        }
        drawDot(frame, p, lv, flash, false);
      });
      ellipsis.forEach((p) => (isVertical ? rect(frame, p.x, p.y + 2, 1, 1, DIM_TEXT) : rect(frame, p.x + 2, p.y, 1, 1, DIM_TEXT)));
    };
    drawColumn(L.l1.dots, L.l1.ellipsis, tr ? tr.hidden1 : null, pl ? pl.shown1 : null, PHASES[0][1], 1);
    drawColumn(L.l2.dots, L.l2.ellipsis, tr ? tr.hidden2 : null, pl ? pl.shown2 : null, PHASES[1][1], 57);

    const reveal = playing && now >= T_REVEAL;
    L.out.dots.forEach((p, k) => {
      const prob = tr ? tr.output[k] : 0;
      const isBest = tr !== null && k === tr.best;
      const at = PHASES[2][1] + (isBest ? 0 : hash(k + 113) * LIGHT_SPREAD);
      const lit = playing && tr !== null && now >= at;
      drawDot(frame, p, lit ? level(prob) : 0, lit && now - at < 40, lit && isBest);
      const dg = L.out.digits[k];
      drawText(frame, String(k), dg.x, dg.y, lit && isBest ? HIGHLIGHT : lit ? LABEL : DIM_TEXT, FONT_3X5);
      if (lit) {
        const bar = L.out.bars[k];
        const max = isVertical ? bar.h : bar.w;
        const len = Math.round(Math.round(prob * max) * clamp01((now - at) / 250));
        if (len > 0) {
          const color = isBest ? HIGHLIGHT : LEVELS[Math.max(1, level(prob))];
          if (isVertical) rect(frame, bar.x, bar.y, bar.w, len, color);
          else rect(frame, bar.x, bar.y, len, bar.h, color);
        }
      }
    });

    L.labels.forEach((label) => {
      if (label.id === 'pad-dim' && gridRows < GRID_SIDE) return;
      const { rect: r } = label;
      rect(frame, r.x - 1, r.y - 1, r.w + 2, r.h + 2, BG);
      const text = label.id === 'pad-name' && example ? EXAMPLE_LABEL : label.text;
      drawText(frame, text, r.x + Math.round((r.w - textWidth(text, FONT_3X5)) / 2), r.y, label.kind === 'name' ? DIM_TEXT : LABEL, FONT_3X5);
    });

    const box = L.box;
    frameBox(frame, box.x, box.y, box.w, box.h, reveal ? LEVELS[3] : '#3a3a3a');
    if (playing && tr && reveal) {
      const digitRows = Math.min(7, Math.ceil(clamp01((now - T_REVEAL) / 300) * 7));
      const flicker = now >= T_REVEAL + 300 && now < T_REVEAL + 350 && Math.floor(now / 16) % 2 === 0;
      drawText(
        frame,
        String(tr.best),
        box.x + Math.round((box.w - textWidth('0', FONT_5X7, 4)) / 2),
        box.y + 6,
        flicker ? '#ffffff' : LEVELS[3],
        FONT_5X7,
        4,
        digitRows
      );
      const text = `${(tr.output[tr.best] * 100).toFixed(1)}%`;
      const typeStart = T_REVEAL + 350;
      const chars = Math.min(text.length, Math.max(0, Math.floor((now - typeStart) / ((T_END - typeStart) / text.length))));
      drawText(frame, text.slice(0, chars), box.x + Math.round((box.w - textWidth(text, FONT_3X5)) / 2), box.y + 40, LABEL, FONT_3X5);
    } else if (!tr && !drawing) {
      drawText(frame, 'DRAW', box.x + Math.round((box.w - textWidth('DRAW', FONT_3X5)) / 2), box.y + 18, TEXT, FONT_3X5);
      if (blink.current) rect(frame, box.x + Math.round(box.w / 2) - 2, box.y + 28, 4, 1, TEXT);
    } else if (!tr || !playing) {
      drawText(frame, '...', box.x + Math.round((box.w - textWidth('...', FONT_3X5)) / 2), box.y + 23, TEXT, FONT_3X5);
    }

    present(ctx, frame);
  }, []);

  useEffect(() => {
    if (!layout) return;
    frameRef.current = createFrame(layout.artW, layout.artH);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = layout.artW;
    canvas.height = layout.artH;
    canvas.style.width = `${layout.artW * scale}px`;
    canvas.style.height = `${layout.artH * scale}px`;
    draw(lastT.current);
  }, [layout, scale, draw]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    ambient.current = 0;
    if (!trace) {
      lastT.current = null;
      phase.current = -1;
      draw(null);
      return undefined;
    }
    const setPhase = (p: number) => {
      if (p !== phase.current) {
        phase.current = p;
        onPhaseRef.current?.(p);
      }
    };
    phase.current = -1;
    let timer: number | undefined;
    if (prefersReducedMotion()) {
      lastT.current = FINAL;
      draw(FINAL);
      setPhase(4);
      return undefined;
    }
    const begin = performance.now();
    const tick = () => {
      const t = performance.now() - begin;
      if (t >= T_END) {
        lastT.current = FINAL;
        ambient.current = 1;
        draw(FINAL);
        setPhase(4);
        const ambientStart = performance.now();
        timer = window.setInterval(() => {
          ambient.current = performance.now() - ambientStart + 1;
          draw(FINAL);
        }, AMBIENT_MS);
        return;
      }
      lastT.current = t;
      draw(t);
      setPhase(phaseAt(t));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.clearInterval(timer);
      ambient.current = 0;
    };
  }, [trace, playKey, draw]);

  useEffect(() => {
    if (!trace) draw(null);
  }, [padVersion, inking, exampleLabel, trace, draw]);

  useEffect(() => {
    if (trace || inking) return undefined;
    const timer = window.setInterval(() => {
      blink.current = !blink.current;
      draw(null);
    }, 500);
    return () => window.clearInterval(timer);
  }, [trace, inking, draw]);

  useEffect(() => {
    if (trace || inking || prefersReducedMotion()) return undefined;
    let frame = 0;
    const run = () => {
      const begin = performance.now();
      let lastDraw = 0;
      const step = () => {
        const now = performance.now();
        const k = (now - begin) / SWEEP_MS;
        if (k >= 1) {
          sweep.current = null;
          draw(null);
          return;
        }
        if (now - lastDraw >= 33) {
          lastDraw = now;
          sweep.current = k;
          draw(null);
        }
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const first = window.setTimeout(run, 800);
    const timer = window.setInterval(run, SWEEP_EVERY);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      cancelAnimationFrame(frame);
      sweep.current = null;
    };
  }, [trace, inking, draw]);

  const hit = layout ? padCssRect(layout, scale) : null;
  const pointOf = (event: React.PointerEvent<HTMLDivElement>): Pt =>
    toPadCoords(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());

  return (
    <div ref={wrapRef} className="network-stage">
      <div
        className="network-stage-inner"
        style={layout ? { width: layout.artW * scale, height: layout.artH * scale } : undefined}
      >
        <canvas ref={canvasRef} className="network-stage-canvas" aria-hidden="true" />
        {hit && (
          <div
            className="pad-hit"
            aria-label="Drawing area: draw a digit from 0 to 9"
            style={{ left: hit.left, top: hit.top, width: hit.width, height: hit.height }}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              onPadDown?.(pointOf(event));
            }}
            onPointerMove={(event) => onPadMove?.(pointOf(event))}
            onPointerUp={() => onPadUp?.()}
            onPointerLeave={() => onPadUp?.()}
            onPointerCancel={() => onPadUp?.()}
          />
        )}
      </div>
    </div>
  );
};

export default NetworkStage;
