// apps/web-admin/app/financials/page.tsx
import { Card, Chart } from '@foodconnect/ui/components';
export default function FinancialsPage() { return <div className="content-grid"><Chart title="Platform revenue" description="Commission by seller, category, and time period" /><Card title="Payout operations"><p className="muted">Payout batches, B2B invoices, and promotion costs are reconciled here.</p></Card></div>; }
