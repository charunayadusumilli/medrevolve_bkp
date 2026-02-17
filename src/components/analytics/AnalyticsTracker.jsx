import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view
    const trackPageView = async () => {
      try {
        const pageName = location.pathname.replace('/', '') || 'Home';
        await base44.functions.invoke('trackEvent', {
          eventType: 'page_view',
          pageName: pageName,
          metadata: {
            path: location.pathname,
            search: location.search
          }
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, [location]);

  return null; // This component doesn't render anything
}

// Helper function to track custom events
export const trackEvent = async (action, pageName, metadata = {}) => {
  try {
    await base44.functions.invoke('trackEvent', {
      eventType: 'button_click',
      pageName: pageName,
      action: action,
      metadata: metadata
    });
  } catch (error) {
    console.error('Event tracking error:', error);
  }
};