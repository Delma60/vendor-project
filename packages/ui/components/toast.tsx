// packages/ui/components/toast.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
export interface ToastMessage { id: string; title: string; message?: string; tone?: 'info' | 'success' | 'error'; }
interface ToastContextValue { toast: (message: Omit<ToastMessage, 'id'>) => void; }
const ToastContext = createContext<ToastContextValue | null>(null);
export function ToastProvider({ children }: { children: ReactNode }) { const [messages, setMessages] = useState<ToastMessage[]>([]); const toast = (message: Omit<ToastMessage, 'id'>) => { const id = crypto.randomUUID(); setMessages(current => [...current, { ...message, id }]); window.setTimeout(() => setMessages(current => current.filter(item => item.id !== id)), 5000); }; return <ToastContext.Provider value={{ toast }}>{children}<div className="toast-region" aria-live="polite">{messages.map(message => <div className={`toast toast-${message.tone ?? 'info'}`} key={message.id}><strong>{message.title}</strong>{message.message && <p>{message.message}</p>}</div>)}</div></ToastContext.Provider>; }
export function useToast() { const context = useContext(ToastContext); if (!context) throw new Error('useToast must be used inside ToastProvider'); return context; }
