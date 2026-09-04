// apps/web-seller/app/onboarding/page.tsx
import { Card } from '@foodconnect/ui/components';
export default function SellerOnboardingPage() { return <Card title="Business onboarding" description="Complete each step to submit your seller profile for approval."><div className="content-grid">{['Business information', 'Category and location', 'Operating hours', 'Verification documents', 'Bank payout details'].map((step, index) => <div className="card" key={step}><p className="muted">Step {index + 1}</p><h2>{step}</h2><p className="muted">Ready to review</p></div>)}</div></Card>; }
