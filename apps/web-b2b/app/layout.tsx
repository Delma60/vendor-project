// apps/web-b2b/app/layout.tsx
import type { Metadata } from 'next';
import { ThemeScript } from '@foodconnect/ui/components';
import './globals.css';
export const metadata: Metadata = { metadataBase: new URL('https://foodconnect.example'), title: { default: 'FoodConnect for Business', template: '%s | FoodConnect' }, description: 'Reliable bulk meals and delivery for growing teams.', openGraph: { title: 'FoodConnect for Business', description: 'Reliable bulk meals and delivery for growing teams.', type: 'website' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><head><ThemeScript /></head><body>{children}</body></html>; }
