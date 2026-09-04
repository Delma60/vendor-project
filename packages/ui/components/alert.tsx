import type { ReactNode } from 'react';

export interface AlertProps {
  tone?: 'info' | 'success' | 'error' | 'warning';
  title?: string;
  children?: ReactNode;
}

export function Alert({ tone = 'info', title, children }: AlertProps) {
  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <strong className="alert-title">{title}</strong>}
      {children && <p className="alert-message">{children}</p>}
    </div>
  );
}