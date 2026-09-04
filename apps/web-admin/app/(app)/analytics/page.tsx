// apps/web-admin/app/analytics/page.tsx
import { Card, Chart } from '@foodconnect/ui/components';
export default function AnalyticsPage() { return <div className="content-grid"><Chart title="Growth analytics" description="GMV, DAU/WAU/MAU, retention, and loyalty redemption" /><Card title="Export reports"><p className="muted">CSV exports can be generated for each selected reporting period.</p></Card></div>; }
