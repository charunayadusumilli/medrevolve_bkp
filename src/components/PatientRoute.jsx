import { useEffect } from 'react';

/**
 * Patient app routes belong on app.medrevolve.com.
 * On the public B2B domains these paths redirect to their patient-app equivalents.
 * Elsewhere (builder preview, patient app host) the page renders normally.
 */
const B2B_HOSTS = ['medrevolve.com', 'www.medrevolve.com', 'medrevolveb2b.com', 'www.medrevolveb2b.com'];

export default function PatientRoute({ children }) {
  const host = window.location.hostname.toLowerCase();
  const isB2bHost = B2B_HOSTS.includes(host);

  useEffect(() => {
    if (isB2bHost) {
      window.location.replace(`https://app.medrevolve.com${window.location.pathname}${window.location.search}`);
    }
  }, [isB2bHost]);

  if (isB2bHost) return null;
  return children;
}