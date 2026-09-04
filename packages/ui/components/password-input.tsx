'use client';
import { forwardRef, useState, type InputHTMLAttributes } from 'react';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
	{ className = '', ...props },
	ref
) {
	const [visible, setVisible] = useState(false);
	return (
		<div className="password-input">
			<input ref={ref} type={visible ? 'text' : 'password'} className={`input ${className}`.trim()} {...props} />
			<button
				type="button"
				className="password-input-toggle"
				onClick={() => setVisible(current => !current)}
				aria-label={visible ? 'Hide password' : 'Show password'}
				tabIndex={-1}
			>
				{visible ? '🙈' : '👁'}
			</button>
		</div>
	);
});