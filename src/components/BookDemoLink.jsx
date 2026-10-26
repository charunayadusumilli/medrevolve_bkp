import React from 'react';
import { Link } from 'react-router-dom';
import { BOOKING_URL } from '@/lib/contactConfig';
import { detectDomain } from '@/lib/domainConfig';

/**
 * One demo CTA everywhere.
 * B2B site  → the free Calendly intro call (never a paid checkout).
 * Patient app → the get-started wizard.
 * Renders an anchor for the external URL so routing never mangles it.
 */
export default function BookDemoLink({ className, onClick, children }) {
  if (detectDomain() === 'APP') {
    return (
      <Link to="/start" className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {children}
    </a>
  );
}