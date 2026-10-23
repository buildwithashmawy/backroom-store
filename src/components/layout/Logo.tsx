import Link from 'next/link';
import { site } from '@/lib/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label={`${site.storeName} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo.svg" alt="" width={36} height={19} className="h-[19px] w-9" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/wordmark.svg" alt="BackRoom" width={91} height={11} className="h-[11px] w-[91px]" />
    </Link>
  );
}
