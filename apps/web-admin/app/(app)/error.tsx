'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ErrorState } from '@foodconnect/ui/components';
import { isPermissionError } from '@foodconnect/shared-utils';

export default function AppSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Admin app error boundary caught:', error); }, [error]);
  const permissionIssue = isPermissionError(error);
  return <main className="loading-state"><ErrorState title={permissionIssue ? "You don't have access to this" : 'Something went wrong'} message={permissionIssue ? "Your admin role doesn't have permission to view this page. If this seems wrong, check your role assignment or contact support." : 'This page ran into a problem loading. You can try again or head back to the overview.'} onRetry={reset} action={<Link className="btn btn-ghost" href="/">Back to overview</Link>} /></main>;
}
