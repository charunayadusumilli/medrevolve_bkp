export const RUO_CATEGORIES = [
  { slug: 'peptides', label: 'Peptides' },
  { slug: 'metabolic', label: 'Metabolic' },
  { slug: 'longevity', label: 'Longevity' },
  { slug: 'supplies', label: 'Supplies' },
];

export const RUO_BANNER = 'RESEARCH USE ONLY — NOT FOR HUMAN OR ANIMAL CONSUMPTION';

export const RUO_NAV = [
  { label: 'Catalog', to: '/catalog' },
  { label: 'Lab Results', to: '/lab-results' },
  { label: 'Bulk Orders', to: '/bulk-orders' },
  { label: 'How to Order', to: '/how-to-order' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Compliance', to: '/compliance' },
  { label: 'Contact', to: '/contact' },
];

export function ruoMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export const BULK_TIERS = [
  { label: '2 cases', detail: '5% off every case' },
  { label: '3 cases', detail: '10% off every case' },
  { label: '4+ cases', detail: '15% off every case' },
];