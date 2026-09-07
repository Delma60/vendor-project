import type { ReactNode } from 'react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
}

export function ErrorState({ title = 'Something went wrong', message = 'We hit a snag loading this page. Please try again.', onRetry, retryLabel = 'Try again', action }: ErrorStateProps) {
  return (
    <div className="error-state">
      <span className="error-state-icon" aria-hidden="true">!</span>
      <h2>{title}</h2>
      <p className="muted">{message}</p>
      <div className="error-state-actions">
        {onRetry && <Button onClick={onRetry}>{retryLabel}</Button>}
        {action}
      </div>
    </div>
  );
}
