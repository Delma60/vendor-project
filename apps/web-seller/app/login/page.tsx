'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, Button, Card, Field, Input } from '@foodconnect/ui/components';
import { signInWithEmail, signOutUser } from '@foodconnect/firebase';
import { getUserProfile, useCurrentUser } from '@foodconnect/shared-utils';

function mapAuthError(err: unknown): string {
	const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : '';
	if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Incorrect email or password.';
	if (code === 'auth/too-many-requests') return 'Too many attempts. Try again in a few minutes.';
	if (code === 'auth/invalid-email') return 'Enter a valid email address.';
	return 'Something went wrong signing in. Please try again.';
}

export default function LoginPage() {
	const router = useRouter();
	const { user, loading: userLoading } = useCurrentUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (userLoading || !user || user.role !== 'seller') return;
		if (user.status === 'active') router.replace('/');
		if (user.status === 'pending') router.replace('/pending-approval');
	}, [router, user, userLoading]);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setSubmitting(true);
		setError(null);
		try {
			const credential = await signInWithEmail(email, password);
			const profile = await getUserProfile(credential.user.uid);
			if (!profile || profile.role !== 'seller') {
				await signOutUser();
				setError('This sign-in is for seller accounts only.');
				return;
			}
			if (profile.status === 'suspended' || profile.status === 'banned') {
				await signOutUser();
				setError('Your account is not active. Contact support for help.');
				return;
			}
			if (profile.status === 'pending') {
				router.push('/pending-approval');
				return;
			}
			router.push('/');
		}
		catch (err) { setError(mapAuthError(err)); }
		finally { setSubmitting(false); }
	}

	return <main className="loading-state"><Card title="Seller sign in" description="Use your FoodConnect seller account to continue."><form className="auth-form" onSubmit={handleSubmit}><Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></Field><Field label="Password" htmlFor="password"><Input id="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required /></Field>{error && <Alert tone="error">{error}</Alert>}<div className="topbar-actions"><Button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</Button><Link className="btn btn-ghost" href="/forgot-password">Forgot password?</Link></div></form></Card></main>;
}
