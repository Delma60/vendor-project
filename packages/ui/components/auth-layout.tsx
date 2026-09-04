import type { ReactNode } from 'react';

export interface AuthLayoutProps {
	eyebrow?: string;
	title: string;
	description?: string;
	brand?: string;
	tagline?: string;
	highlights?: string[];
	children: ReactNode;
}

export function AuthLayout({ eyebrow, title, description, brand = 'FoodConnect', tagline, highlights, children }: AuthLayoutProps) {
	return (
		<main className="auth-shell">
			<section className="auth-panel-brand">
				<div className="auth-panel-brand-content">
					<strong className="auth-brand-mark">{brand}</strong>
					{tagline && <p className="auth-tagline">{tagline}</p>}
					{highlights && highlights.length > 0 && (
						<ul className="auth-highlights">
							{highlights.map(item => <li key={item}>{item}</li>)}
						</ul>
					)}
				</div>
			</section>
			<section className="auth-panel-form">
				<div className="auth-panel-form-content">
					{eyebrow && <p className="eyebrow">{eyebrow}</p>}
					<h1 className="auth-title">{title}</h1>
					{description && <p className="auth-description">{description}</p>}
					{children}
				</div>
			</section>
		</main>
	);
}