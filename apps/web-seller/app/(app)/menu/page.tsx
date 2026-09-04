// apps/web-seller/app/menu/page.tsx
import { Button, Card } from '@foodconnect/ui/components';
export default function MenuPage() { return <Card title="Menu management" description="Keep availability, prices, photos, and cooking status current."><div className="topbar-actions"><Button>Add menu item</Button><Button variant="secondary">Upload photos</Button></div><p className="muted">Your menu items will appear here once added.</p></Card>; }
