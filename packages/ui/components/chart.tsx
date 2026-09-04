// packages/ui/components/chart.tsx
import type { ReactNode } from 'react';
export interface ChartProps { title: string; description?: string; children?: ReactNode; }
export function Chart({ title, description, children }: ChartProps) { return <section className="chart" aria-label={title}><div className="chart-heading"><h2>{title}</h2>{description && <p>{description}</p>}</div><div className="chart-body">{children ?? <div className="chart-placeholder">No data available</div>}</div></section>; }
