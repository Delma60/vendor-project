'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ErrorState } from '@foodconnect/ui/components';
import { isPermissionError } from '@foodconnect/shared-utils';

export default function PortalSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('B2B portal error boundary caught:', error); }, [error]);
  const permissionIssue = isPermissionError(error);
  return <main className="loading-state"><ErrorState title={permissionIssue ? "You don't have access to this" : 'Something went wrong'} message={permissionIssue ? "Your account doesn't have permission to view this page. If you were just invited, try refreshing, otherwise contact your account admin." : 'This page ran into a problem loading. You can try again or head back to the portal overview.'} onRetry={reset} action={<Link className="btn btn-ghost" href="/portal">Back to portal</Link>} /></main>;
}
