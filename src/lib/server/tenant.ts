import { kvGetJson, kvPutJson } from './kv-storage';

export type TenantConfig = {
  id: string;
  hostnames: string[];
  brandName?: string;
  logoImage?: string;
  primaryColor?: string;
  accentColor?: string;
  defaultLanguage?: 'fa' | 'en';
  enabled: boolean;
  createdAt: string;
  updatedAt?: string;
};

const DEFAULT_TENANT: TenantConfig = {
  id: 'default',
  hostnames: ['*'],
  brandName: 'New Site',
  primaryColor: '#5d7ae6',
  accentColor: '#34d399',
  defaultLanguage: 'en',
  enabled: true,
  createdAt: new Date(0).toISOString(),
};

export function tenantKey(id: string) { return `tenant:${id}`; }
export function tenantHostKey(host: string) { return `tenant-host:${host.toLowerCase()}`; }

export async function getTenantByHost(hostname: string): Promise<TenantConfig> {
  const host = hostname.split(':')[0].toLowerCase();
  const id = await kvGetJson<string | null>(tenantHostKey(host), null);
  if (!id) return DEFAULT_TENANT;
  const tenant = await kvGetJson<TenantConfig | null>(tenantKey(id), null);
  return tenant?.enabled ? tenant : DEFAULT_TENANT;
}

export async function saveTenant(input: TenantConfig) {
  const tenant: TenantConfig = { ...input, updatedAt: new Date().toISOString() };
  await kvPutJson(tenantKey(tenant.id), tenant);
  await Promise.all((tenant.hostnames || []).filter(h => h !== '*').map(h => kvPutJson(tenantHostKey(h), tenant.id)));
  return tenant;
}
