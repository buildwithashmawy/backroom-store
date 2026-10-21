import Link from 'next/link';
import { ProductImage } from '../ProductArt';
import { Badge } from '../ui';
import { formatEGP } from '@/lib/pricing';
import type { StoreProduct } from '@/lib/products';

export function ProductCard({ product, index = 0 }: { product: StoreProduct; index?: number }) {
  const canBuy = product.buyPrice != null;
  const canRent = product.rentPricePerDay != null;
  const soldOut = canBuy && !canRent && product.stock <= 0;
  return (
    <Link
      href={`/products/${product.slug}`}
      className="animate-rise group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="relative aspect-[16/15] overflow-hidden rounded-lg bg-surface">
        <div className="h-full w-full transition duration-500 ease-out-soft group-hover:scale-[1.04]">
          <ProductImage product={product} />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {canRent && <Badge tone="cyan">Rent</Badge>}
          {canBuy && <Badge tone={soldOut ? 'red' : 'green'}>{soldOut ? 'Sold out' : 'Buy'}</Badge>}
        </div>
      </div>
      <div className="mt-3 px-0.5">
        <p className="text-xs font-medium text-fg-muted">{product.brand}</p>
        <h3 className="mt-0.5 font-semibold leading-snug transition group-hover:text-accent">{product.name}</h3>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
          {canBuy && <span className="font-semibold">{formatEGP(product.buyPrice!)}</span>}
          {canRent && (
            <span className="text-fg-secondary">
              {canBuy ? 'or rent ' : 'Rent from '}
              <span className="font-semibold text-fg">{formatEGP(product.rentPricePerDay!)}</span>/day
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
