import type { LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> { required?: boolean; }

export function Label({ children, required, className = '', ...props }: LabelProps) {
  return <label className={`field-label ${className}`.trim()} {...props}>{children}{required && <span className="field-required" aria-hidden="true"> *</span>}</label>;
}