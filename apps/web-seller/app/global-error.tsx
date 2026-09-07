'use client';

import { useEffect } from 'react';
import { Button } from '@foodconnect/ui/components';
import './globals.css';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Seller app root error:', error); }, [error]);
  return <html lang="en"><body><main className="loading-state"><div className="card"><h2>FoodConnect hit a snag</h2><p className="muted">Something went wrong loading the seller dashboard. Please try again.</p><div className="topbar-actions"><Button onClick={reset}>Try again</Button></div></div></main></body></html>;
}
