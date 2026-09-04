// packages/ui/components/card.tsx
import type { HTMLAttributes } from 'react';
export interface CardProps extends HTMLAttributes<HTMLElement> { title?: string; description?: string; }
export function Card({ title, description, children, className = '', ...props }: CardProps) { return <section className={`card ${className}`.trim()} {...props}>{(title || description) && <header className="card-header">{title && <h2>{title}</h2>}{description && <p>{description}</p>}</header>}{children}</section>; }
