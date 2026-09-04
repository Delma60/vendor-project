// apps/web-b2b/app/login/page.tsx
import Link from 'next/link';
import { Card } from '@foodconnect/ui/components';
export default function LoginPage() { return <main className="public-shell"><section className="public-content"><Card title="Company portal sign in" description="Use your FoodConnect Business account to continue."><p className="muted">Authentication is ready to connect to your Firebase provider.</p><div className="topbar-actions"><Link className="btn btn-primary" href="/verify">Continue to verification</Link><Link className="btn btn-ghost" href="/forgot-password">Forgot password?</Link></div></Card></section></main>; }
