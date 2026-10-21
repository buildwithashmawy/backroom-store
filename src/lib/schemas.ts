import { z } from 'zod';

export const cartLineSchema = z.object({
  productId: z.string().regex(/^[a-f0-9]{24}$/i),
  mode: z.enum(['buy', 'rent']),
  quantity: z.number().int().min(1).max(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const shippingMethodSchema = z.enum(['pickup', 'cairo_giza', 'other_governorates']);

export const quoteSchema = z.object({
  lines: z.array(cartLineSchema).max(30),
  shippingMethod: shippingMethodSchema.nullable().optional(),
});

const text = (max: number) => z.string().trim().max(max);

export const checkoutSchema = z
  .object({
    lines: z.array(cartLineSchema).min(1).max(30),
    customer: z.object({
      firstName: text(60).min(1, 'Enter your first name'),
      lastName: text(60).min(1, 'Enter your last name'),
      email: z.email('Enter a valid email'),
      phone: z
        .string()
        .trim()
        .regex(/^(\+20|0)?1[0125]\d{8}$/, 'Enter an Egyptian mobile number, like 01001234567'),
    }),
    shipping: z.object({
      method: shippingMethodSchema,
      governorate: text(40).optional().default(''),
      city: text(60).optional().default(''),
      street: text(120).optional().default(''),
      building: text(30).optional().default(''),
      floor: text(10).optional().default(''),
      apartment: text(10).optional().default(''),
      notes: text(500).optional().default(''),
    }),
    acceptTerms: z.literal(true, { error: 'Please accept the terms to continue' }),
  })
  .superRefine((v, ctx) => {
    if (v.shipping.method === 'pickup') return;
    for (const k of ['governorate', 'city', 'street', 'building'] as const) {
      if (!v.shipping[k]) ctx.addIssue({ code: 'custom', path: ['shipping', k], message: 'Required for delivery' });
    }
    if (v.shipping.method === 'cairo_giza' && v.shipping.governorate && !['Cairo', 'Giza'].includes(v.shipping.governorate)) {
      ctx.addIssue({ code: 'custom', path: ['shipping', 'governorate'], message: 'Pick Cairo or Giza for this delivery option' });
    }
    if (v.shipping.method === 'other_governorates' && ['Cairo', 'Giza'].includes(v.shipping.governorate)) {
      ctx.addIssue({ code: 'custom', path: ['shipping', 'governorate'], message: 'Use the Cairo and Giza delivery option' });
    }
  });

export const contactSchema = z.object({
  name: text(80).min(1, 'Enter your name'),
  email: z.email('Enter a valid email'),
  phone: text(30).optional().default(''),
  topic: text(40).optional().default('General'),
  message: text(4000).min(10, 'Tell us a little more'),
  website: z.string().max(0).optional(), // honeypot
});

export function normalizePhone(phone: string) {
  const digits = phone.replace(/^\+20/, '0');
  return digits.startsWith('0') ? `+2${digits}` : `+20${digits}`;
}
