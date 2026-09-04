// packages/ui/components/auth-guard.tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import type { User, UserRole } from '@foodconnect/shared-types';
import { canAccessRoute, getCurrentUser } from '@foodconnect/shared-utils';
export interface AuthGuardProps { allowedRoles: UserRole[]; children: ReactNode; loginPath?: string; }
export function AuthGuard({ allowedRoles, children, loginPath = '/login' }: AuthGuardProps) { const [user, setUser] = useState<User | null | undefined>(undefined); useEffect(() => setUser(getCurrentUser()), []); useEffect(() => { if (user !== undefined && !canAccessRoute(user, allowedRoles)) window.location.assign(loginPath); }, [allowedRoles, loginPath, user]); if (user === undefined || !canAccessRoute(user, allowedRoles)) return <main className="loading-state">Checking access...</main>; return <>{children}</>; }
