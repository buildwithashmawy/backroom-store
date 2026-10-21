import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    description: { type: [String], default: [] },
    specs: { type: [{ label: String, value: String, _id: false }], default: [] },
    inTheBox: { type: [String], default: [] },
    // Image URLs (R2 or any CDN). When empty the store draws category artwork.
    images: { type: [String], default: [] },
    art: { type: String, default: 'camera' },
    // Null means the mode is not offered for this product.
    buyPrice: { type: Number, default: null },
    compareAtPrice: { type: Number, default: null },
    rentPricePerDay: { type: Number, default: null },
    deposit: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    rentalUnits: { type: Number, default: 0 },
    condition: { type: String, enum: ['new', 'used'], default: 'new' },
    warranty: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', brand: 'text', summary: 'text' });

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: unknown };

export const Product: Model<InferSchemaType<typeof productSchema>> =
  models.Product || model('Product', productSchema);
