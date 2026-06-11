import { useEffect } from 'react';

/**
 * Immediately redirects to an external URL.
 * Used to push patient-facing routes off the root domain.
 */
export default function ExternalRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return null;
}