'use client';

import { useState } from 'react';
import { ProductPhoto } from '../ProductPhoto';

export function Gallery({ images, name, brand }: { images: string[]; name: string; brand: string }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <ProductPhoto
        src={images[active]}
        alt={name}
        brand={brand}
        priority
        padding="p-[9%]"
        className="aspect-[4/3.4] rounded-lg"
      />
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Photo ${i + 1}`}
              className={`w-20 overflow-hidden rounded-md outline-offset-2 transition ${
                i === active ? 'outline outline-2 outline-on-dark' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <ProductPhoto src={src} alt="" className="aspect-square" padding="p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
