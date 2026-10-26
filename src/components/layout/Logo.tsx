import Link from 'next/link';
import { site } from '@/lib/site';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`} aria-label={`${site.storeName} home`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src="/brand/logo-lockup.svg" 
        alt="BackRoom" 
        width={230}
        height={31}
        className="h-[31px] w-[230px]"
      />
    </Link>
  );
}
