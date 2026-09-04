import type { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className = '', children, ...props }: SelectProps) {
  return <select className={`input select ${className}`.trim()} {...props}>{children}</select>;
}