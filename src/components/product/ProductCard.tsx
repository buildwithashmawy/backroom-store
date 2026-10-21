import Link from 'next/link';
import { ProductPhoto } from '../ProductPhoto';
import { formatEGP } from '@/lib/pricing';
import type { StoreProduct } from '@/lib/products';

export function ProductCard({ product }: { product: StoreProduct }) {
  const canBuy = product.buyPrice != null;
  const canRent = product.rentPricePerDay != null;
  const soldOut = canBuy && !canRent && product.stock <= 0;
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative">
        <ProductPhoto
          src={product.images[0]}
          alt={product.name}
          brand={product.brand}
          label={false}
          className="aspect-square rounded-md transition duration-300 group-hover:brightness-[0.96]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-black/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          {canRent && canBuy ? 'Rent · Buy' : canRent ? 'Rent' : soldOut ? 'Sold out' : 'Buy'}
        </span>
      </div>
      <div className="mt-3">
        <p className="text-[12px] text-fg-muted">{product.brand}</p>
        <h3 className="mt-0.5 text-[15px] font-semibold leading-snug group-hover:underline group-hover:decoration-line group-hover:underline-offset-4">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[14px] tabular-nums text-fg-secondary">
          {canRent && (
            <>
              <span className="font-semibold text-fg">{formatEGP(product.rentPricePerDay!)}</span> / day
            </>
          )}
          {canRent && canBuy && <span className="mx-1.5 text-fg-subtle">·</span>}
          {canBuy && (
            <>
              {canRent ? 'Buy ' : ''}
              <span className={canRent ? '' : 'font-semibold text-fg'}>{formatEGP(product.buyPrice!)}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
