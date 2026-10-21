import { Schema, model, models, type InferSchemaType, type Model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    topic: String,
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const ContactMessage: Model<InferSchemaType<typeof contactSchema>> =
  models.ContactMessage || model('ContactMessage', contactSchema);
