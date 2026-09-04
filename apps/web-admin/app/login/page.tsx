'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Field, Input } from '@foodconnect/ui/components';
import { signInWithEmail } from '@foodconnect/firebase';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	async function handleSubmit(event: FormEvent) { event.preventDefault(); setSubmitting(true); setError(null); try { await signInWithEmail(email, password); router.push('/'); } catch (err) { setError(err instanceof Error ? err.message : 'Check your email and password.'); } finally { setSubmitting(false); } }
	return <main className="loading-state"><Card title="Admin sign in" description="Use your FoodConnect operations account to continue."><form className="auth-form" onSubmit={handleSubmit}><Field label="Email" htmlFor="email"><Input id="email" type="email" value={email} onChange={event => setEmail(event.target.value)} required /></Field><Field label="Password" htmlFor="password" error={error ?? undefined}><Input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)} required /></Field><div className="topbar-actions"><Button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</Button><Link className="btn btn-ghost" href="/forgot-password">Forgot password?</Link></div></form></Card></main>;
}
