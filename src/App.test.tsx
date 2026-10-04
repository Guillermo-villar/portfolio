import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./analytics/posthog', () => ({
  initAnalytics: jest.fn(),
  capturePageView: jest.fn(),
}));

beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  window.location.hash = '';
});

test('digit demo route loads lazily and shows the canvas controls', async () => {
  window.HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as never;
  global.fetch = jest.fn(() => new Promise(() => {})) as never;
  window.location.hash = '#/projects/ai-demo/live';
  render(<App />);
  expect(await screen.findByRole('heading', { level: 1, name: 'AI Digit Detector' }, { timeout: 5000 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
});

test('the AI project page links to the live demo', () => {
  window.location.hash = '#/projects/ai-demo';
  render(<App />);
  const link = screen.getByRole('link', { name: 'Try the live demo' });
  expect(link.getAttribute('href')).toBe('#/projects/ai-demo/live');
});
