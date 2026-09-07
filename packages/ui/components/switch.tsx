'use client';

import type { ButtonHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, disabled, className = '', ...props }: SwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)} className={`switch ${checked ? 'switch-checked' : ''} ${className}`.trim()} {...props}>
      <span className="switch-thumb" />
    </button>
  );
}