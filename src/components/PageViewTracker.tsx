import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, capturePageView } from '../analytics/posthog';

/**
 * Sends one $pageview per route change. Replaces the old n8n VisitorTracker,
 * which shipped the visitor's IP, city, ISP and full browsing history to a
 * webhook whose URL was committed to this public repository.
 */
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    capturePageView(location.pathname);
  }, [location.pathname]);

  return null;
};

export default PageViewTracker;
