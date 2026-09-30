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

test('blog post renders markdown lists inside a list element', () => {
  window.location.hash = '#/blog/3';
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Modern Web Development Frameworks/i })).toBeInTheDocument();
  const item = screen.getByText('Gentle learning curve');
  expect(item.tagName).toBe('LI');
  expect(item.parentElement?.tagName).toBe('UL');
});

test('home page shows current experience and projects', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Hi, I'm Guillermo/i })).toBeInTheDocument();
  expect(screen.getByText('Graduate Tech Program')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Sol Sombra' })).toBeInTheDocument();
});

test('digit demo route loads lazily and shows the canvas controls', async () => {
  window.HTMLCanvasElement.prototype.getContext = jest.fn(() => null) as never;
  global.fetch = jest.fn(() => new Promise(() => {})) as never;
  window.location.hash = '#/projects/ai-demo/live';
  render(<App />);
  expect(await screen.findByRole('heading', { level: 1, name: 'AI Digit Detector' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
});

test.each(['#/this-does-not-exist', '#/blog/99'])('%s shows the 404 page', (hash) => {
  window.location.hash = hash;
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /This page doesn't exist/i })).toBeInTheDocument();
});
