import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NetworkStage from '../demo/NetworkStage';
import { Pt as PadPoint } from '../demo/stageLayout';
import { loadModel, MnistModel } from '../demo/mnistModel';
import { imageDataToIntensity, toModelInput } from '../demo/preprocess';
import { buildTrace, Trace } from '../demo/trace';
import { getAssetPath } from '../config';
import { startsFresh } from '../demo/session';
import '../styles/digitdemo.css';

/** The pad is 70x70 backing pixels shown at 4x, so every stroke is chunky pixel art. */
const PAD = 70;
const PEN = 6;
const DEBOUNCE_MS = 350;
const EXAMPLE_MS = 700;
const HORIZONTAL_STAGE = 900;
const STAGE_CHROME = 34;

type Pt = [number, number];
type Stroke = Pt[];

const arc = (cx: number, cy: number, rx: number, ry: number, from: number, to: number, n = 24): Stroke =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as Pt;
  });

const EXAMPLES: Array<{ digit: number; strokes: Stroke[] }> = [
  { digit: 7, strokes: [[[0.25, 0.22], [0.75, 0.22], [0.45, 0.85]]] },
  {
    digit: 2,
    strokes: [[...arc(0.5, 0.33, 0.22, 0.17, 180, 360 + 40, 18), [0.28, 0.82], [0.76, 0.82]]],
  },
  {
    digit: 3,
    strokes: [[...arc(0.48, 0.32, 0.2, 0.16, -150, 100, 14), ...arc(0.48, 0.66, 0.22, 0.18, -95, 150, 16)]],
  },
  { digit: 0, strokes: [arc(0.5, 0.5, 0.22, 0.33, -90, 270, 32)] },
  {
    digit: 4,
    strokes: [
      [[0.62, 0.14], [0.26, 0.62], [0.8, 0.62]],
      [[0.64, 0.3], [0.64, 0.88]],
    ],
  },
];

/** A 6px round pen on integer pixels: offsets of a disc centred on a pixel corner. */
const PEN_OFFSETS: Array<[number, number]> = (() => {
  const offsets: Array<[number, number]> = [];
  const r = PEN / 2;
  for (let j = -r; j < r; j += 1) {
    for (let i = -r; i < r; i += 1) {
      if ((i + 0.5) ** 2 + (j + 0.5) ** 2 <= r * r) offsets.push([i, j]);
    }
  }
  return offsets;
})();

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface Point {
  x: number;
  y: number;
}

const FLOW = [
  { text: '784 pixels', phases: [0] },
  { text: '128 neurons', phases: [1] },
  { text: '64 neurons', phases: [2] },
  { text: '10 scores', phases: [3, 4] },
];

const DigitDemo: React.FC = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = 'AI Digit Detector — live demo | Guillermo Villar';
    return () => {
      document.title = previous;
    };
  }, []);
  const [params] = useSearchParams();
  const noAuto = params.has('noauto');

  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<Float32Array>(new Float32Array(PAD * PAD));
  const stageRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<Point | null>(null);
  const hasInk = useRef(false);
  const touched = useRef(noAuto);
  const autoStarted = useRef(false);
  const modelRef = useRef<MnistModel | null>(null);
  const debounce = useRef<number | undefined>(undefined);
  const animation = useRef(0);
  const exampleIndex = useRef(0);

  const [model, setModel] = useState<MnistModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [padVersion, setPadVersion] = useState(0);
  const [inking, setInking] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [phase, setPhase] = useState(-1);
  const [exampleLabel, setExampleLabel] = useState(false);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const measure = () => {
      const content = el.clientWidth - STAGE_CHROME;
      setVertical(content < HORIZONTAL_STAGE);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadModel(getAssetPath('models/mnist-mlp.bin'))
      .then((loaded) => {
        if (cancelled) return;
        modelRef.current = loaded;
        setModel(loaded);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const context = () => {
    if (!bufferRef.current) {
      const buffer = document.createElement('canvas');
      buffer.width = PAD;
      buffer.height = PAD;
      bufferRef.current = buffer;
    }
    return bufferRef.current.getContext('2d', { willReadFrequently: true }) ?? null;
  };

  const readPad = useCallback((): Float32Array | null => {
    const ctx = context();
    if (!ctx) return null;
    padRef.current = imageDataToIntensity(ctx.getImageData(0, 0, PAD, PAD));
    return padRef.current;
  }, []);

  const syncPad = useCallback(() => {
    if (readPad()) setPadVersion((v) => v + 1);
  }, [readPad]);

  const stopTimers = useCallback(() => {
    window.clearTimeout(debounce.current);
    cancelAnimationFrame(animation.current);
  }, []);

  const cancelStroke = useCallback(() => {
    drawing.current = false;
    last.current = null;
  }, []);

  const wipeCanvas = useCallback(() => {
    const ctx = context();
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, PAD, PAD);
    hasInk.current = false;
    padRef.current = new Float32Array(PAD * PAD);
    setPadVersion((v) => v + 1);
  }, []);

  const clear = useCallback(() => {
    touched.current = true;
    stopTimers();
    cancelStroke();
    wipeCanvas();
    setTrace(null);
    setInking(false);
    setPhase(-1);
    setExampleLabel(false);
  }, [stopTimers, cancelStroke, wipeCanvas]);

  useEffect(() => {
    wipeCanvas();
    return stopTimers;
  }, [wipeCanvas, stopTimers]);

  const finalize = useCallback(() => {
    const loaded = modelRef.current;
    if (!loaded || !hasInk.current) return;
    const pixels = readPad();
    const input = pixels ? toModelInput(pixels, PAD, PAD) : null;
    if (!input) return;
    setInking(false);
    setPhase(-1);
    setTrace(buildTrace(loaded, input));
    setPlayKey((k) => k + 1);
  }, [readPad]);

  const stamp = useCallback((point: Point) => {
    const ctx = context();
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    const cx = Math.round(point.x);
    const cy = Math.round(point.y);
    PEN_OFFSETS.forEach(([i, j]) => ctx.fillRect(cx + i, cy + j, 1, 1));
    hasInk.current = true;
  }, []);

  const stampLine = useCallback(
    (from: Point, to: Point) => {
      const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) * 2));
      for (let s = 0; s <= steps; s += 1) {
        const k = s / steps;
        stamp({ x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k });
      }
    },
    [stamp]
  );

  const playStrokes = useCallback(
    (strokes: Stroke[], ms: number) => {
      stopTimers();
      cancelStroke();
      wipeCanvas();
      setTrace(null);
      setInking(false);
      setPhase(-1);
      setExampleLabel(true);

      const scaled = strokes.map((s) => s.map(([x, y]) => ({ x: x * PAD, y: y * PAD })));
      const segments: Array<{ a: Point; b: Point; start: number; len: number; first: boolean }> = [];
      let total = 0;
      scaled.forEach((stroke) => {
        for (let i = 1; i < stroke.length; i += 1) {
          const len = Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
          segments.push({ a: stroke[i - 1], b: stroke[i], start: total, len, first: i === 1 });
          total += len;
        }
      });

      let drawn = 0;
      const advance = (target: number) => {
        segments.forEach((seg) => {
          if (target <= seg.start || drawn >= seg.start + seg.len) return;
          const from = Math.max(drawn, seg.start);
          const to = Math.min(target, seg.start + seg.len);
          const at = (d: number): Point => {
            const k = seg.len === 0 ? 0 : (d - seg.start) / seg.len;
            return { x: seg.a.x + (seg.b.x - seg.a.x) * k, y: seg.a.y + (seg.b.y - seg.a.y) * k };
          };
          if (seg.first && from === seg.start) stamp(seg.a);
          stampLine(at(from), at(to));
        });
        drawn = target;
        setInking(true);
        syncPad();
      };

      if (ms <= 0 || prefersReducedMotion()) {
        advance(total);
        finalize();
        return;
      }
      const begin = performance.now();
      const tick = () => {
        const k = Math.min(1, (performance.now() - begin) / ms);
        advance(total * k);
        if (k < 1) {
          animation.current = requestAnimationFrame(tick);
        } else {
          finalize();
        }
      };
      animation.current = requestAnimationFrame(tick);
    },
    [stopTimers, cancelStroke, wipeCanvas, finalize, syncPad, stamp, stampLine]
  );

  useEffect(() => {
    if (!model || autoStarted.current || touched.current) return undefined;
    autoStarted.current = true;
    const timer = window.setTimeout(() => {
      if (!touched.current) playStrokes(EXAMPLES[0].strokes, EXAMPLE_MS);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [model, playStrokes]);

  const showExample = () => {
    touched.current = true;
    exampleIndex.current = (exampleIndex.current + 1) % EXAMPLES.length;
    playStrokes(EXAMPLES[exampleIndex.current].strokes, EXAMPLE_MS);
  };

  const start = (point: PadPoint) => {
    touched.current = true;
    stopTimers();
    if (startsFresh({ exampleShown: exampleLabel, runComplete: trace !== null && phase >= 4 })) wipeCanvas();
    setExampleLabel(false);
    setTrace(null);
    setPhase(-1);
    drawing.current = true;
    last.current = point;
    stamp(point);
    setInking(true);
    syncPad();
  };

  const move = (point: PadPoint) => {
    if (!drawing.current) return;
    if (last.current) stampLine(last.current, point);
    last.current = point;
    syncPad();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(finalize, DEBOUNCE_MS);
  };

  const revealed = trace !== null && phase >= 4;
  const best = trace ? trace.best : null;
  const confidence = trace && best !== null ? (trace.output[best] * 100).toFixed(1) : null;

  return (
    <div className="digit-demo-page">
      <Header />
      <main className="digit-demo">
        <Link to="/projects/ai-demo" className="back-link">← About the project</Link>
        <header className="digit-demo-intro">
          <h1>AI Digit Detector</h1>
          <p>
            Draw a digit from 0 to 9. The network below is the one trained in{' '}
            <a
              href="https://github.com/Guillermo-villar/AI-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              this repository
            </a>{' '}
            on the MNIST dataset, running entirely in your browser &mdash; nothing you draw is
            uploaded anywhere.
          </p>
        </header>

        <div ref={stageRef} className={`digit-stage ${vertical ? 'vertical' : 'horizontal'}`}>
          {error && <p className="digit-status error">The model could not be loaded: {error}</p>}
          {!error && !model && <p className="digit-status">Loading the model&hellip;</p>}
          {!error && model && (
            <NetworkStage
              model={model}
              trace={trace}
              pad={padRef.current}
              padVersion={padVersion}
              inking={inking}
              exampleLabel={exampleLabel}
              playKey={playKey}
              vertical={vertical}
              onPhase={setPhase}
              onPadDown={start}
              onPadMove={move}
              onPadUp={end}
            />
          )}
          <div className="digit-buttons">
            <button type="button" className="digit-clear" onClick={clear}>
              Clear
            </button>
            <button type="button" className="digit-secondary" onClick={showExample} disabled={!model}>
              Show me an example
            </button>
            <button
              type="button"
              className="digit-secondary"
              onClick={() => setPlayKey((k) => k + 1)}
              disabled={!trace}
            >
              Replay
            </button>
          </div>
        </div>

        <p className="digit-flow">
          {FLOW.map((step, i) => (
            <React.Fragment key={step.text}>
              {i > 0 && ' → '}
              <span className={step.phases.includes(phase) ? 'active' : ''}>{step.text}</span>
            </React.Fragment>
          ))}
        </p>
        <p className="digit-footnote">
          Showing the most active 16 of 128 and 12 of 64 neurons for your drawing. Line brightness is the real
          strength of each connection.
        </p>
        <p className="digit-sr" aria-live="polite">
          {revealed && best !== null ? `Prediction: ${best}, ${confidence}% confident` : ''}
        </p>

        <footer className="digit-demo-notes">
          <p>
            784 &rarr; 128 &rarr; 64 &rarr; 10 dense network, 97.3% accuracy on the 10,000-image
            MNIST test set. The weights are 108&nbsp;KB of int8, loaded on demand and evaluated in
            plain TypeScript &mdash; no machine-learning library in the bundle.
          </p>
        </footer>
      </main>
      <Footer />
    </div>
  );
};

export default DigitDemo;
