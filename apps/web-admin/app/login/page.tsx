// apps/web-admin/app/login/page.tsx
import Link from 'next/link';
import { Card } from '@foodconnect/ui/components';
export default function LoginPage() { return <main className="loading-state"><Card title="Admin sign in" description="Use your FoodConnect operations account to continue."><p className="muted">Authentication is ready to connect to your Firebase provider.</p><div className="topbar-actions"><Link className="btn btn-primary" href="/verify">Continue to verification</Link><Link className="btn btn-ghost" href="/forgot-password">Forgot password?</Link></div></Card></main>; }
