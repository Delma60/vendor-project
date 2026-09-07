import type { MenuItem } from '@foodconnect/shared-types';
import { Button } from './button';
import { Switch } from './switch';

export interface MenuItemCardProps { item: MenuItem; onToggleAvailable: (available: boolean) => void; onEdit: () => void; onDelete: () => void; }

export function MenuItemCard({ item, onToggleAvailable, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <article className={`menu-item-card ${item.available ? '' : 'menu-item-card-unavailable'}`.trim()}>
      <div className="menu-item-photo">{item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <span className="menu-item-photo-placeholder" aria-hidden="true">Food</span>}{item.bulkCapable && <span className="menu-item-badge">Bulk-ready</span>}</div>
      <div className="menu-item-body"><div className="menu-item-heading"><h3>{item.name}</h3><span className="menu-item-price">{item.currency} {item.price.toLocaleString()}</span></div><p className="menu-item-category">{item.category}</p>{item.description && <p className="menu-item-description">{item.description}</p>}</div>
      <footer className="menu-item-footer"><label className="switch-row"><Switch checked={item.available} onCheckedChange={onToggleAvailable} /><span>{item.available ? 'Available' : 'Sold out today'}</span></label><div className="menu-item-actions"><Button variant="ghost" onClick={onEdit}>Edit</Button><Button variant="danger" onClick={onDelete}>Delete</Button></div></footer>
    </article>
  );
}