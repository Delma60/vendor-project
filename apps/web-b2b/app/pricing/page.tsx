// apps/web-b2b/app/pricing/page.tsx
import { Card } from '@foodconnect/ui/components';
export const metadata = { title: 'Bulk pricing' };
export default function PricingPage() { return <main className="public-shell"><nav className="public-nav"><strong className="brand">FoodConnect Business</strong></nav><section className="public-content"><h1>Pricing built around volume</h1><div className="content-grid"><Card title="Starter teams"><p className="muted">Flexible prepay ordering with volume pricing from your first order.</p></Card><Card title="Growing companies"><p className="muted">Saved templates, multiple locations, and approval workflows.</p></Card><Card title="Enterprise"><p className="muted">Net-30 terms, reporting, and dedicated account support.</p></Card></div></section></main>; }
