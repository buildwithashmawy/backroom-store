# BackRoom Store

Online store where customers buy or rent production equipment from BackRoom, paid through Paymob. Built with Next.js (App Router), MongoDB and Tailwind, using the dark theme and Manrope type from the BackRoom app's design system.

## What is in it

- **Storefront:** home, shop with category, buy/rent, search and sort filters, product pages with buy and rent modes, cart drawer and cart page, checkout, payment result and order confirmation.
- **Rentals:** daily pricing, 10% off 3+ days and 20% off 7+ days, live availability against paid orders (unpaid orders hold stock for 30 minutes), refundable deposit shown but collected at handover.
- **Paymob:** Intention API and Unified Checkout. The server prices every order itself, never trusts prices from the browser, and confirms payments from the HMAC-signed webhook and redirect. The amount Paymob reports must match the order total.
- **Pages Paymob reviews:** about, contact (form saved to Mongo), FAQ, how renting works, terms, privacy, refund and return policy, delivery and shipping, rental terms. Business details and payment marks are in the footer.
- **Email (optional):** order confirmation and contact form copies through Resend.

## Run it locally

```bash
cp .env.example .env.local      # PAYMOB_MODE=mock works without any keys
docker run -d -p 27017:27017 mongo:7   # or point MONGODB_URI at Atlas
npm install
npm run seed                    # 31 products, safe to re-run
npm run dev
```

With `PAYMOB_MODE=mock`, checkout goes to a local test payment page that sends the same signed redirect Paymob does, so the whole flow works end to end.

`npm test` runs the pricing and HMAC tests. `npm run lint` type-checks.

## Connecting Paymob

1. In the Paymob dashboard (test mode first), open **Settings** and copy the **Secret key**, **Public key** and **HMAC secret**.
2. Under **Payment integrations**, note the integration id of each method to offer (card, mobile wallet, and so on).
3. Set the env vars and switch the mode:
   ```
   PAYMOB_MODE=live
   PAYMOB_SECRET_KEY=...
   PAYMOB_PUBLIC_KEY=...
   PAYMOB_HMAC_SECRET=...
   PAYMOB_INTEGRATION_IDS=1234567,7654321
   APP_URL=https://your-store-domain
   ```
4. Each payment sends Paymob these URLs, so nothing else needs configuring. If you want them set on the integration as well:
   - Transaction processed callback: `APP_URL/api/paymob/webhook`
   - Transaction response callback: `APP_URL/checkout/result`

Test keys and live keys use the same code; only the env vars change.

## Before submitting to Paymob

- Fill in the client's registered company name, commercial register, tax id, address, phone and email in `src/lib/site.ts`. Paymob checks these against the merchant application.
- Review the policies (refund windows, deposit rules, delivery fees in `src/lib/catalog.ts`) with the client.
- Add real product photos: upload to R2 (or any CDN) and put the URLs in each product's `images` array. Until then the store shows drawn artwork per gear type.
- Deploy on a public HTTPS domain so Paymob can reach the webhook.

## Deploying on Railway

`railway.json` builds with `npm run build`, starts with `npm start` and health-checks `/api/health`. Set the env vars above on the service, then run `npm run seed` once against the production database.

## Layout

```
src/app          pages and API routes (api/checkout, api/paymob/webhook, api/cart/quote, api/contact)
src/lib          pricing rules, Paymob client and HMAC, orders and availability, site details
src/models       Mongoose models: Product, Order, ContactMessage
src/components   UI, cart, product art
scripts          seed data and seed script
tests            pricing and Paymob HMAC tests
```
