'use client';

import { useEffect, type ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Dialog({ open, onClose, title, description, children, size = 'md' }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dialog-overlay" role="presentation" onClick={onClose}>
      <div className={`dialog-panel dialog-panel-${size}`} role="dialog" aria-modal="true" aria-label={title} onClick={event => event.stopPropagation()}>
        <header className="dialog-header">
          <div><h2>{title}</h2>{description && <p className="muted">{description}</p>}</div>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Close dialog">X</button>
        </header>
        <div className="dialog-body">{children}</div>
      </div>
    </div>
  );
}