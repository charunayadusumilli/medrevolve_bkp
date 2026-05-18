import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackDigestEvent, startDigestTracker } from '@/lib/digestTracker';

let digestStarted = false;

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Start 30-min digest tracker once
    if (!digestStarted) {
      startDigestTracker();
      digestStarted = true;
    }
  }, []);

  useEffect(() => {
    const pageName = location.pathname.replace('/', '') || 'Home';
    trackDigestEvent('page_view', { page: pageName, path: location.pathname, search: location.search });
  }, [location]);

  return null;
}

// Helper function to track custom events — also feeds the digest
export const trackEvent = (action, pageName, metadata = {}) => {
  trackDigestEvent('button_click', { action, page: pageName, ...metadata });
};