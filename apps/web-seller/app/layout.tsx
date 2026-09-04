// apps/web-seller/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeScript } from '@foodconnect/ui/components';
import './globals.css';
export const metadata: Metadata = { title: 'Seller Dashboard | FoodConnect', description: 'Manage your FoodConnect kitchen.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><ThemeScript /></head><body>{children}</body></html>; }
