// Business details shown across the store (footer, contact and policy pages).
// Paymob's review checks that these match the merchant application, so fill
// in the client's registered details before submitting.
export const site = {
  name: 'BackRoom',
  storeName: 'BackRoom Store',
  tagline: 'Buy and rent production gear in Egypt',
  description:
    'BackRoom is a creative production marketplace in Egypt. Buy or rent cinema cameras, lenses, lighting, audio, grip and drones, delivered across Cairo and Giza.',
  legalName: 'BackRoom for Creative Production Services LLC',
  commercialRegister: 'CR No. 000000',
  taxId: 'Tax ID 000-000-000',
  email: 'store@backroom.app',
  phone: '+20 100 000 0000',
  whatsapp: '+20 100 000 0000',
  address: {
    line1: 'BackRoom Studio, 12 Example Street',
    area: 'Zamalek',
    city: 'Cairo',
    country: 'Egypt',
  },
  hours: 'Saturday to Thursday, 10:00 to 20:00',
  social: {
    instagram: 'https://instagram.com/backroom',
  },
  currency: 'EGP',
  lastPolicyUpdate: '21 October 2026',
};

export const fullAddress = `${site.address.line1}, ${site.address.area}, ${site.address.city}, ${site.address.country}`;
