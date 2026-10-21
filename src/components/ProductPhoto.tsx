// Product photography sits on a light studio tile, the way manufacturer
// cutouts are shot. multiply blends the photo's white backdrop into the tile.

export function ProductPhoto({
  src,
  alt,
  brand,
  className = '',
  padding = 'p-[8%]',
  priority,
  label = true,
}: {
  src?: string;
  alt: string;
  brand?: string;
  className?: string;
  padding?: string;
  priority?: boolean;
  label?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-tile ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`h-full w-full object-contain mix-blend-multiply ${padding}`}
        />
      ) : !label ? null : (
        <div className="flex h-full w-full flex-col justify-end p-4 text-on-tile">
          {brand && <span className="text-[11px] font-semibold uppercase tracking-wider opacity-60">{brand}</span>}
          <span className="text-sm font-semibold leading-tight">{alt}</span>
        </div>
      )}
    </div>
  );
}
