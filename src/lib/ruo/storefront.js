import { base44 } from '@/api/base44Client';

export const RUO_STATEMENT =
  'MedRevolve Research supplies reference materials for in-vitro laboratory research only. We are not a 503A or 503B compounding pharmacy and do not compound, dispense, or prescribe for human or veterinary use. No therapeutic claims are made for any material offered here.';

export const GATE_STATEMENT =
  'Research Use Only. 21 or older. Not for human or veterinary use.';

export const COA_DISCLAIMER =
  'Reports are hosted by the testing laboratory, not published by us.';

export async function loadCatalog() {
  const page = await base44.entities.RUOProduct.filter({}, { limit: 200 });
  return page?.items ?? [];
}

export function bySku(products) {
  return new Map((products || []).map((p) => [p.sku, p]));
}