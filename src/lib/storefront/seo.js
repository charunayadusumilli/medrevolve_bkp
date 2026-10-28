const BASE = 'https://medrevolve.com';

function upsertMeta(selector, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
}

function upsertLink(rel, href) {
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    document.head.appendChild(node);
  }
  node.setAttribute('href', href);
}

/**
 * Applies route-specific SEO for storefront pages: title, description,
 * canonical, Open Graph and optional JSON-LD product schema.
 */
export function applyStoreSeo({ title, description, path, jsonLd }) {
  const canonical = `${BASE}${path}`;
  document.title = title;

  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertLink('canonical', canonical);

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });

  const existing = document.getElementById('storefront-jsonld');
  if (existing) existing.remove();

  if (jsonLd) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'storefront-jsonld';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }
}

export function productJsonLd(product, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.display_name,
    description: product.description || product.clinical_notes || product.display_name,
    sku: product.sku,
    image: [product.image_url].filter(Boolean),
    brand: { '@type': 'Brand', name: product.brand_name || 'MedRevolve' },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${BASE}${path}`,
      priceCurrency: 'USD',
      price: Number(product.price).toFixed(2),
      availability:
        product.in_stock === false
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'MedRevolve' },
    },
  };
}