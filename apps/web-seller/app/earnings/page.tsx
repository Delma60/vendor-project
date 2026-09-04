// apps/web-seller/app/earnings/page.tsx
import { Card, Chart } from '@foodconnect/ui/components';
export default function EarningsPage() { return <><div className="content-grid"><Chart title="Earnings" description="Daily, weekly, and monthly payout performance" /><Card title="Fee transparency"><p className="muted">Commission and processing fees are shown per order before payout.</p></Card></div><Card title="Payout history"><p className="muted">No payouts recorded yet.</p></Card></>; }
