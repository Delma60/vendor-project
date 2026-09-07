'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ErrorState } from '@foodconnect/ui/components';
import { isPermissionError } from '@foodconnect/shared-utils';

export default function AppSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Seller app error boundary caught:', error); }, [error]);
  const permissionIssue = isPermissionError(error);

  return (
    <main className="loading-state">
      <ErrorState
        title={permissionIssue ? "You don't have access to this" : 'Something went wrong'}
        message={permissionIssue ? "Your account doesn't have permission to view this page. If you just signed in, try refreshing, otherwise contact support." : 'This page ran into a problem loading. You can try again or head back to your dashboard.'}
        onRetry={reset}
        action={<Link className="btn btn-ghost" href="/">Back to dashboard</Link>}
      />
    </main>
  );
}
