import type { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className = '', ...props }: TextareaProps) {
  return <textarea className={`input textarea ${className}`.trim()} {...props} />;
}