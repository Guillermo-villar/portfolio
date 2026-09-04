import posthog from 'posthog-js';

/**
 * PostHog project token.
 *
 * This is a *public* token by design: it only allows writing events into the
 * project, and it ships inside the browser bundle either way. It is not a
 * personal API key and must not be confused with one. Keeping it in source
 * rather than in a .env file is deliberate — the GitHub Pages build runs
 * locally, so an env file would have to be committed to a public repo to be
 * useful, which is exactly the mistake this repo made once with the n8n
 * webhook.
 *
 * REACT_APP_POSTHOG_KEY still wins when set, so a fork or a local build can
 * point at a different project without touching the source.
 */
const PROJECT_TOKEN = '';
const API_HOST = 'https://eu.i.posthog.com';

const token = (process.env.REACT_APP_POSTHOG_KEY || PROJECT_TOKEN).trim();

let started = false;

export const initAnalytics = (): void => {
  if (started || !token) return;
  // Nothing worth measuring on a dev machine, and it would pollute the project.
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return;

  posthog.init(token, {
    api_host: API_HOST,
    // Pageviews are sent by hand: HashRouter changes the URL without a reload,
    // so the automatic capture would only ever see the first page.
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: true,
    persistence: 'localStorage+cookie'
  });
  started = true;
};

export const capturePageView = (path: string): void => {
  if (!started) return;
  posthog.capture('$pageview', { $current_url: window.location.href, path });
};

export default posthog;
