import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loadModel, predict, MnistModel } from '../demo/mnistModel';
import { imageDataToIntensity, toModelInput, SIZE } from '../demo/preprocess';
import { getAssetPath } from '../config';
import { useDocumentTitle } from '../utils';
import '../styles/digitdemo.css';

/** Canvas is a multiple of 28 so the preview grid lines up exactly. */
const CANVAS = 280;
const STROKE = 22;

interface Point {
  x: number;
  y: number;
}

const DigitDemo: React.FC = () => {
  useDocumentTitle('AI Digit Detector — live demo');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<Point | null>(null);
  const hasInk = useRef(false);

  const [model, setModel] = useState<MnistModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadModel(getAssetPath('models/mnist-mlp.bin'))
      .then((loaded) => {
        if (!cancelled) setModel(loaded);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const context = () => canvasRef.current?.getContext('2d', { willReadFrequently: true }) ?? null;

  const clear = useCallback(() => {
    const ctx = context();
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS, CANVAS);
    ctx.lineWidth = STROKE;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#fff';
    hasInk.current = false;
    setScores(null);

    const preview = previewRef.current?.getContext('2d');
    if (preview) {
      preview.fillStyle = '#000';
      preview.fillRect(0, 0, SIZE, SIZE);
    }
  }, []);

  useEffect(() => {
    clear();
  }, [clear]);

  /** Reads the canvas, normalizes it the way MNIST was normalized, predicts. */
  const run = useCallback(() => {
    const ctx = context();
    if (!ctx || !model || !hasInk.current) return;

    const image = ctx.getImageData(0, 0, CANVAS, CANVAS);
    const input = toModelInput(imageDataToIntensity(image), CANVAS, CANVAS);
    if (!input) {
      setScores(null);
      return;
    }

    // Show the visitor exactly what the network receives - it explains an odd
    // prediction far better than any amount of copy can.
    const preview = previewRef.current?.getContext('2d');
    if (preview) {
      const out = preview.createImageData(SIZE, SIZE);
      for (let i = 0; i < input.length; i += 1) {
        const v = input[i] * 255;
        out.data[i * 4] = v;
        out.data[i * 4 + 1] = v;
        out.data[i * 4 + 2] = v;
        out.data[i * 4 + 3] = 255;
      }
      preview.putImageData(out, 0, 0);
    }

    setScores(predict(model, input));
  }, [model]);

  // Predict once the weights arrive, in case something was already drawn.
  useEffect(() => {
    if (model) run();
  }, [model, run]);

  const positionOf = (event: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS
    };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const point = positionOf(event);
    last.current = point;

    // A single tap should leave a dot rather than nothing at all.
    const ctx = context();
    if (ctx) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, STROKE / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      hasInk.current = true;
    }
    run();
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = context();
    const point = positionOf(event);
    if (ctx && last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      hasInk.current = true;
    }
    last.current = point;
    run();
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
    run();
  };

  const best = scores
    ? scores.reduce(
        (bestIndex, value, index, all) => (value > all[bestIndex] ? index : bestIndex),
        0
      )
    : null;

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

        <div className="digit-demo-grid">
          <section className="digit-demo-panel">
            <canvas
              ref={canvasRef}
              width={CANVAS}
              height={CANVAS}
              className="digit-canvas"
              aria-label="Drawing area: draw a digit from 0 to 9"
              onPointerDown={start}
              onPointerMove={move}
              onPointerUp={end}
              onPointerLeave={end}
              onPointerCancel={end}
            />
            <button type="button" className="digit-clear" onClick={clear}>
              Clear
            </button>
          </section>

          <section className="digit-demo-panel results">
            {error && <p className="digit-status error">The model could not be loaded: {error}</p>}
            {!error && !model && <p className="digit-status">Loading the model&hellip;</p>}
            {!error && model && !scores && (
              <p className="digit-status">Draw a digit to see the prediction.</p>
            )}

            {model && scores && best !== null && (
              <>
                <div className="digit-prediction">
                  <span className="digit-prediction-value">{best}</span>
                  <span className="digit-prediction-confidence">
                    {(scores[best] * 100).toFixed(1)}% confident
                  </span>
                </div>
                <ul className="digit-scores">
                  {Array.from(scores).map((score, digit) => (
                    <li key={digit} className={digit === best ? 'top' : ''}>
                      <span className="digit-label">{digit}</span>
                      <span className="digit-bar">
                        <span className="digit-bar-fill" style={{ width: `${score * 100}%` }} />
                      </span>
                      <span className="digit-percent">{(score * 100).toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="digit-preview">
              <canvas
                ref={previewRef}
                width={SIZE}
                height={SIZE}
                className="digit-preview-canvas"
                aria-hidden="true"
              />
              <p>
                What the network sees: your drawing cropped, scaled to 20&times;20, centred by its
                centre of mass in a 28&times;28 field and thresholded to black and white &mdash; the
                exact normalization the model was trained on.
              </p>
            </div>
          </section>
        </div>

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
