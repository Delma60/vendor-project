// apps/web-seller/app/layout.tsx
import type { Metadata } from 'next';
import { AuthGuard, Sidebar, ToastProvider, Topbar } from '@foodconnect/ui/components';
import './globals.css';
export const metadata: Metadata = { title: 'Seller Dashboard | FoodConnect', description: 'Manage your FoodConnect kitchen.' };
const navigation = [{ label: 'Overview', href: '/' }, { label: 'Onboarding', href: '/onboarding' }, { label: 'Menu', href: '/menu' }, { label: 'Orders', href: '/orders' }, { label: 'Earnings', href: '/earnings' }, { label: 'Reviews', href: '/reviews' }, { label: 'Growth', href: '/gamification' }, { label: 'B2B queue', href: '/b2b-orders' }];
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><ToastProvider><div className="app-shell"><div className="dashboard-layout"><Sidebar items={navigation} /><div className="main-content"><Topbar title="Seller dashboard" userName="Seller account" /><AuthGuard allowedRoles={['seller']}>{children}</AuthGuard></div></div></div></ToastProvider></body></html>; }
