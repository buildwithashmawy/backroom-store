// Seeds the product catalogue. Upserts by slug, so it is safe to run again
// after editing scripts/products.ts. Pass --reset to also remove products
// that are no longer in the file.
import mongoose from 'mongoose';
import { Product } from '../src/models/Product';
import { seedProducts } from './products';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Set MONGODB_URI first (see .env.example).');
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'backroom_store' });

  for (const p of seedProducts) {
    const doc = { ...p, specs: p.specs.map(([label, value]) => ({ label, value })), active: true };
    // Keep any images uploaded since the last seed.
    await Product.updateOne({ slug: p.slug }, { $set: doc, $setOnInsert: { images: [] } }, { upsert: true });
  }
  if (process.argv.includes('--reset')) {
    const res = await Product.deleteMany({ slug: { $nin: seedProducts.map((p) => p.slug) } });
    console.log(`Removed ${res.deletedCount} old products.`);
  }
  await Product.syncIndexes();
  console.log(`Seeded ${seedProducts.length} products into ${mongoose.connection.db?.databaseName}.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
