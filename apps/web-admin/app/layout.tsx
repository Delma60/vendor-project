// apps/web-admin/app/layout.tsx
import type { Metadata } from 'next';
import { AuthGuard, Sidebar, ToastProvider, Topbar } from '@foodconnect/ui/components';
import './globals.css';
export const metadata: Metadata = { title: 'Admin Dashboard | FoodConnect', description: 'FoodConnect platform operations.' };
const navigation = [{ label: 'Overview', href: '/' }, { label: 'Sellers', href: '/sellers' }, { label: 'Users', href: '/users' }, { label: 'Orders', href: '/orders' }, { label: 'Financials', href: '/financials' }, { label: 'Promotions', href: '/promotions' }, { label: 'Moderation', href: '/moderation' }, { label: 'Analytics', href: '/analytics' }, { label: 'Permissions', href: '/permissions' }];
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><ToastProvider><div className="app-shell"><div className="dashboard-layout"><Sidebar items={navigation} brand="FoodConnect Admin" /><div className="main-content"><Topbar title="Admin workspace" userName="Admin account" /><AuthGuard allowedRoles={['admin']}>{children}</AuthGuard></div></div></div></ToastProvider></body></html>; }
