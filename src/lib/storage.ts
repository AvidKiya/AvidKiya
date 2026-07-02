import { PortfolioData, defaultData } from './data';

const STORAGE_KEY = 'portfolio_data';

export function getPortfolioData(): PortfolioData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading portfolio data:', e);
  }
  return defaultData;
}

export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving portfolio data:', e);
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('admin_auth') === 'true';
}

export function setAdminAuthenticated(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) {
    sessionStorage.setItem('admin_auth', 'true');
  } else {
    sessionStorage.removeItem('admin_auth');
  }
}

// Password is stored as a simple hash in localStorage
const ADMIN_PASS_KEY = 'admin_password';
const DEFAULT_PASS = 'admin123';

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_PASS;
  return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_PASS;
}

export function setAdminPassword(newPass: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PASS_KEY, newPass);
}

export function checkAdminPassword(pass: string): boolean {
  return pass === getAdminPassword();
}
