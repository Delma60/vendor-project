// packages/ui/components/auth-guard.tsx
'use client';
import { useEffect, type ReactNode } from 'react';
import type { UserRole } from '@foodconnect/shared-types';
import { canAccessRoute, useCurrentUser } from '@foodconnect/shared-utils';
export interface AuthGuardProps { allowedRoles: UserRole[]; children: ReactNode; loginPath?: string; }
export function AuthGuard({ allowedRoles, children, loginPath = '/login' }: AuthGuardProps) { const { user, loading } = useCurrentUser(); useEffect(() => { if (!loading && !canAccessRoute(user, allowedRoles)) window.location.assign(loginPath); }, [allowedRoles, loading, loginPath, user]); if (loading || !canAccessRoute(user, allowedRoles)) return <main className="loading-state">Checking access...</main>; return <>{children}</>; }
