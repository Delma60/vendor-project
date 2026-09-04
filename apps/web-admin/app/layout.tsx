// apps/web-admin/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeScript } from '@foodconnect/ui/components';
import './globals.css';
export const metadata: Metadata = { title: 'Admin Dashboard | FoodConnect', description: 'FoodConnect platform operations.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><ThemeScript /></head><body>{children}</body></html>; }
