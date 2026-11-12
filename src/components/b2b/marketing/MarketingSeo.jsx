import { useEffect } from 'react';
import { MARKETING_META, MARKETING_FAQ } from '@/lib/partner/marketingPage';

function setMeta(selector, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
}

/** Title, description, canonical, Open Graph and FAQPage JSON-LD for /marketing. */
export default function MarketingSeo() {
  useEffect(() => {
    const { title, description, canonical } = MARKETING_META;
    document.title = title;

    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: MARKETING_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'marketing-faq-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  return null;
}