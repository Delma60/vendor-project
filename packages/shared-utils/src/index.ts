// packages/shared-utils/src/index.ts

import type { User, UserRole } from '@foodconnect/shared-types';
import { useEffect, useState } from 'react';

export interface ApiClient { request<T>(path: string, init?: RequestInit): Promise<T>; }
export const apiClient: ApiClient = {
  async request<T>(path: string, init?: RequestInit) {
    const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json() as Promise<T>;
  },
};

export function useApiQuery<T>(path: string | null): { data: T | null; error: Error | null; loading: boolean } {
  const [state, setState] = useState<{ data: T | null; error: Error | null; loading: boolean }>({ data: null, error: null, loading: Boolean(path) });
  useEffect(() => {
    if (!path) { setState({ data: null, error: null, loading: false }); return; }
    let active = true;
    setState({ data: null, error: null, loading: true });
    apiClient.request<T>(path).then(data => active && setState({ data, error: null, loading: false })).catch(error => active && setState({ data: null, error, loading: false }));
    return () => { active = false; };
  }, [path]);
  return state;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem('foodconnect:user');
  return value ? JSON.parse(value) as User : null;
}

export function hasRole(user: User | null, allowedRoles: UserRole[]): boolean { return Boolean(user && allowedRoles.includes(user.role)); }
export function canAccessRoute(user: User | null, allowedRoles: UserRole[]): boolean { return hasRole(user, allowedRoles) && user?.status === 'active'; }
export function requireRole(user: User | null, allowedRoles: UserRole[]): void { if (!canAccessRoute(user, allowedRoles)) throw new Error('You do not have permission to access this route.'); }
