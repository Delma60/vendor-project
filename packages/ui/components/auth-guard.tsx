// packages/ui/components/auth-guard.tsx
'use client';
import { useEffect, type ReactNode } from 'react';
import type { AccountStatus, UserRole } from '@foodconnect/shared-types';
import { hasRole, useCurrentUser } from '@foodconnect/shared-utils';
export interface AuthGuardProps { allowedRoles: UserRole[]; allowedStatuses?: AccountStatus[]; children: ReactNode; loginPath?: string; pendingPath?: string; incompletePath?: string; }
export function AuthGuard({ allowedRoles, allowedStatuses = ['active'], children, loginPath = '/login', pendingPath = '/pending-approval', incompletePath = '/onboarding' }: AuthGuardProps) {
	const { user, loading } = useCurrentUser();
	useEffect(() => {
		if (loading) return;
		if (!hasRole(user, allowedRoles)) { window.location.assign(loginPath); return; }
		if (user?.status && allowedStatuses.includes(user.status)) return;
		if (user?.status === 'incomplete') { window.location.assign(incompletePath); return; }
		if (user?.status === 'pending') { window.location.assign(pendingPath); return; }
		window.location.assign(loginPath);
	}, [allowedRoles, allowedStatuses, incompletePath, loading, loginPath, pendingPath, user]);
	const authorized = !loading
		&& hasRole(user, allowedRoles)
		&& Boolean(user?.status && allowedStatuses.includes(user.status));
	if (!authorized) return <main className="loading-state">Checking access...</main>;
	return <>{children}</>;
}
