const ORIGIN = 'https://medrevolveruo.com';

function upsertMeta(attr, key, content) {
  if (!content) return null;
  let node = document.head.querySelector(`meta[${attr}="${key}"][data-ruo-seo]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    node.setAttribute('data-ruo-seo', '1');
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
  return node;
}

function upsertLink(rel, href) {
  if (!href) return null;
  let node = document.head.querySelector(`link[rel="${rel}"][data-ruo-seo]`);
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', rel);
    node.setAttribute('data-ruo-seo', '1');
    document.head.appendChild(node);
  }
  node.setAttribute('href', href);
  return node;
}

function clearMeta() {
  document.head.querySelectorAll('[data-ruo-seo]').forEach((node) => node.remove());
}

/** Canonical URL for the current route — every RUO route is canonicalised to the store origin. */
export function setCanonical(pathname) {
  const path = !pathname || pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return upsertLink('canonical', `${ORIGIN}${path}`);
}

/** Page-level title, description, Open Graph and Twitter tags. */
export function applyRouteSeo({ title, description, path, image }) {
  if (title) document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:url', path ? `${ORIGIN}${path}` : undefined);
  upsertMeta('property', 'og:image', image);
  upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', image);
  if (path) setCanonical(path);
}

export function productTitle(product) {
  const strength = product?.strength_label || (product?.mg ? `${product.mg} mg` : '');
  const lot = product?.coa_lot ? ` · Lot ${product.coa_lot}` : '';
  return `${product?.name || 'Research material'}${strength ? ` ${strength}` : ''}${lot} | MedRevolve Research`;
}

export function productDescription(product) {
  const strength = product?.strength_label || (product?.mg ? `${product.mg} mg` : '');
  const purity = product?.purity ? `${product.purity} purity` : 'purity pending release';
  const area = product?.research_area ? `${product.research_area} research reference material. ` : '';
  return `${area}${product?.name || 'Reference material'}${strength ? `, ${strength}` : ''}. ${purity}, lot-matched COA from ${product?.lab_name || 'an independent laboratory'}. Research use only, 21+, not for human or veterinary use.`;
}

export function applyProductSeo(product) {
  applyRouteSeo({
    title: productTitle(product),
    description: productDescription(product),
    path: `/ruo/p/${product.slug}`,
    image: product.image_url,
  });
}

/** JSON-LD block keyed by id so a re-render replaces rather than duplicates it. */
export function injectJsonLd(id, payload) {
  let node = document.head.querySelector(`script[data-ruo-jsonld="${id}"]`);
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.setAttribute('data-ruo-jsonld', id);
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(payload);
}

export function removeJsonLd(id) {
  document.head.querySelector(`script[data-ruo-jsonld="${id}"]`)?.remove();
}

export function clearSeo() {
  clearMeta();
}

export function productSchema(product) {
  const strength = product?.strength_label || (product?.mg ? `${product.mg} mg` : '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.name}${strength ? ` ${strength}` : ''}`,
    sku: product.sku || product.slug,
    description: productDescription(product),
    image: product.image_url ? [product.image_url] : undefined,
    brand: { '@type': 'Brand', name: 'MedRevolve Research' },
    additionalProperty: [
      product.coa_lot && { '@type': 'PropertyValue', name: 'Lot number', value: product.coa_lot },
      product.purity && { '@type': 'PropertyValue', name: 'HPLC purity', value: product.purity },
      { '@type': 'PropertyValue', name: 'Intended use', value: 'Laboratory research only' },
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: `${ORIGIN}/ruo/p/${product.slug}`,
      priceCurrency: 'USD',
      price: Number(product.retail_price) || 0,
      availability: product.in_stock === false
        ? 'https://schema.org/BackOrder'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'MedRevolve Research' },
    },
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqs || []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MedRevolve Research',
  url: ORIGIN,
  logo: 'https://media.base44.com/images/public/698bb392815cbad420c2ec1a/d64343c19_monogram-mr.png',
  description:
    'Reference materials for in-vitro laboratory research. Third-party tested, lot-matched certificates of analysis, research use only.',
  sameAs: [
    'https://www.instagram.com/medrevolve',
    'https://www.tiktok.com/@medrevolve',
    'https://www.linkedin.com/company/medrevolve',
  ],
};

export const RUO_ORIGIN = ORIGIN;