import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const lineSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    slug: String,
    name: String,
    mode: { type: String, enum: ['buy', 'rent'], required: true },
    quantity: Number,
    startDate: String,
    endDate: String,
    days: Number,
    unitPrice: Number,
    discountPercent: Number,
    lineTotal: Number,
    deposit: Number,
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    // Random secret in the confirmation link, so order pages are not guessable.
    accessToken: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending_payment', 'paid', 'payment_failed', 'refunded', 'cancelled'],
      default: 'pending_payment',
      index: true,
    },
    lines: { type: [lineSchema], required: true },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
    },
    shipping: {
      method: { type: String, enum: ['pickup', 'cairo_giza', 'other_governorates'] },
      governorate: String,
      city: String,
      street: String,
      building: String,
      floor: String,
      apartment: String,
      notes: String,
    },
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    deposit: Number,
    currency: { type: String, default: 'EGP' },
    payment: {
      provider: { type: String, default: 'paymob' },
      mode: String,
      intentionId: String,
      paymobOrderId: String,
      transactionId: String,
      sourceType: String,
      maskedPan: String,
      message: String,
      paidAt: Date,
      events: { type: [Schema.Types.Mixed], default: [] },
    },
    emailSentAt: Date,
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: unknown };

export const Order: Model<InferSchemaType<typeof orderSchema>> = models.Order || model('Order', orderSchema);
