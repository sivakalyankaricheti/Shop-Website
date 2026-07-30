# Payments and shop-owner WhatsApp notifications

The public site must not collect card details or mark a card order as paid without a payment provider.

To enable online payments and automatic owner notifications, connect a server-side integration using:

- **Stripe** for Visa, Mastercard, Apple Pay, Google Pay, and payment confirmation webhooks.
- **WhatsApp Business Cloud API** or **Twilio WhatsApp** to send the owner an order notification after Stripe confirms payment.

Keep Stripe secret keys and WhatsApp access tokens on the server only—never in this GitHub Pages website. The required configuration is the shop owner's WhatsApp Business number, Stripe account keys, and a backend host (for example Vercel, Render, or Cloudflare Workers).

Cash-on-delivery orders are shown to the shop as cash pending, because payment is collected by the driver at delivery.
