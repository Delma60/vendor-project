// apps/web-seller/app/forgot-password/page.tsx
'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Alert, Button, Card, Field, Input } from '@foodconnect/ui/components';
import { sendResetEmail } from '@foodconnect/firebase';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setStatus('submitting');
		try {
			await sendResetEmail(email);
			setStatus('sent');
		} catch {
			setStatus('error');
		}
	}

	return <main className="loading-state"><Card title="Reset your password" description="Enter your account email to receive a secure reset link.">{status === 'sent' ? <Alert tone="success" title="Check your inbox">We sent a password reset link to {email}.</Alert> : <form className="auth-form" onSubmit={handleSubmit}><Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></Field>{status === 'error' && <Alert tone="error">We couldn't send that email. Check the address and try again.</Alert>}<div className="topbar-actions"><Button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending...' : 'Send reset link'}</Button><Link className="btn btn-ghost" href="/login">Back to sign in</Link></div></form>}</Card></main>;
}
