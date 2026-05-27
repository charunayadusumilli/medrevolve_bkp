/**
 * SEOHead — drop this component at the top of any page to inject
 * SEO meta tags dynamically based on route + optional overrides.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { injectSEO } from '@/lib/seoMeta';
import { detectDomain } from '@/lib/domainConfig';

export default function SEOHead({ title, description, ogImage }) {
  const location = useLocation();
  const domain = detectDomain();

  useEffect(() => {
    injectSEO(
      location.pathname,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(ogImage && { og_image: ogImage }),
      },
      domain
    );
  }, [location.pathname, title, description, ogImage, domain]);

  return null;
}