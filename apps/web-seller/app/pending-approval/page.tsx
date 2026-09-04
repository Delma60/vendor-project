import Link from 'next/link';
import { Card } from '@foodconnect/ui/components';

export default function PendingApprovalPage() {
	return <main className="loading-state"><Card title="Your application is under review" description="We're checking your business details and documents."><p className="muted">This usually takes 1-2 business days. We'll email you once you're approved.</p><Link className="btn btn-ghost" href="/login">Back to sign in</Link></Card></main>;
}