// packages/ui/components/auth-guard.tsx
'use client';
import { useEffect, type ReactNode } from 'react';
import type { UserRole } from '@foodconnect/shared-types';
import { hasRole, useCurrentUser } from '@foodconnect/shared-utils';
export interface AuthGuardProps { allowedRoles: UserRole[]; children: ReactNode; loginPath?: string; pendingPath?: string; }
export function AuthGuard({ allowedRoles, children, loginPath = '/login', pendingPath = '/pending-approval' }: AuthGuardProps) {
	const { user, loading } = useCurrentUser();
	useEffect(() => {
		if (loading) return;
		if (!hasRole(user, allowedRoles)) { window.location.assign(loginPath); return; }
		if (user?.status === 'pending') { window.location.assign(pendingPath); return; }
		if (user?.status !== 'active') window.location.assign(loginPath);
	}, [allowedRoles, loading, loginPath, pendingPath, user]);
	const authorized = !loading && hasRole(user, allowedRoles) && user?.status === 'active';
	if (!authorized) return <main className="loading-state">Checking access...</main>;
	return <>{children}</>;
}
