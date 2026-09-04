// packages/ui/components/button.tsx
import type { ButtonHTMLAttributes } from 'react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; }
export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) { return <button className={`btn btn-${variant} ${className}`.trim()} {...props} />; }
