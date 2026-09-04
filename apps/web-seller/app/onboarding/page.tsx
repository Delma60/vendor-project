'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard, Button, Card, Field, FileUpload, Input, Select, Stepper, Textarea, ToastProvider, useToast } from '@foodconnect/ui/components';
import { signOutUser, uploadFile } from '@foodconnect/firebase';
import { createSellerProfile, updateUserStatus, useCurrentUser } from '@foodconnect/shared-utils';
import type { BankAccountDetails, VerificationDocument } from '@foodconnect/shared-types';

const STEPS = ['Business info', 'Location', 'Operating hours', 'Documents', 'Bank details', 'Review'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const CATEGORIES = ['Local kitchen', 'Bakery', 'Restaurant', 'Cloud kitchen', 'Caterer'];

interface OperatingHoursDraft { opensAt: string; closesAt: string; closed: boolean; }
interface OnboardingForm {
	businessName: string;
	category: string;
	description: string;
	address: string;
	city: string;
	operatingHours: Record<string, OperatingHoursDraft>;
	documents: VerificationDocument[];
	bankDetails: BankAccountDetails;
}

const initialForm: OnboardingForm = {
	businessName: '', category: CATEGORIES[0], description: '', address: '', city: '',
	operatingHours: Object.fromEntries(DAYS.map(day => [day, { opensAt: '09:00', closesAt: '21:00', closed: false }])),
	documents: [], bankDetails: { bankName: '', accountNumber: '', accountName: '' },
};

function OnboardingWizard() {
	const router = useRouter();
	const { toast } = useToast();
	const [stepIndex, setStepIndex] = useState(0);
	const { user } = useCurrentUser();
	const [submitting, setSubmitting] = useState(false);
	const [form, setForm] = useState<OnboardingForm>(initialForm);
	const [documentFiles, setDocumentFiles] = useState<Record<string, File>>({});
	const isLastStep = stepIndex === STEPS.length - 1;
	const updateField = <K extends keyof OnboardingForm>(key: K, value: OnboardingForm[K]) => setForm(current => ({ ...current, [key]: value }));
	const updateHours = (day: string, patch: Partial<OperatingHoursDraft>) => setForm(current => ({ ...current, operatingHours: { ...current.operatingHours, [day]: { ...current.operatingHours[day], ...patch } } }));
	const handleDocumentSelected = (label: string) => (file: File | null) => { setDocumentFiles(current => { const next = { ...current }; if (file) next[label] = file; else delete next[label]; return next; }); setForm(current => ({ ...current, documents: [...current.documents.filter(document => document.label !== label), ...(file ? [{ id: crypto.randomUUID(), label, fileName: file.name, uploadedAt: new Date().toISOString() }] : [])] })); };
	async function handleSubmit() {
		if (!user) { toast({ title: 'Sign in required', message: 'Please sign in again to submit your application.', tone: 'error' }); router.push('/login'); return; }
		setSubmitting(true);
		try {
			const uploadedDocuments = await Promise.all(form.documents.map(async document => { const file = documentFiles[document.label]; if (!file) return document; const url = await uploadFile(`sellers/${user.id}/documents/${document.label.replace(/\s+/g, '-').toLowerCase()}-${file.name}`, file); return { ...document, url }; }));
			await createSellerProfile({ id: user.id, ownerId: user.id, businessName: form.businessName, category: form.category, description: form.description, address: `${form.address}${form.city ? `, ${form.city}` : ''}`, operatingHours: form.operatingHours, verificationStatus: 'pending', rating: 0, totalOrders: 0, isCookingToday: false, bankDetails: form.bankDetails, documents: uploadedDocuments });
			await updateUserStatus(user.id, 'pending'); toast({ title: 'Application submitted', message: 'Your seller profile is pending admin approval.', tone: 'success' }); router.push('/pending-approval');
		} catch (err) { toast({ title: 'Submission failed', message: err instanceof Error ? err.message : 'Please try again.', tone: 'error' }); } finally { setSubmitting(false); }
	}
	const goNext = () => (isLastStep ? handleSubmit() : setStepIndex(index => Math.min(index + 1, STEPS.length - 1)));
	const goBack = () => setStepIndex(index => Math.max(index - 1, 0));

	return <Card title="Business onboarding" description="Complete each step to submit your seller profile for approval.">
		<Stepper steps={STEPS} currentStep={stepIndex} />
		<div className="onboarding-step">
			{stepIndex === 0 && <div className="field-grid"><Field label="Business name" htmlFor="businessName" required><Input id="businessName" value={form.businessName} onChange={event => updateField('businessName', event.target.value)} placeholder="e.g. Amara's Kitchen" /></Field><Field label="Category" htmlFor="category" required><Select id="category" value={form.category} onChange={event => updateField('category', event.target.value)}>{CATEGORIES.map(category => <option key={category} value={category}>{category}</option>)}</Select></Field><Field label="Description" htmlFor="description" hint="A short description customers will see on your profile."><Textarea id="description" rows={4} value={form.description} onChange={event => updateField('description', event.target.value)} placeholder="Tell customers what makes your kitchen special" /></Field></div>}
			{stepIndex === 1 && <div className="field-grid"><Field label="Street address" htmlFor="address" required><Input id="address" value={form.address} onChange={event => updateField('address', event.target.value)} placeholder="12 Admiralty Way" /></Field><Field label="City" htmlFor="city" required><Input id="city" value={form.city} onChange={event => updateField('city', event.target.value)} placeholder="Lagos" /></Field></div>}
			{stepIndex === 2 && <div className="hours-grid">{DAYS.map(day => { const hours = form.operatingHours[day]; return <div className="hours-row" key={day}><span className="hours-day">{day}</span><label className="hours-closed-toggle"><input type="checkbox" checked={hours.closed} onChange={event => updateHours(day, { closed: event.target.checked })} /> Closed</label><Input type="time" value={hours.opensAt} disabled={hours.closed} onChange={event => updateHours(day, { opensAt: event.target.value })} /><span className="hours-separator">to</span><Input type="time" value={hours.closesAt} disabled={hours.closed} onChange={event => updateHours(day, { closesAt: event.target.value })} /></div>; })}</div>}
			{stepIndex === 3 && <div className="field-grid"><FileUpload label="Government-issued ID" hint="JPG, PNG, or PDF up to 10MB" accept="image/*,.pdf" onFileSelected={handleDocumentSelected('Government-issued ID')} /><FileUpload label="Business registration certificate" hint="JPG, PNG, or PDF up to 10MB" accept="image/*,.pdf" onFileSelected={handleDocumentSelected('Business registration certificate')} /><FileUpload label="Health/safety permit" hint="Optional - required for some categories" accept="image/*,.pdf" onFileSelected={handleDocumentSelected('Health/safety permit')} /></div>}
			{stepIndex === 4 && <div className="field-grid"><Field label="Bank name" htmlFor="bankName" required><Input id="bankName" value={form.bankDetails.bankName} onChange={event => updateField('bankDetails', { ...form.bankDetails, bankName: event.target.value })} placeholder="GTBank" /></Field><Field label="Account number" htmlFor="accountNumber" required><Input id="accountNumber" value={form.bankDetails.accountNumber} onChange={event => updateField('bankDetails', { ...form.bankDetails, accountNumber: event.target.value })} placeholder="0123456789" inputMode="numeric" /></Field><Field label="Account name" htmlFor="accountName" required hint="Must match the name on your registration documents."><Input id="accountName" value={form.bankDetails.accountName} onChange={event => updateField('bankDetails', { ...form.bankDetails, accountName: event.target.value })} placeholder="Amara's Kitchen Ltd" /></Field></div>}
			{stepIndex === 5 && <div className="review-grid"><div className="card"><p className="muted">Business</p><h2>{form.businessName || 'Untitled business'}</h2><p className="muted">{form.category} · {form.address}{form.city ? `, ${form.city}` : ''}</p></div><div className="card"><p className="muted">Documents</p><p>{form.documents.length} of 3 uploaded</p></div><div className="card"><p className="muted">Payout account</p><p>{form.bankDetails.bankName || 'Not set'} · {form.bankDetails.accountNumber || '-'}</p></div></div>}
		</div>
		<div className="onboarding-actions"><Button variant="ghost" onClick={goBack} disabled={stepIndex === 0 || submitting}>Back</Button><Button onClick={goNext} disabled={submitting}>{submitting ? 'Submitting...' : isLastStep ? 'Submit for approval' : 'Continue'}</Button></div>
	</Card>;
}

function OnboardingHeader() { const router = useRouter(); return <header className="onboarding-header"><strong>FoodConnect</strong><Button variant="ghost" onClick={async () => { await signOutUser(); router.push('/login'); }}>Save & exit</Button></header>; }

export default function SellerOnboardingPage() { return <ToastProvider><AuthGuard allowedRoles={['seller']} allowedStatuses={['incomplete', 'pending']}><main className="onboarding-page-shell"><div className="onboarding-page-shell-inner"><OnboardingHeader /><OnboardingWizard /></div></main></AuthGuard></ToastProvider>; }