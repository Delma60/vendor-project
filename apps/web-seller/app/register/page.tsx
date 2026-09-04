'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, Card, Checkbox, Field, Input, PasswordInput } from '@foodconnect/ui/components';
import { createUserProfile, signUpWithEmail } from '@foodconnect/firebase';

function mapSignUpError(err: unknown): string {
	const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : '';
	if (code === 'auth/email-already-in-use') return 'An account with this email already exists.';
	if (code === 'auth/invalid-email') return 'Enter a valid email address.';
	if (code === 'auth/weak-password') return 'Choose a password with at least 6 characters.';
	return 'Something went wrong creating your account. Please try again.';
}

export default function RegisterPage() {
	const router = useRouter();
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event: FormEvent) {
		event.preventDefault();
		setError(null);
		if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
		if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
		if (!agreedToTerms) { setError('You must agree to the terms to continue.'); return; }
		setSubmitting(true);
		try {
			const credential = await signUpWithEmail(email, password, fullName);
			await createUserProfile({ uid: credential.user.uid, email, displayName: fullName, role: 'seller', status: 'pending' });
			router.push('/onboarding');
		} catch (err) { setError(mapSignUpError(err)); } finally { setSubmitting(false); }
	}

	return <main className="loading-state"><Card title="Create your seller account" description="Set up your login, then tell us about your kitchen."><form className="auth-form" onSubmit={handleSubmit}><Field label="Full name" htmlFor="fullName" required><Input id="fullName" autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} required /></Field><Field label="Business email" htmlFor="email" required><Input id="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></Field><Field label="Password" htmlFor="password" required hint="At least 6 characters."><PasswordInput id="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} required /></Field><Field label="Confirm password" htmlFor="confirmPassword" required><PasswordInput id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required /></Field><Checkbox id="terms" checked={agreedToTerms} onChange={event => setAgreedToTerms(event.target.checked)} label="I agree to the FoodConnect seller terms and privacy policy." />{error && <Alert tone="error">{error}</Alert>}<div className="topbar-actions"><Button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</Button><Link className="btn btn-ghost" href="/login">Already have an account?</Link></div></form></Card></main>;
}