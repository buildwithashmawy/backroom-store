import 'server-only';
import { connectDb } from './db';
import { Product } from '@/models/Product';
import type { Mode, PricedProduct } from './pricing';

export interface StoreProduct extends PricedProduct {
  brand: string;
  category: string;
  summary: string;
  description: string[];
  specs: { label: string; value: string }[];
  inTheBox: string[];
  images: string[];
  art: string;
  compareAtPrice: number | null;
  condition: 'new' | 'used';
  warranty: string;
  featured: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toStoreProduct(p: any): StoreProduct {
  return {
    id: String(p._id),
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    summary: p.summary,
    description: p.description ?? [],
    specs: (p.specs ?? []).map((s: { label: string; value: string }) => ({ label: s.label, value: s.value })),
    inTheBox: p.inTheBox ?? [],
    images: p.images ?? [],
    art: p.art ?? 'camera',
    buyPrice: p.buyPrice ?? null,
    compareAtPrice: p.compareAtPrice ?? null,
    rentPricePerDay: p.rentPricePerDay ?? null,
    deposit: p.deposit ?? 0,
    stock: p.stock ?? 0,
    rentalUnits: p.rentalUnits ?? 0,
    condition: p.condition ?? 'new',
    warranty: p.warranty ?? '',
    featured: Boolean(p.featured),
  };
}

export type Sort = 'featured' | 'price_asc' | 'price_desc' | 'name';

export interface ProductQuery {
  category?: string;
  mode?: Mode;
  q?: string;
  sort?: Sort;
}

export async function listProducts(query: ProductQuery = {}): Promise<StoreProduct[]> {
  await connectDb();
  const filter: Record<string, unknown> = { active: true };
  if (query.category) filter.category = query.category;
  if (query.mode === 'buy') filter.buyPrice = { $ne: null };
  if (query.mode === 'rent') filter.rentPricePerDay = { $ne: null };
  if (query.q) {
    const rx = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { brand: rx }, { summary: rx }];
  }
  const docs = await Product.find(filter).lean();
  const products = docs.map(toStoreProduct);
  const price = (p: StoreProduct) => p.buyPrice ?? p.rentPricePerDay ?? 0;
  switch (query.sort) {
    case 'price_asc':
      return products.sort((a, b) => price(a) - price(b));
    case 'price_desc':
      return products.sort((a, b) => price(b) - price(a));
    case 'name':
      return products.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }
}

export async function getProduct(slug: string): Promise<StoreProduct | null> {
  await connectDb();
  const doc = await Product.findOne({ slug, active: true }).lean();
  return doc ? toStoreProduct(doc) : null;
}

export async function getProductsByIds(ids: string[]): Promise<StoreProduct[]> {
  await connectDb();
  const valid = ids.filter((id) => /^[a-f0-9]{24}$/i.test(id));
  const docs = await Product.find({ _id: { $in: valid }, active: true }).lean();
  return docs.map(toStoreProduct);
}

export async function relatedProducts(product: StoreProduct, limit = 4): Promise<StoreProduct[]> {
  await connectDb();
  const docs = await Product.find({ category: product.category, active: true, slug: { $ne: product.slug } })
    .limit(limit)
    .lean();
  return docs.map(toStoreProduct);
}
