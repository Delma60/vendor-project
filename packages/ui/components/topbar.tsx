// packages/ui/components/topbar.tsx
import type { ReactNode } from 'react';
export interface TopbarProps { title: string; actions?: ReactNode; userName?: string; }
export function Topbar({ title, actions, userName }: TopbarProps) { return <header className="topbar"><div><p className="eyebrow">FoodConnect workspace</p><h1>{title}</h1></div><div className="topbar-actions">{actions}<span className="user-chip">{userName ?? 'Account'}</span></div></header>; }
