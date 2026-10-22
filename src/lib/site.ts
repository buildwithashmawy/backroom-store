// Business details shown across the store (footer, contact and policy pages).
// Paymob's review checks that these match the merchant application, so fill
// in the client's registered details before submitting.
export const site = {
  name: "BackRoom",
  storeName: "BackRoom Store",
  tagline: "Buy and rent production gear in Egypt",
  description:
    "BackRoom is a creative production marketplace in Egypt. Buy or rent cinema cameras, lenses, lighting, audio, grip and drones, delivered across Cairo and Giza.",
  legalName: "BackRoom for Creative Production Services LLC",
  // Shown only once filled in, e.g. 'CR No. 123456' and 'Tax ID 123-456-789'.
  commercialRegister: "",
  taxId: "",
  email: "contact@itsbackroom.com",
  phone: "+20 106 605 8105",
  whatsapp: "+20 106 605 8105",
  address: {
    line1: "Administrative Unit 4, 12th Floor, Building 4, Street 151",
    area: "Maadi",
    city: "Cairo",
    country: "Egypt",
  },
  hours: "Saturday to Thursday, 10:00 to 20:00",
  social: {
    instagram: "https://instagram.com/backroom",
  },
  currency: "EGP",
  lastPolicyUpdate: "21 October 2026",
};

/** Commercial register and tax id, whichever are set. */
export const registration = [site.commercialRegister, site.taxId]
  .filter(Boolean)
  .join(" · ");

export const fullAddress = `${site.address.line1}, ${site.address.area}, ${site.address.city}, ${site.address.country}`;
