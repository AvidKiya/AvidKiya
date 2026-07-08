import { kvDelete, kvGetJson, kvListJson, kvPutJson } from './kv-storage';

export type StoredCoupon = {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses?: number;
  uses: number;
  expiresAt?: string;
  firstPurchaseOnly: boolean;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export function couponKey(code: string) { return `shop:coupon:${code.toUpperCase()}`; }

export async function listCoupons(includeDisabled = true) {
  const rows = await kvListJson<StoredCoupon>('shop:coupon:');
  return rows.filter(c => includeDisabled || c.enabled).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function getCoupon(code: string) {
  return kvGetJson<StoredCoupon | null>(couponKey(code), null);
}

export async function saveCoupon(coupon: StoredCoupon) {
  const next = { ...coupon, code: coupon.code.toUpperCase(), updatedAt: new Date().toISOString() };
  await kvPutJson(couponKey(next.code), next);
  return next;
}

export async function deleteCoupon(code: string) {
  await kvDelete(couponKey(code));
}

export function validateCoupon(coupon: StoredCoupon | null, subtotal = 0) {
  if (!coupon) return { ok: false, error: 'Invalid coupon code' };
  if (!coupon.enabled) return { ok: false, error: 'Coupon is disabled' };
  if (coupon.maxUses && coupon.uses >= coupon.maxUses) return { ok: false, error: 'Coupon usage limit reached' };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { ok: false, error: 'Coupon has expired' };
  const discount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : Math.min(coupon.value, subtotal);
  return { ok: true, discount: Math.round(discount), coupon };
}
