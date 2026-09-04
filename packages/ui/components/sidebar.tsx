// packages/ui/components/sidebar.tsx
import type { ReactNode } from 'react';
export interface SidebarItem { label: string; href: string; icon?: ReactNode; }
export interface SidebarProps { items: SidebarItem[]; activeHref?: string; brand?: string; }
export function Sidebar({ items, activeHref, brand = 'FoodConnect' }: SidebarProps) { return <aside className="sidebar"><strong className="sidebar-brand">{brand}</strong><nav aria-label="Primary navigation">{items.map(item => <a className={item.href === activeHref ? 'nav-item is-active' : 'nav-item'} href={item.href} key={item.href}>{item.icon}<span>{item.label}</span></a>)}</nav></aside>; }
