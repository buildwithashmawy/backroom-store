import Link from 'next/link';
import { site } from '@/lib/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label={`${site.storeName} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" width={36} height={19} className="h-[19px] w-9" />
      <span className="text-lg font-extrabold tracking-tight">
        BackRoom<span className="ml-1.5 font-medium text-fg-muted">Store</span>
      </span>
    </Link>
  );
}
