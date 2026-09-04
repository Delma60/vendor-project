// apps/web-admin/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Admin Dashboard | FoodConnect', description: 'FoodConnect platform operations.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
