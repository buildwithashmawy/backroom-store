import Link from 'next/link';
import type { ComponentProps } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200 ease-out-soft active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';
const variants: Record<Variant, string> = {
  primary: 'bg-action text-on-action hover:bg-white',
  secondary: 'bg-muted text-fg hover:bg-[#3d3d3d]',
  ghost: 'border border-line text-fg hover:border-on-dark hover:bg-surface',
};
const sizes = { md: 'h-12 px-5 text-[15px]', sm: 'h-10 px-4 text-sm', lg: 'h-14 px-7 text-base' };

export function buttonClass(variant: Variant = 'primary', size: keyof typeof sizes = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof sizes }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

const badgeTones = {
  neutral: 'bg-[#303030] text-white border-white/70',
  green: 'bg-badge-green-fill text-badge-green border-badge-green',
  amber: 'bg-badge-amber-fill text-badge-amber border-badge-amber',
  cyan: 'bg-badge-cyan-fill text-badge-cyan border-badge-cyan',
  red: 'bg-badge-red-fill text-badge-red border-badge-red',
};

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof badgeTones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-[6px] border px-2 py-0.5 text-[11px] font-medium ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function Container({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props} />;
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: React.ReactNode }) {
  return (
    <div className="animate-rise border-b border-line-subtle pb-10 pt-12 sm:pt-16">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent">{eyebrow}</p>}
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      {intro && <div className="mt-4 max-w-2xl text-base text-fg-secondary sm:text-lg">{intro}</div>}
    </div>
  );
}
