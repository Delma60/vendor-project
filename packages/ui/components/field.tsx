import type { ReactNode } from 'react';
import { Label } from './label';

export interface FieldProps { label: string; htmlFor: string; required?: boolean; hint?: string; error?: string; children: ReactNode; }

export function Field({ label, htmlFor, required, hint, error, children }: FieldProps) {
  return <div className="field"><Label htmlFor={htmlFor} required={required}>{label}</Label>{children}{error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}</div>;
}