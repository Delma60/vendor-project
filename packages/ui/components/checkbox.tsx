import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label: ReactNode;
}

export function Checkbox({ label, id, className = '', ...props }: CheckboxProps) {
	return (
		<label className="checkbox" htmlFor={id}>
			<input className={`checkbox-input ${className}`.trim()} id={id} type="checkbox" {...props} />
			<span className="checkbox-label">{label}</span>
		</label>
	);
}