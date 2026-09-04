'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AuthLayout, Button, Field, Input, PasswordInput } from '@foodconnect/ui/components';
import { createUserProfile, signUpWithEmail } from '@foodconnect/firebase';

function mapSignupError(err: unknown): string {
	const code = err instanceof Error && 'code' in err ? String((err as { code: string }).code) : '';
	if (code === 'auth/email-already-in-use') return 'An account already exists with this email.';
	if (code === 'auth/invalid-email') return 'Enter a valid email address.';
	if (code === 'auth/weak-password') return 'Choose a password with at least 6 characters.';
	return 'Something went wrong creating your account. Please try again.';
}

export default function SignupPage() {
	const router = useRouter();
	const [fullName, setFullName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [agreed, setAgreed] = useState(false); const [error, setError] = useState<string | null>(null); const [submitting, setSubmitting] = useState(false);
	async function handleSubmit(event: FormEvent) {
		event.preventDefault(); setError(null);
		if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
		if (!agreed) { setError('You must accept the seller terms to continue.'); return; }
		setSubmitting(true);
		try { const credential = await signUpWithEmail(email, password, fullName); await createUserProfile({ uid: credential.user.uid, email, displayName: fullName, role: 'seller', status: 'incomplete' }); router.push('/onboarding'); } catch (err) { setError(mapSignupError(err)); } finally { setSubmitting(false); }
	}
	return <AuthLayout eyebrow="Seller workspace" title="Create your seller account" description="Set up your login, then tell us about your kitchen." brand="FoodConnect" tagline="Everything your kitchen needs, in one place." highlights={['Track live orders in real time', 'Manage payouts and earnings clearly', 'Grow with badges and visibility boosts']}><form className="auth-form" onSubmit={handleSubmit} noValidate><Field label="Full name" htmlFor="fullName"><Input id="fullName" autoComplete="name" placeholder="Amara Okafor" value={fullName} onChange={event => setFullName(event.target.value)} required /></Field><Field label="Email" htmlFor="email"><Input id="email" type="email" autoComplete="email" placeholder="you@business.com" value={email} onChange={event => setEmail(event.target.value)} required /></Field><Field label="Password" htmlFor="password" hint="At least 6 characters."><PasswordInput id="password" autoComplete="new-password" placeholder="Create a password" value={password} onChange={event => setPassword(event.target.value)} required minLength={6} /></Field><Field label="Confirm password" htmlFor="confirmPassword"><PasswordInput id="confirmPassword" autoComplete="new-password" placeholder="Re-enter your password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required minLength={6} /></Field><label className="checkbox-field"><input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} /><span>I agree to the FoodConnect seller terms and payout policy.</span></label>{error && <Alert tone="error">{error}</Alert>}<Button type="submit" disabled={submitting} className="auth-submit">{submitting ? 'Creating account...' : 'Create account'}</Button><Link className="auth-secondary-link" href="/login">Already have an account? Sign in</Link></form></AuthLayout>;
}